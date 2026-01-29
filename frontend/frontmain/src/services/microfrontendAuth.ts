export class HostMicrofrontendAuth {
  private static instance: HostMicrofrontendAuth;

  private constructor() {
    this.initializeAuth();
    this.setupBroadcastChannel();
  }

  public static getInstance(): HostMicrofrontendAuth {
    if (!HostMicrofrontendAuth.instance) {
      HostMicrofrontendAuth.instance = new HostMicrofrontendAuth();
    }
    return HostMicrofrontendAuth.instance;
  }

  private initializeAuth() {
    window.addEventListener("message", (event) => {
      const { type } = event.data;

      switch (type) {
        case "AUTH_TOKEN_REQUEST":
          this.sendTokenToChild(event.source as Window);
          break;
        case "AUTH_TOKEN_RESPONSE":
          break;
      }
    });

    window.addEventListener("storage", (e) => {
      if (e.key === "jwt_token") {
        if (e.newValue) {
          this.broadcastTokenSet(e.newValue);
        } else {
          this.broadcastTokenRemoved();
        }
      }
    });
  }

  private setupBroadcastChannel() {
    try {
      const channel = new BroadcastChannel("auth_channel");

      channel.addEventListener("message", (event) => {
        const { type } = event.data;

        if (type === "AUTH_TOKEN_REQUEST") {
          const token = localStorage.getItem("jwt_token");
          if (token) {
            channel.postMessage({ type: "AUTH_TOKEN_SET", token });
          } else {
            channel.postMessage({ type: "AUTH_TOKEN_REMOVED" });
          }
        }
      });

      (this as any).broadcastChannel = channel;
    } catch (error) {
      console.log("BroadcastChannel not available:", error);
    }
  }

  private sendTokenToChild(childWindow: Window) {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      childWindow.postMessage(
        {
          type: "AUTH_TOKEN_SET",
          token,
        },
        "*"
      );
    } else {
      childWindow.postMessage(
        {
          type: "AUTH_TOKEN_REMOVED",
        },
        "*"
      );
    }
  }

  public broadcastTokenSet(token: string) {
    const message = { type: "AUTH_TOKEN_SET", token };
    this.broadcastToAllChildren(message);
    this.broadcastToChannel(message);
  }

  public broadcastTokenRemoved() {
    const message = { type: "AUTH_TOKEN_REMOVED" };
    this.broadcastToAllChildren(message);
    this.broadcastToChannel(message);
  }

  private broadcastToChannel(message: any) {
    try {
      const channel = (this as any).broadcastChannel;
      if (channel) {
        channel.postMessage(message);
      }
    } catch (error) {
      console.log("Error broadcasting to channel:", error);
    }
  }

  private broadcastToAllChildren(message: any) {
    const iframes = document.querySelectorAll("iframe");
    iframes.forEach((iframe) => {
      if (iframe.contentWindow) {
        iframe.contentWindow.postMessage(message, "*");
      }
    });

    if (window.frames) {
      for (let i = 0; i < window.frames.length; i++) {
        try {
          window.frames[i].postMessage(message, "*");
        } catch (e) {}
      }
    }
  }

  public notifyTokenSet(token: string) {
    this.broadcastTokenSet(token);
  }

  public notifyTokenRemoved() {
    this.broadcastTokenRemoved();
  }
}

export const hostMicrofrontendAuth = HostMicrofrontendAuth.getInstance();
