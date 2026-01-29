import React, { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import UserForm from "./UserForm";

interface User {
  id: number;
  nome: string;
  email: string;
  dataCriacao: string;
  dataAtualizacao?: string;
}

const GET_USERS_QUERY = gql`
  query GetUsuarios {
    usuarios {
      id
      nome
      email
      dataCriacao
      dataAtualizacao
    }
  }
`;

const DELETE_USER_MUTATION = gql`
  mutation DeleteUsuario($id: Int!) {
    deleteUsuario(id: $id)
  }
`;

const UserList: React.FC = () => {
  const { loading, error, data, refetch } = useQuery<{ usuarios: User[] }>(
    GET_USERS_QUERY
  );
  const [showForm, setShowForm] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);

  const [deleteUsuario] = useMutation(DELETE_USER_MUTATION, {
    onCompleted: () => {
      refetch();
      alert("Usuário deletado com sucesso!");
    },
    onError: (err) => {
      alert(`Erro ao deletar usuário: ${err.message}`);
    },
  });

  const handleCreateClick = () => {
    setCurrentUser(undefined);
    setShowForm(true);
  };

  const handleEditClick = (user: User) => {
    setCurrentUser(user);
    setShowForm(true);
  };

  const handleDeleteClick = async (id: number, nome: string) => {
    if (window.confirm(`Tem certeza que deseja deletar o usuário ${nome}?`)) {
      await deleteUsuario({ variables: { id } });
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setCurrentUser(undefined);
  };

  const handleFormSuccess = () => {
    refetch();
    alert("Operação realizada com sucesso!");
  };

  if (loading) return <p>Carregando usuários...</p>;
  if (error) return <p>Erro ao carregar usuários: {error.message}</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Gerenciamento de Usuários</h2>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={handleCreateClick}
      >
        Criar Novo Usuário
      </button>

      <table className="min-w-full bg-white rounded-lg border-gray-200">
        <thead>
          <tr>
            <th className="py-4 px-4 border-b text-center">ID</th>
            <th className="py-4 px-4 border-b text-center">Nome</th>
            <th className="py-4 px-4 border-b text-center">Email</th>
            <th className="py-4 px-4 border-b text-center">Data Criação</th>
            <th className="py-4 px-4 border-b text-center">Data Atualização</th>
            <th className="py-4 px-4 border-b text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {data?.usuarios.map((user) => (
            <tr key={user.id}>
              <td className="py-2 px-4 border-b">{user.id}</td>
              <td className="py-2 px-4 border-b">{user.nome}</td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">
                {new Date(user.dataCriacao).toLocaleDateString()}
              </td>
              <td className="py-2 px-4 border-b">
                {user.dataAtualizacao
                  ? new Date(user.dataAtualizacao).toLocaleDateString()
                  : "N/A"}
              </td>
              <td className="py-2 px-4 border-b">
                <button
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                  onClick={() => handleEditClick(user)}
                >
                  Editar
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  onClick={() => handleDeleteClick(user.id, user.nome)}
                >
                  Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <UserForm
          initialData={currentUser}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default UserList;
