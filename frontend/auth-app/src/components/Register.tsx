import React, { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setError } from "../features/auth/authSlice";
import { RootState } from "../app/store";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

interface UsuarioInput {
  nome: string;
  email: string;
  senha: string;
  dataCriacao: string;
  dataAtualizacao?: string;
}

interface UsuarioOutput {
  id?: number;
  nome?: string;
  email?: string;
  dataCriacao?: string;
  dataAtualizacao?: string;
  cotas?: any[];
}

interface CreateUsuarioMutationResponse {
  createUsuario: UsuarioOutput;
}

interface CreateUsuarioMutationVariables {
  usuarioInput: UsuarioInput;
}

const CREATE_USUARIO_MUTATION = gql`
  mutation CreateUsuario($usuarioInput: UsuarioInput!) {
    createUsuario(usuarioInput: $usuarioInput) {
      id
      nome
      email
      dataCriacao
      dataAtualizacao
    }
  }
`;

const Register: React.FC = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [createUsuario] = useMutation<
    CreateUsuarioMutationResponse,
    CreateUsuarioMutationVariables
  >(CREATE_USUARIO_MUTATION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const currentDate = new Date().toISOString();
      const { data } = await createUsuario({
        variables: {
          usuarioInput: {
            nome,
            email,
            senha,
            dataCriacao: currentDate,
          },
        },
      });

      if (data && data.createUsuario) {
        navigate("/");
        setNome("");
        setEmail("");
        setSenha("");
      } else {
        dispatch(setError("Falha no registro: Usuário não foi criado."));
      }
    } catch (err: any) {
      console.error("Erro no registro:", err);
      dispatch(setError(err.message || "Ocorreu um erro ao tentar registrar."));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Registro (Auth App)</h2>
        {isLoading && <p className="loading">Carregando...</p>}
        {error && <p className="error">Erro: {error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="reg-nome">Nome:</label>
            <input
              type="text"
              id="reg-nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="reg-email">Email:</label>
            <input
              type="email"
              id="reg-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="reg-senha">Senha:</label>
            <input
              type="password"
              id="reg-senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="register-button"
          >
            Registrar
          </button>
        </form>
        <p className="login-link">
          Já tem uma conta? <Link to="/login">Faça login aqui</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
