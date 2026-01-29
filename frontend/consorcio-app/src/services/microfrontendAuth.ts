export class MicrofrontendAuth {
  private static instance: MicrofrontendAuth;
  private token: string | null = null;
  private listeners: ((token: string | null) => void)[] = [];

  private constructor() {
    this.initializeAuth();
  }

  public static getInstance(): MicrofrontendAuth {
    if (!MicrofrontendAuth.instance) {
      MicrofrontendAuth.instance = new MicrofrontendAuth();
    }
    return MicrofrontendAuth.instance;
  }

  private initializeAuth() {
    this.token = localStorage.getItem("jwt_token");

    if (window.self === window.top) {
      this.tryFetchTokenFromFrontmain();
    }

    window.addEventListener("message", (event) => {
      if (
        event.origin !== window.location.origin &&
        event.origin !== "http://localhost:3000"
      ) {
        return;
      }

      const { type, token } = event.data;

      switch (type) {
        case "AUTH_TOKEN_SET":
          this.setToken(token);
          break;
        case "AUTH_TOKEN_REMOVED":
          this.removeToken();
          break;
        case "AUTH_TOKEN_REQUEST":
          this.sendTokenToParent();
          break;
      }
    });

    if (window.parent && window.parent !== window) {
      this.requestTokenFromParent();
    }

    window.addEventListener("storage", (e) => {
      if (e.key === "jwt_token") {
        if (e.newValue) {
          this.setToken(e.newValue);
        } else {
          this.removeToken();
        }
      }
    });
  }

  private async tryFetchTokenFromFrontmain() {
    try {
      if (typeof BroadcastChannel !== "undefined") {
        this.setupBroadcastChannel();
      }

      console.log("Running in standalone mode - using local token only");
    } catch (error) {
      console.log("Could not fetch token from frontmain:", error);
    }
  }

  private setupBroadcastChannel() {
    try {
      const channel = new BroadcastChannel("auth_channel");

      channel.addEventListener("message", (event) => {
        const { type, token } = event.data;

        switch (type) {
          case "AUTH_TOKEN_SET":
            this.setToken(token);
            break;
          case "AUTH_TOKEN_REMOVED":
            this.removeToken();
            break;
        }
      });

      channel.postMessage({ type: "AUTH_TOKEN_REQUEST" });

      (this as any).broadcastChannel = channel;
    } catch (error) {
      console.log("BroadcastChannel not available:", error);
    }
  }

  private requestTokenFromParent() {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "AUTH_TOKEN_REQUEST" }, "*");
    }
  }

  private sendTokenToParent() {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(
        {
          type: "AUTH_TOKEN_RESPONSE",
          token: this.token,
        },
        "*"
      );
    }
  }

  public setToken(token: string) {
    this.token = token;
    localStorage.setItem("jwt_token", token);
    this.notifyListeners();

    if (window.self === window.top) {
      this.broadcastToChildren({ type: "AUTH_TOKEN_SET", token });
    }
  }

  public removeToken() {
    this.token = null;
    localStorage.removeItem("jwt_token");
    this.notifyListeners();

    if (window.self === window.top) {
      this.broadcastToChildren({ type: "AUTH_TOKEN_REMOVED" });
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  public isAuthenticated(): boolean {
    if (!this.token) return false;

    try {
      const payload = JSON.parse(atob(this.token.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp ? payload.exp > currentTime : true;
    } catch {
      return false;
    }
  }

  public onAuthChange(callback: (token: string | null) => void) {
    this.listeners.push(callback);

    callback(this.token);

    return () => {
      this.listeners = this.listeners.filter(
        (listener) => listener !== callback
      );
    };
  }

  private notifyListeners() {
    this.listeners.forEach((callback) => callback(this.token));
  }

  private broadcastToChildren(message: any) {
    const iframes = document.querySelectorAll("iframe");
    iframes.forEach((iframe) => {
      if (iframe.contentWindow) {
        iframe.contentWindow.postMessage(message, "*");
      }
    });
  }
}

export const microfrontendAuth = MicrofrontendAuth.getInstance();
