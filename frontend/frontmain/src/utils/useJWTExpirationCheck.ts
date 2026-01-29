import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";
import { RootState } from "../app/store";
import { isJWTExpired } from "../utils/jwtUtils";

/**
 * Hook personalizado para verificar automaticamente a expiração do JWT
 * @param checkInterval - Intervalo de verificação em milissegundos (padrão: 30000ms = 30s)
 */
export const useJWTExpirationCheck = (checkInterval: number = 30000) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!token) return;

    const checkTokenExpiration = () => {
      if (isJWTExpired(token)) {
        console.log("Token expirado detectado, fazendo logout automático...");
        dispatch(logout());
        navigate("/login");
      }
    };

    checkTokenExpiration();

    const interval = setInterval(checkTokenExpiration, checkInterval);

    return () => clearInterval(interval);
  }, [token, dispatch, navigate, checkInterval]);
};

export default useJWTExpirationCheck;
