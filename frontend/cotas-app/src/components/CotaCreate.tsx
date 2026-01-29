import React, { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";

interface Cota {
  id: number;
  consorcioId: number;
  usuarioId: number;
  numeroCota: string;
  valor: number;
  status: string;
}

interface CotaInput {
  consorcioId: number;
  usuarioId: number;
  numeroCota: string;
  valor: number;
  status: string;
}

interface CotaCreateResponse {
  createCota: {
    id: number;
    numeroCota: string;
  };
}

const CREATE_COTA = gql`
  mutation CreateCota($cotaInput: CotaInput!) {
    createCota(cotaInput: $cotaInput) {
      id
      numeroCota
    }
  }
`;

const CotaCreate: React.FC = () => {
  const [consorcioId, setConsorcioId] = useState<string>("");
  const [usuarioId, setUsuarioId] = useState<string>("");
  const [numeroCota, setNumeroCota] = useState("");
  const [valor, setValor] = useState<string>("");
  const [status, setStatus] = useState("");
  const [createCota] = useMutation<
    CotaCreateResponse,
    { cotaInput: CotaInput }
  >(CREATE_COTA);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const { data } = await createCota({
        variables: {
          cotaInput: {
            consorcioId: parseInt(consorcioId),
            usuarioId: parseInt(usuarioId),
            numeroCota,
            valor: parseFloat(valor),
            status,
          },
        },
      });
      if (data && data.createCota) {
        setMessage(
          `Cota \'${data.createCota.numeroCota}\' criada com sucesso!`
        );
        setConsorcioId("");
        setUsuarioId("");
        setNumeroCota("");
        setValor("");
        setStatus("");
      } else {
        setError("Erro ao criar cota: Dados inválidos.");
      }
    } catch (err: any) {
      console.error("Erro ao criar cota:", err);
      setError(err.message || "Ocorreu um erro ao criar a cota.");
    }
  };

  return (
    <div>
      <h2>Criar Cota (Cota App)</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="consorcioId">ID do Consórcio:</label>
          <input
            type="number"
            id="consorcioId"
            value={consorcioId}
            onChange={(e) => setConsorcioId(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="usuarioId">ID do Usuário:</label>
          <input
            type="number"
            id="usuarioId"
            value={usuarioId}
            onChange={(e) => setUsuarioId(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="numeroCota">Número da Cota:</label>
          <input
            type="text"
            id="numeroCota"
            value={numeroCota}
            onChange={(e) => setNumeroCota(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="valor">Valor:</label>
          <input
            type="number"
            step="0.01"
            id="valor"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="status">Status:</label>
          <input
            type="text"
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
        </div>
        <button type="submit">Criar Cota</button>
      </form>
    </div>
  );
};

export default CotaCreate;
