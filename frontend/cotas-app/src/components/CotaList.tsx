import React from "react";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";

interface Cota {
  id: number;
  consorcioId: number;
  usuarioId: number;
  numeroCota: string;
  valor: number;
  status: string;
  dataCriacao: string;
  dataAtualizacao: string | null;
}

const GET_COTAS = gql`
  query ListCotas {
    cotas {
      id
      consorcioId
      usuarioId
      numeroCota
      valor
      status
      dataCriacao
      dataAtualizacao
    }
  }
`;

const CotaList: React.FC = () => {
  const { loading, error, data } = useQuery<{
    cotas: Cota[];
  }>(GET_COTAS);

  if (loading) return <p>Carregando cotas...</p>;
  if (error) return <p>Erro ao carregar cotas: {error.message}</p>;

  return (
    <div>
      <h2>Lista de Cotas (Cota App)</h2>
      {data && data.cotas.length === 0 && <p>Nenhuma cota encontrada.</p>}
      {data && data.cotas.length > 0 && (
        <ul>
          {data.cotas.map((cota) => (
            <li key={cota.id}>
              <strong>{cota.numeroCota}</strong> (Valor: {cota.valor}) - Status:{" "}
              {cota.status} ( Criada em:{" "}
              {new Date(cota.dataCriacao).toLocaleDateString()}{" "}
              {cota.dataAtualizacao &&
                `Atualizada em: ${new Date(
                  cota.dataAtualizacao
                ).toLocaleDateString()}`}
              )
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CotaList;
