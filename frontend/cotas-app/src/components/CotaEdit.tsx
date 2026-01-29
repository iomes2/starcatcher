import React, { useState, useEffect } from "react";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { useParams } from "react-router-dom";

interface Cota {
  id: number;
  consorcioId: number;
  usuarioId: number;
  numeroCota: string;
  valor: number;
  status: string;
}

interface CotaUpdateInput {
  id: number;
  consorcioId?: number;
  usuarioId?: number;
  numeroCota?: string;
  valor?: number;
  status?: string;
}

interface CotaUpdateResponse {
  updateCota: Cota;
}

interface GetCotaResponse {
  cota: Cota;
}

interface GetCotaVariables {
  id: string;
}

const GET_COTA_BY_ID = gql`
  query GetCota($id: String!) {
    cota(id: $id) {
      id
      consorcioId
      usuarioId
      numeroCota
      valor
      status
    }
  }
`;

const UPDATE_COTA = gql`
  mutation UpdateCota($updateCotaInput: CotaUpdateInput!) {
    updateCota(updateCotaInput: $updateCotaInput) {
      id
      numeroCota
      status
    }
  }
`;

const CotaEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [consorcioId, setConsorcioId] = useState<string>("");
  const [usuarioId, setUsuarioId] = useState<string>("");
  const [numeroCota, setNumeroCota] = useState("");
  const [valor, setValor] = useState<string>("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    loading: queryLoading,
    error: queryError,
    data: queryData,
  } = useQuery<GetCotaResponse, GetCotaVariables>(GET_COTA_BY_ID, {
    variables: { id: id || "" },
    skip: !id,
  });

  const [updateCota] = useMutation<
    CotaUpdateResponse,
    { updateCotaInput: CotaUpdateInput }
  >(UPDATE_COTA);

  useEffect(() => {
    if (queryData && queryData.cota) {
      setConsorcioId(queryData.cota.consorcioId.toString());
      setUsuarioId(queryData.cota.usuarioId.toString());
      setNumeroCota(queryData.cota.numeroCota);
      setValor(queryData.cota.valor.toString());
      setStatus(queryData.cota.status);
    }
  }, [queryData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!id) {
      setError("ID da cota não fornecido para edição.");
      return;
    }

    try {
      const { data } = await updateCota({
        variables: {
          updateCotaInput: {
            id: parseInt(id),
            consorcioId: parseInt(consorcioId),
            usuarioId: parseInt(usuarioId),
            numeroCota,
            valor: parseFloat(valor),
            status,
          },
        },
      });
      if (data && data.updateCota) {
        setMessage(
          `Cota \'${data.updateCota.numeroCota}\' atualizada com sucesso!`
        );
      } else {
        setError("Erro ao atualizar cota: Dados inválidos.");
      }
    } catch (err: any) {
      console.error("Erro ao atualizar cota:", err);
      setError(err.message || "Ocorreu um erro ao atualizar a cota.");
    }
  };

  if (queryLoading) return <p>Carregando dados da cota...</p>;
  if (queryError) return <p>Erro ao carregar cota: {queryError.message}</p>;

  return (
    <div>
      <h2>Editar Cota (Cota App)</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="edit-consorcioId">ID do Consórcio:</label>
          <input
            type="number"
            id="edit-consorcioId"
            value={consorcioId}
            onChange={(e) => setConsorcioId(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="edit-usuarioId">ID do Usuário:</label>
          <input
            type="number"
            id="edit-usuarioId"
            value={usuarioId}
            onChange={(e) => setUsuarioId(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="edit-numeroCota">Número da Cota:</label>
          <input
            type="text"
            id="edit-numeroCota"
            value={numeroCota}
            onChange={(e) => setNumeroCota(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="edit-valor">Valor:</label>
          <input
            type="number"
            step="0.01"
            id="edit-valor"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="edit-status">Status:</label>
          <input
            type="text"
            id="edit-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
        </div>
        <button type="submit">Atualizar Cota</button>
      </form>
    </div>
  );
};

export default CotaEdit;
