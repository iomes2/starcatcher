import React, { useState } from "react";
import { gql } from "@apollo/client";
import { useQuery, useMutation, ApolloProvider } from "@apollo/client/react";
import { client } from "../apollo";
import { useAuthToken } from "../hooks/useAuthToken";
import "./ConsorcioManager.css";

interface Consorcio {
  id: number;
  nome: string;
  descricao: string;
  dataCriacao: string;
  dataAtualizacao: string | null;
}

interface Cota {
  id: number;
  numeroCota: string;
  valor: number;
  status: string;
  usuarioId: number;
  dataCriacao: string;
  dataAtualizacao: string | null;
}

interface Usuario {
  id: number;
  nome: string;
  email: string;
  dataCriacao: string;
  dataAtualizacao: string | null;
}

interface CreateConsorcioResponse {
  createConsorcio: {
    id: number;
    nome: string;
    descricao: string;
    dataCriacao: string;
  };
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

const DELETE_CONSORCIO_MUTATION = gql`
  mutation DeleteConsorcio($id: Int!) {
    deleteConsorcio(id: $id)
  }
`;

const GET_COTAS_BY_CONSORCIO = gql`
  query CotasByConsorcio($consorcioId: Int!) {
    cotasByConsorcioId(consorcioId: $consorcioId) {
      id
      numeroCota
      valor
      status
      usuarioId
      dataCriacao
      dataAtualizacao
    }
  }
`;

const GET_USUARIOS = gql`
  query Usuarios {
    usuarios {
      id
      nome
      email
      dataCriacao
      dataAtualizacao
    }
  }
`;

const ConsorcioManagerContent: React.FC = () => {
  const { token, isAuthenticated, loading: authLoading } = useAuthToken();

  const [searchTerm, setSearchTerm] = useState("");

  const [novoConsorcio, setNovoConsorcio] = useState({
    nome: "",
    descricao: "",
    valor: "",
  });

  const [editingConsorcio, setEditingConsorcio] = useState<Consorcio | null>(
    null
  );
  const [isFormVisible, setIsFormVisible] = useState(false);

  const [viewingConsorcio, setViewingConsorcio] = useState<Consorcio | null>(
    null
  );

  const { loading, error, data, refetch } = useQuery<{
    consorcios: Consorcio[];
  }>(GET_CONSORCIOS);

  const {
    loading: loadingCotas,
    error: errorCotas,
    data: dataCotas,
  } = useQuery<{ cotasByConsorcioId: Cota[] }>(GET_COTAS_BY_CONSORCIO, {
    variables: { consorcioId: viewingConsorcio?.id },
    skip: !viewingConsorcio,
  });

  const {
    loading: loadingUsuarios,
    error: errorUsuarios,
    data: dataUsuarios,
  } = useQuery<{ usuarios: Usuario[] }>(GET_USUARIOS, {
    skip: !viewingConsorcio,
  });

  const [createConsorcio] = useMutation(CREATE_CONSORCIO_MUTATION, {
    onCompleted: () => {
      setNovoConsorcio({ nome: "", descricao: "", valor: "" });
      setIsFormVisible(false);
      refetch();
    },
    onError: (error) => {
      alert(`Erro ao criar consórcio: ${error.message}`);
    },
  });

  const [updateConsorcio] = useMutation(UPDATE_CONSORCIO_MUTATION, {
    onCompleted: () => {
      setEditingConsorcio(null);
      setNovoConsorcio({ nome: "", descricao: "", valor: "" });
      setIsFormVisible(false);
      refetch();
    },
    onError: (error) => {
      alert(`Erro ao atualizar consórcio: ${error.message}`);
    },
  });

  const [deleteConsorcio] = useMutation(DELETE_CONSORCIO_MUTATION, {
    onCompleted: () => {
      refetch();
      alert("Consórcio excluído com sucesso!");
    },
    onError: (error) => {
      alert(`Erro ao deletar consórcio: ${error.message}`);
    },
  });

  const consorcios: Consorcio[] = data?.consorcios || [];
  const filteredConsorcios = consorcios.filter(
    (c) =>
      c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddConsorcio = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!novoConsorcio.nome.trim()) {
      alert("Nome é obrigatório");
      return;
    }

    if (
      !editingConsorcio &&
      (!novoConsorcio.valor.trim() || parseFloat(novoConsorcio.valor) <= 0)
    ) {
      alert("Valor das cotas é obrigatório e deve ser maior que zero");
      return;
    }

    const consorcioInput = {
      nome: novoConsorcio.nome,
      descricao: novoConsorcio.descricao,
      dataCriacao: new Date().toISOString(),
    };

    if (editingConsorcio) {
      await updateConsorcio({
        variables: { id: editingConsorcio.id, consorcioInput },
      });
    } else {
      try {
        const result = await createConsorcio({ variables: { consorcioInput } });

        if (result.data && novoConsorcio.valor) {
          const responseData = result.data as CreateConsorcioResponse;
          const consorcioId = responseData.createConsorcio.id;
          localStorage.setItem(
            `consorcio_${consorcioId}_valor`,
            novoConsorcio.valor
          );
          console.log(
            `Valor R$ ${novoConsorcio.valor} salvo para o consórcio ${consorcioId}`
          );
        }
      } catch (error) {
        console.error("Erro ao criar consórcio:", error);
      }
    }
  };

  const handleEditConsorcio = (consorcio: Consorcio) => {
    setEditingConsorcio(consorcio);
    setNovoConsorcio({
      nome: consorcio.nome,
      descricao: consorcio.descricao,
      valor: "",
    });
    setIsFormVisible(true);
  };

  const handleDeleteConsorcio = async (id: number) => {
    if (window.confirm("Tem certeza que deseja deletar este consórcio?")) {
      if (viewingConsorcio) {
        setViewingConsorcio(null);
      }
      await deleteConsorcio({ variables: { id } });
    }
  };

  const handleViewConsorcio = (consorcio: Consorcio) => {
    setViewingConsorcio(consorcio);
  };

  const handleCancelEdit = () => {
    setEditingConsorcio(null);
    setNovoConsorcio({ nome: "", descricao: "", valor: "" });
    setIsFormVisible(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  const isStandalone = window.self === window.top;

  if (!isAuthenticated && !isStandalone) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl text-center">
          <div className="mb-6">
            <svg
              className="mx-auto h-16 w-16 text-red-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Acesso Não Autorizado
            </h2>
            <p className="text-gray-600">
              Você precisa estar logado no sistema principal para acessar esta
              funcionalidade.
            </p>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              Por favor, faça login no sistema principal e tente novamente.
            </p>
            <button
              onClick={() => (window.location.href = "/login")}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Ir para Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl font-semibold text-gray-600">
          Carregando consórcios...
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl font-semibold text-red-600">
          Erro ao carregar consórcios: {error.message}
        </div>
      </div>
    );

  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 z-0 "
        style={{
          filter: "blur(8px)",
        }}
      ></div>

      <div className="relative z-10 bg-black/20 backdrop-blur-sm min-h-screen">
        <div className="container mx-auto p-8">
          <main
            className={`grid gap-8 ${
              viewingConsorcio ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
            }`}
          >
            <div className={`${viewingConsorcio ? "max-w-2xl" : "max-w-2xl"}`}>
              <div
                className="backdrop-blur-xl border border-white/20 p-6 rounded-xl shadow-lg space-y-6 text-black"
                style={{ backgroundColor: "#e6e6e6" }}
              >
                <h2 className="text-3xl font-semibold">Consórcios</h2>

                <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
                  <input
                    type="text"
                    placeholder="Pesquisar consórcio..."
                    className="w-full p-2 bg-transparent border border-white/20 rounded-md mb-4 placeholder:text-black/0 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black border-black"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <ul className="zebra-list space-y-2 h-48 overflow-y-auto pr-2">
                    {filteredConsorcios.map((consorcio) => (
                      <li
                        key={consorcio.id}
                        className="flex justify-between items-center p-3 rounded-md transition-colors hover:bg-white/30 odd:bg-gray-100/80 even:bg-gray-200/90 backdrop-blur-sm border border-white/20"
                      >
                        <div className="flex-1">
                          <span className="text-gray-800 font-medium">
                            ID: {consorcio.id} | {consorcio.nome}
                          </span>
                          {consorcio.descricao && (
                            <p className="text-sm text-gray-600 mt-1">
                              {consorcio.descricao}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewConsorcio(consorcio)}
                            className={`text-white py-1 px-3 rounded-md border transition-all shadow-sm text-sm ${
                              viewingConsorcio?.id === consorcio.id
                                ? "bg-green-600 hover:bg-green-700 border-green-400/50"
                                : "bg-purple-600 hover:bg-purple-700 border-purple-400/50"
                            }`}
                          >
                            {viewingConsorcio?.id === consorcio.id
                              ? "Visualizando"
                              : "Visualizar"}
                          </button>
                          <button
                            onClick={() => handleEditConsorcio(consorcio)}
                            className="bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700 border border-blue-400/50 transition-all shadow-sm text-sm"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteConsorcio(consorcio.id)}
                            className="bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700 border border-red-400/50 transition-all shadow-sm text-sm"
                          >
                            Excluir
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4 text-black">
                    {editingConsorcio
                      ? "Editar Consórcio"
                      : "Adicionar Novo Consórcio"}
                  </h3>
                  <form onSubmit={handleAddConsorcio} className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="consorcio-nome"
                          className="block text-sm font-medium text-black mb-2"
                        >
                          Nome do Consórcio *
                        </label>
                        <input
                          id="consorcio-nome"
                          type="text"
                          placeholder="Ex: Consórcio Casas 2024"
                          className="w-full p-3 bg-white/90 border border-gray-300 rounded-md text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                          value={novoConsorcio.nome}
                          onChange={(e) =>
                            setNovoConsorcio({
                              ...novoConsorcio,
                              nome: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="consorcio-descricao"
                          className="block text-sm font-medium text-black mb-2"
                        >
                          Descrição
                        </label>
                        <textarea
                          id="consorcio-descricao"
                          placeholder="Ex: Consórcio para aquisição de imóveis residenciais com valor de até R$ 300.000,00"
                          className="w-full p-3 bg-white/90 border border-gray-300 rounded-md text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
                          rows={3}
                          value={novoConsorcio.descricao}
                          onChange={(e) =>
                            setNovoConsorcio({
                              ...novoConsorcio,
                              descricao: e.target.value,
                            })
                          }
                        />
                      </div>

                      {!editingConsorcio && (
                        <div>
                          <label
                            htmlFor="consorcio-valor"
                            className="block text-sm font-medium text-black mb-2"
                          >
                            Valor das Cotas *
                          </label>
                          <input
                            id="consorcio-valor"
                            type="number"
                            step="100"
                            min="0"
                            placeholder="Ex: 15000.00"
                            className="w-full p-3 bg-white/90 border border-gray-300 rounded-md text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            value={novoConsorcio.valor}
                            onChange={(e) =>
                              setNovoConsorcio({
                                ...novoConsorcio,
                                valor: e.target.value,
                              })
                            }
                            required
                          />
                          <p className="text-xs text-gray-600 mt-1">
                            Este será o valor padrão para as cotas deste
                            consórcio
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400"
                      >
                        {editingConsorcio ? "Atualizar" : "Adicionar"}
                      </button>
                      {editingConsorcio && (
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gray-400"
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {viewingConsorcio && (
              <div
                className="backdrop-blur-xl border border-white/20 p-6 rounded-xl shadow-lg space-y-6 text-black"
                style={{ backgroundColor: "#e6e6e6" }}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-semibold">
                    Detalhes do Consórcio
                  </h2>
                  <button
                    onClick={() => setViewingConsorcio(null)}
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md transition-all shadow-sm"
                  >
                    ✕ Fechar
                  </button>
                </div>

                <div className="bg-white/20 backdrop-blur-lg rounded-lg p-4 space-y-3">
                  <h3 className="text-xl font-bold text-gray-800">
                    {viewingConsorcio.nome}
                  </h3>
                  {viewingConsorcio.descricao && (
                    <p className="text-gray-700">
                      {viewingConsorcio.descricao}
                    </p>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold text-gray-800">ID:</span>
                      <span className="text-gray-700 ml-2">
                        {viewingConsorcio.id}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800">
                        Data de Criação:
                      </span>
                      <span className="text-gray-700 ml-2">
                        {new Date(
                          viewingConsorcio.dataCriacao
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    {viewingConsorcio.dataAtualizacao && (
                      <div className="md:col-span-2">
                        <span className="font-semibold text-gray-800">
                          Última Atualização:
                        </span>
                        <span className="text-gray-700 ml-2">
                          {new Date(
                            viewingConsorcio.dataAtualizacao
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
                  <h4 className="text-lg font-semibold mb-4 text-black">
                    Usuários Participantes
                  </h4>

                  {loadingCotas || loadingUsuarios ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-gray-700">
                        Carregando usuários...
                      </span>
                    </div>
                  ) : errorCotas || errorUsuarios ? (
                    <div className="text-red-600 py-4">
                      Erro ao carregar dados:{" "}
                      {errorCotas?.message || errorUsuarios?.message}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {(() => {
                        const cotas = dataCotas?.cotasByConsorcioId || [];
                        const usuarios = dataUsuarios?.usuarios || [];

                        const usuariosDoConsorcio = usuarios.filter((usuario) =>
                          cotas.some((cota) => cota.usuarioId === usuario.id)
                        );

                        if (usuariosDoConsorcio.length === 0) {
                          return (
                            <p className="text-gray-600 py-4">
                              Nenhum usuário encontrado neste consórcio.
                            </p>
                          );
                        }

                        return (
                          <ul className="zebra-list space-y-2 h-64 overflow-y-auto pr-2">
                            {usuariosDoConsorcio.map((usuario) => {
                              const cotasDoUsuario = cotas.filter(
                                (cota) => cota.usuarioId === usuario.id
                              );
                              return (
                                <li
                                  key={usuario.id}
                                  className="p-3 rounded-md transition-colors hover:bg-white/30 odd:bg-gray-100/80 even:bg-gray-200/90 backdrop-blur-sm border border-white/20"
                                >
                                  <div className="flex flex-col space-y-2">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h5 className="font-semibold text-gray-800">
                                          {usuario.nome}
                                        </h5>
                                        <p className="text-sm text-gray-600">
                                          {usuario.email}
                                        </p>
                                      </div>
                                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                        {cotasDoUsuario.length} cota(s)
                                      </span>
                                    </div>
                                    <div className="text-sm text-gray-700">
                                      <span className="font-medium">
                                        Cotas:
                                      </span>
                                      {cotasDoUsuario.map((cota) => (
                                        <span
                                          key={cota.id}
                                          className="ml-2 bg-gray-200 px-2 py-1 rounded text-xs mr-1"
                                        >
                                          {cota.numeroCota} - R${" "}
                                          {cota.valor.toLocaleString()} (
                                          {cota.status})
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        );
                      })()}
                    </div>
                  )}
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
                  <h4 className="text-lg font-semibold mb-4 text-black">
                    Estatísticas
                  </h4>
                  {dataCotas?.cotasByConsorcioId && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div className="bg-white/20 rounded-lg p-3">
                        <div className="text-2xl font-bold text-blue-600">
                          {dataCotas.cotasByConsorcioId.length}
                        </div>
                        <div className="text-sm text-gray-600">
                          Total de Cotas
                        </div>
                      </div>
                      <div className="bg-white/20 rounded-lg p-3">
                        <div className="text-2xl font-bold text-green-600">
                          {
                            dataCotas.cotasByConsorcioId.filter((cota) =>
                              cota.status.toLowerCase().includes("ativa")
                            ).length
                          }
                        </div>
                        <div className="text-sm text-gray-600">
                          Cotas Ativas
                        </div>
                      </div>
                      <div className="bg-white/20 rounded-lg p-3">
                        <div className="text-2xl font-bold text-purple-600">
                          R${" "}
                          {dataCotas.cotasByConsorcioId
                            .reduce((sum, cota) => sum + cota.valor, 0)
                            .toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Valor Total</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

const ConsorcioManager: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <ConsorcioManagerContent />
    </ApolloProvider>
  );
};

export default ConsorcioManager;
