import React, { Suspense, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials, logout } from "./features/auth/authSlice";
import { RootState } from "./app/store";
import { isJWTExpired } from "./utils/jwtUtils";
import { useJWTExpirationCheck } from "./utils/useJWTExpirationCheck";
import { useMicrofrontendAuth } from "./hooks/useMicrofrontendAuth";
import "./App.css";
import Inicio from "./components/Inicio/Inicio";
const RemoteDashboard = React.lazy(
  () => import("./components/Dashboard/Dashboard")
);

const RemoteLoginApp = React.lazy(() => import("authApp/Login"));
const RemoteRegisterApp = React.lazy(() => import("authApp/Register"));

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  useJWTExpirationCheck();

  useMicrofrontendAuth();

  useEffect(() => {
    const storedToken = localStorage.getItem("jwt_token");
    if (storedToken) {
      if (isJWTExpired(storedToken)) {
        console.log("JWT expirado, fazendo logout automático...");
        dispatch(logout());
        navigate("/login");
        return;
      }

      const userName = localStorage.getItem("user_nome");
      const userEmail = localStorage.getItem("user_email");

      const user = {
        id: 0,
        nome: userName || "Usuário",
        email: userEmail || "usuario@starcatcher.com",
      };

      dispatch(setCredentials({ token: storedToken, user }));
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    if (token) {
      if (location.pathname === "/login" || location.pathname === "/register") {
        navigate("/");
      }
    } else if (
      location.pathname !== "/login" &&
      location.pathname !== "/register" &&
      location.pathname !== "/"
    ) {
      navigate("/login");
    }
  }, [token, navigate, location.pathname]);

  return (
    <div className="App">
      <main>
        <Suspense fallback={<div>Carregando...</div>}>
          <Routes>
            {token ? (
              <Route path="/*" element={<RemoteDashboard />} />
            ) : (
              <>
                <Route path="/login" element={<RemoteLoginApp />} />
                <Route path="/register" element={<RemoteRegisterApp />} />
                <Route path="/" element={<Inicio />} />
              </>
            )}
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;
