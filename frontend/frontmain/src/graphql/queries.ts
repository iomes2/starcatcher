import { gql } from "@apollo/client";

export interface Cota {
  id: number;
  numeroCota: string;
  valor: number;
  status: string;
  usuarioId: number;
  consorcioId: number;
  dataCriacao: string;
  dataAtualizacao?: string;
}

export interface Consorcio {
  id: number;
  nome: string;
  descricao?: string;
  dataCriacao: string;
  dataAtualizacao?: string;
  cotas?: Cota[];
}

export interface GetConsorciosData {
  consorcios: Consorcio[];
}

export interface GetCotasData {
  cotas: Cota[];
}

export const GET_CONSORCIOS = gql`
  query Consorcios {
    consorcios {
      id
      nome
      descricao
      dataCriacao
      dataAtualizacao
    }
  }
`;

export const GET_COTAS = gql`
  query Cotas {
    cotas {
      id
      numeroCota
      valor
      status
      usuarioId
      consorcioId
      dataCriacao
      dataAtualizacao
    }
  }
`;
