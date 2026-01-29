import React, { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setError } from "../features/auth/authSlice";
import { RootState } from "../app/store";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

interface AuthInput {
  nome: string;
  senha: string;
}

interface LoginMutationResponse {
  login: {
    token: string;
  };
}

interface LoginMutationVariables {
  authInput: AuthInput;
}

const LOGIN_MUTATION = gql`
  mutation Login($authInput: AuthInput!) {
    login(authInput: $authInput) {
      token
    }
  }
`;

const Login: React.FC = () => {
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [loginUser] = useMutation<
    LoginMutationResponse,
    LoginMutationVariables
  >(LOGIN_MUTATION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const { data } = await loginUser({
        variables: {
          authInput: { nome, senha },
        },
      });

      if (data && data.login && data.login.token) {
        localStorage.setItem("jwt_token", data.login.token);
        localStorage.setItem("user_nome", nome);
        localStorage.setItem("user_email", `${nome}@starcatcher.com`);

        console.log(
          "Login.tsx: Login bem-sucedido! Token e dados do usuário salvos no localStorage.",
          { token: data.login.token, nome }
        );
        navigate("/");

        setNome("");
        setSenha("");
      } else {
        dispatch(setError("Falha no login: Token não recebido."));
      }
    } catch (err: any) {
      console.error("Erro no login:", err);
      dispatch(
        setError(err.message || "Ocorreu um erro ao tentar fazer login.")
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login (Auth App)</h2>
        {isLoading && <p className="loading">Carregando...</p>}
        {error && <p className="error">Erro: {error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome:</label>
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="senha">Senha:</label>
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <button type="submit" disabled={isLoading} className="login-button">
            Entrar
          </button>
        </form>
        <p className="register-link">
          Não tem uma conta? <Link to="/register">Registre-se aqui</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
