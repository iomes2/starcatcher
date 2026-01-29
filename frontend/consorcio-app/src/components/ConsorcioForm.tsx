import React, { useState, useEffect } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

interface ConsorcioFormProps {
  initialData?: {
    id?: number;
    nome: string;
    descricao?: string;
    dataCriacao?: string;
    dataAtualizacao?: string;
  };
  onClose: () => void;
  onSuccess: () => void;
}

const CREATE_CONSORCIO_MUTATION = gql`
  mutation CreateConsorcio($consorcioInput: ConsorcioInput!) {
    createConsorcio(consorcioInput: $consorcioInput) {
      id
      nome
      descricao
      dataCriacao
    }
  }
`;

const UPDATE_CONSORCIO_MUTATION = gql`
  mutation UpdateConsorcio($id: Int!, $consorcioInput: UpdateConsorcioInput!) {
    updateConsorcio(id: $id, consorcioInput: $consorcioInput) {
      id
      nome
      descricao
      dataAtualizacao
    }
  }
`;

const ConsorcioForm: React.FC<ConsorcioFormProps> = ({
  initialData,
  onClose,
  onSuccess,
}) => {
  const [nome, setNome] = useState(initialData?.nome || "");
  const [descricao, setDescricao] = useState(initialData?.descricao || "");
  const [dataCriacao, setDataCriacao] = useState(
    initialData?.dataCriacao || new Date().toISOString()
  );

  const [createConsorcio] = useMutation(CREATE_CONSORCIO_MUTATION, {
    onCompleted: () => {
      onSuccess();
      onClose();
    },
    onError: (error) => {
      alert(`Erro ao criar consórcio: ${error.message}`);
    },
  });

  const [updateConsorcio] = useMutation(UPDATE_CONSORCIO_MUTATION, {
    onCompleted: () => {
      onSuccess();
      onClose();
    },
    onError: (error) => {
      alert(`Erro ao atualizar consórcio: ${error.message}`);
    },
  });

  useEffect(() => {
    if (initialData) {
      setNome(initialData.nome);
      setDescricao(initialData.descricao || "");
      setDataCriacao(initialData.dataCriacao || new Date().toISOString());
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const consorcioInput = {
      nome,
      descricao,
      dataCriacao,
    };

    if (initialData?.id) {
      await updateConsorcio({
        variables: { id: initialData.id, consorcioInput },
      });
    } else {
      await createConsorcio({ variables: { consorcioInput } });
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          {initialData?.id ? "Editar Consórcio" : "Criar Novo Consórcio"}
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
              htmlFor="descricao"
            >
              Descrição:
            </label>
            <textarea
              id="descricao"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={4}
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

export default ConsorcioForm;
