import React from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

interface Consorcio {
  id: number;
  nome: string;
  descricao: string;
  dataCriacao: string;
  dataAtualizacao: string | null;
}

const GET_CONSORCIOS = gql`
  query ListConsorcios {
    consorcios {
      id
      nome
      descricao
      dataCriacao
      dataAtualizacao
    }
  }
`;

const ConsorcioList: React.FC = () => {
  const { loading, error, data } = useQuery<{
    consorcios: Consorcio[];
  }>(GET_CONSORCIOS);

  if (loading) return <p>Carregando consórcios...</p>;
  if (error) return <p>Erro ao carregar consórcios: {error.message}</p>;

  return (
    <div>
      <h2>Lista de Consórcios (Consorcio App)</h2>
      {data && data.consorcios.length === 0 && (
        <p>Nenhum consórcio encontrado.</p>
      )}
      {data && data.consorcios.length > 0 && (
        <ul>
          {data.consorcios.map((consorcio) => (
            <li key={consorcio.id}>
              <strong>{consorcio.nome}</strong>: {consorcio.descricao} ( Criado
              em: {new Date(consorcio.dataCriacao).toLocaleDateString()}{" "}
              {consorcio.dataAtualizacao &&
                `Atualizado em: ${new Date(
                  consorcio.dataAtualizacao
                ).toLocaleDateString()}`}
              )
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ConsorcioList;
