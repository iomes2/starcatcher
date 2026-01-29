import { useEffect } from "react";
import { hostMicrofrontendAuth } from "../services/microfrontendAuth";

export const useMicrofrontendAuth = () => {
  useEffect(() => {
    console.log("Microfrontend auth initialized");
  }, []);
};
