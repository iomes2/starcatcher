import React, { useState, useEffect } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

interface UserFormProps {
  initialData?: {
    id?: number;
    nome: string;
    email: string;
    dataCriacao?: string;
    dataAtualizacao?: string;
  };
  onClose: () => void;
  onSuccess: () => void;
}

const CREATE_USER_MUTATION = gql`
  mutation CreateUsuario($usuarioInput: UsuarioInput!) {
    createUsuario(usuarioInput: $usuarioInput) {
      id
      nome
      email
      dataCriacao
    }
  }
`;

const UPDATE_USER_MUTATION = gql`
  mutation UpdateUsuario($id: Int!, $usuarioInput: UsuarioInput!) {
    updateUsuario(id: $id, usuarioInput: $usuarioInput) {
      id
      nome
      email
      dataAtualizacao
    }
  }
`;

const UserForm: React.FC<UserFormProps> = ({
  initialData,
  onClose,
  onSuccess,
}) => {
  const [nome, setNome] = useState(initialData?.nome || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [senha, setSenha] = useState("");
  const [dataCriacao, setDataCriacao] = useState(
    initialData?.dataCriacao || new Date().toISOString()
  );

  const [createUsuario] = useMutation(CREATE_USER_MUTATION, {
    onCompleted: () => {
      onSuccess();
      onClose();
    },
    onError: (error) => {
      alert(`Erro ao criar usuário: ${error.message}`);
    },
  });

  const [updateUsuario] = useMutation(UPDATE_USER_MUTATION, {
    onCompleted: () => {
      onSuccess();
      onClose();
    },
    onError: (error) => {
      alert(`Erro ao atualizar usuário: ${error.message}`);
    },
  });

  useEffect(() => {
    if (initialData) {
      setNome(initialData.nome);
      setEmail(initialData.email);
      setDataCriacao(initialData.dataCriacao || new Date().toISOString());
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const usuarioInput = {
      nome,
      email,
      dataCriacao,
      ...(senha && { senha }),
    };

    if (initialData?.id) {
      await updateUsuario({ variables: { id: initialData.id, usuarioInput } });
    } else {
      if (!senha) {
        alert("Senha é obrigatória para novos usuários!");
        return;
      }
      await createUsuario({
        variables: { usuarioInput: { ...usuarioInput, senha } },
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          {initialData?.id ? "Editar Usuário" : "Criar Novo Usuário"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="nome"
            >
              Nome:
            </label>
            <input
              type="text"
              id="nome"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="senha"
            >
              Senha:
            </label>
            <input
              type="password"
              id="senha"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required={!initialData?.id}
              placeholder={
                initialData?.id
                  ? "Deixe em branco para manter a senha atual"
                  : "Digite a senha"
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {initialData?.id ? "Atualizar" : "Criar"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
