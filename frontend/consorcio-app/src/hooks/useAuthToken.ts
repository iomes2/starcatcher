import { useState, useEffect } from "react";
import { microfrontendAuth } from "../services/microfrontendAuth";

export const useAuthToken = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initToken = localStorage.getItem("jwt_token");
    if (initToken) {
      setToken(initToken);
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, []);

  return { token, isAuthenticated, loading };
};
