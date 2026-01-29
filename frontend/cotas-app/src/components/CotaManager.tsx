import React, { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import "./CotaManager.css";

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

interface Usuario {
  id: number;
  nome: string;
  email: string;
  dataCriacao: string;
  dataAtualizacao: string | null;
}

interface Consorcio {
  id: number;
  nome: string;
  descricao: string;
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

const GET_USUARIOS = gql`
  query ListUsuarios {
    usuarios {
      id
      nome
      email
      dataCriacao
      dataAtualizacao
    }
  }
`;

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

const CREATE_COTA_MUTATION = gql`
  mutation CreateCota($cotaInput: CotaInput!) {
    createCota(cotaInput: $cotaInput) {
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

const UPDATE_COTA_MUTATION = gql`
  mutation UpdateCota($id: Int!, $cotaInput: UpdateCotaInput!) {
    updateCota(id: $id, cotaInput: $cotaInput) {
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

const CotaManager: React.FC = () => {
  const { loading, error, data } = useQuery<{
    cotas: Cota[];
  }>(GET_COTAS);

  const { loading: loadingUsuarios, data: dataUsuarios } = useQuery<{
    usuarios: Usuario[];
  }>(GET_USUARIOS);

  const { loading: loadingConsorcios, data: dataConsorcios } = useQuery<{
    consorcios: Consorcio[];
  }>(GET_CONSORCIOS);

  const [createCota] = useMutation(CREATE_COTA_MUTATION, {
    refetchQueries: [{ query: GET_COTAS }],
    onCompleted: () => {
      setNovaCota({
        numeroCota: "",
        valor: "",
        status: "Ativa",
        consorcioId: "",
        usuarioId: "",
      });
      setValorReadonly(false);
      setEditingCota(null);
      setIsFormVisible(false);
    },
    onError: (error) => {
      console.error("Erro ao criar cota:", error);
      alert("Erro ao criar cota: " + error.message);
    },
  });

  const [updateCota] = useMutation(UPDATE_COTA_MUTATION, {
    refetchQueries: [{ query: GET_COTAS }],
    onCompleted: () => {
      setNovaCota({
        numeroCota: "",
        valor: "",
        status: "Ativa",
        consorcioId: "",
        usuarioId: "",
      });
      setValorReadonly(false);
      setEditingCota(null);
      setIsFormVisible(false);
    },
    onError: (error) => {
      console.error("Erro ao atualizar cota:", error);
      alert("Erro ao atualizar cota: " + error.message);
    },
  });

  const [searchTerm, setSearchTerm] = useState("");

  const [novaCota, setNovaCota] = useState({
    numeroCota: "",
    valor: "",
    status: "Ativa",
    consorcioId: "",
    usuarioId: "",
  });

  const [valorReadonly, setValorReadonly] = useState(false);

  const getConsorcioValor = (consorcioId: string): string | null => {
    if (!consorcioId) return null;
    return localStorage.getItem(`consorcio_${consorcioId}_valor`);
  };

  const handleConsorcioChange = (consorcioId: string) => {
    const valorConsorcio = getConsorcioValor(consorcioId);

    setNovaCota((prev) => ({
      ...prev,
      consorcioId,
      valor: valorConsorcio || prev.valor,
    }));

    setValorReadonly(!!valorConsorcio);
  };

  const [editingCota, setEditingCota] = useState<Cota | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const [editingInSecondContainer, setEditingInSecondContainer] =
    useState<Cota | null>(null);

  const cotas: Cota[] = data?.cotas || [];
  const filteredCotas = cotas.filter((c) =>
    c.numeroCota.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCota = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !novaCota.numeroCota ||
      !novaCota.valor ||
      !novaCota.consorcioId ||
      !novaCota.usuarioId
    ) {
      alert("Todos os campos são obrigatórios!");
      return;
    }

    const cotaInput = {
      numeroCota: novaCota.numeroCota,
      valor: parseFloat(novaCota.valor),
      status: novaCota.status,
      consorcioId: parseInt(novaCota.consorcioId),
      usuarioId: parseInt(novaCota.usuarioId),
    };

    if (editingCota) {
      await updateCota({
        variables: {
          id: editingCota.id,
          cotaInput,
        },
      });
    } else {
      await createCota({
        variables: { cotaInput },
      });
    }
  };

  const [cotaForm, setCotaForm] = useState({
    numeroCota: "",
    valor: "",
    status: "Ativa",
    consorcioId: "",
    usuarioId: "",
  });

  const handleSaveEditInSecondContainer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingInSecondContainer) return;

    if (
      !cotaForm.numeroCota ||
      !cotaForm.valor ||
      !cotaForm.consorcioId ||
      !cotaForm.usuarioId
    ) {
      alert("Todos os campos são obrigatórios!");
      return;
    }

    await updateCota({
      variables: {
        id: editingInSecondContainer.id,
        cotaInput: {
          numeroCota: cotaForm.numeroCota,
          valor: parseFloat(cotaForm.valor),
          status: cotaForm.status,
          consorcioId: parseInt(cotaForm.consorcioId),
          usuarioId: parseInt(cotaForm.usuarioId),
        },
      },
    });

    setEditingInSecondContainer(null);
  };

  const handleEditCotaInSecondContainer = (cota: Cota) => {
    setEditingInSecondContainer(cota);
    setCotaForm({
      numeroCota: cota.numeroCota,
      valor: cota.valor.toString(),
      status: cota.status,
      consorcioId: cota.consorcioId.toString(),
      usuarioId: cota.usuarioId.toString(),
    });
  };

  const handleEditCota = (cota: Cota) => {
    setEditingCota(cota);
    const valorConsorcio = getConsorcioValor(cota.consorcioId.toString());

    setNovaCota({
      numeroCota: cota.numeroCota,
      valor: cota.valor.toString(),
      status: cota.status,
      consorcioId: cota.consorcioId.toString(),
      usuarioId: cota.usuarioId.toString(),
    });

    setValorReadonly(!!valorConsorcio);
    setIsFormVisible(true);
  };

  const handleCancelEdit = () => {
    setEditingCota(null);
    setNovaCota({
      numeroCota: "",
      valor: "",
      status: "Ativa",
      consorcioId: "",
      usuarioId: "",
    });
    setValorReadonly(false);
    setIsFormVisible(false);
  };

  const formCota = (
    <>
      <h3 className="text-xl font-semibold mb-4">
        {editingCota ? "Editar Cota" : "Adicionar Nova Cota"}
      </h3>
      <form onSubmit={handleAddCota} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="cota-numero"
              className="block text-sm font-medium text-black mb-2"
            >
              Número da Cota *
            </label>
            <input
              id="cota-numero"
              type="text"
              placeholder="Ex: COTA-001"
              className="w-full p-3 bg-white/90 border border-gray-300 rounded-md text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              value={novaCota.numeroCota}
              onChange={(e) =>
                setNovaCota({ ...novaCota, numeroCota: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label
              htmlFor="cota-valor"
              className="block text-sm font-medium text-black mb-2"
            >
              Valor (R$) *
              {valorReadonly && (
                <span className="text-xs text-blue-600 ml-2">
                  (Valor definido pelo consórcio)
                </span>
              )}
            </label>
            <input
              id="cota-valor"
              type="number"
              step="0.01"
              min="0"
              placeholder={
                valorReadonly
                  ? "Valor será definido automaticamente"
                  : "Ex: 50000.00"
              }
              className={`w-full p-3 border border-gray-300 rounded-md text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                valorReadonly ? "bg-gray-100 cursor-not-allowed" : "bg-white/90"
              }`}
              value={novaCota.valor}
              onChange={(e) =>
                !valorReadonly &&
                setNovaCota({ ...novaCota, valor: e.target.value })
              }
              readOnly={valorReadonly}
              required
            />
            {valorReadonly && (
              <p className="text-xs text-gray-600 mt-1">
                Este valor foi definido automaticamente baseado no consórcio
                selecionado
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="cota-consorcio"
              className="block text-sm font-medium text-black mb-2"
            >
              Consórcio *
            </label>
            <select
              id="cota-consorcio"
              className="w-full p-3 bg-white/90 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              value={novaCota.consorcioId}
              onChange={(e) => handleConsorcioChange(e.target.value)}
              required
            >
              <option value="">Selecione um consórcio</option>
              {dataConsorcios?.consorcios?.map((consorcio) => {
                const valorConsorcio = getConsorcioValor(
                  consorcio.id.toString()
                );
                return (
                  <option key={consorcio.id} value={consorcio.id}>
                    {consorcio.nome} (ID: {consorcio.id})
                    {valorConsorcio
                      ? ` - R$ ${parseFloat(valorConsorcio).toLocaleString(
                          "pt-BR",
                          { minimumFractionDigits: 2 }
                        )}`
                      : ""}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label
              htmlFor="cota-usuario"
              className="block text-sm font-medium text-black mb-2"
            >
              Usuário *
            </label>
            <select
              id="cota-usuario"
              className="w-full p-3 bg-white/90 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              value={novaCota.usuarioId}
              onChange={(e) =>
                setNovaCota({ ...novaCota, usuarioId: e.target.value })
              }
              required
            >
              <option value="">Selecione um usuário</option>
              {dataUsuarios?.usuarios?.map((usuario) => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.nome} - {usuario.email}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="cota-status"
              className="block text-sm font-medium text-black mb-2"
            >
              Status *
            </label>
            <select
              id="cota-status"
              className="w-full p-3 bg-white/90 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              value={novaCota.status}
              onChange={(e) =>
                setNovaCota({ ...novaCota, status: e.target.value })
              }
              required
            >
              <option value="Ativa">Ativa</option>
              <option value="Inativa">Inativa</option>
              <option value="Pendente">Pendente</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loadingUsuarios || loadingConsorcios}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingUsuarios || loadingConsorcios
              ? "Carregando..."
              : editingCota
              ? "Atualizar Cota"
              : "Adicionar Cota"}
          </button>
          {editingCota && (
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
    </>
  );

  if (loading || loadingUsuarios || loadingConsorcios) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl font-semibold text-gray-600">
          Carregando dados...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl font-semibold text-red-600">
          Erro ao carregar cotas: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: "url('/topaz_bg.jpg')",
          filter: "blur(8px)",
          transform: "scale(1.02)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      ></div>

      <div className="relative z-10 p-8 min-h-screen text-black flex justify-center">
        {/* <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">Cotas</h1>
          <nav className="flex items-center space-x-4">
            <span className="text-lg">Sistema de Cotas</span>
          </nav>
        </header> */}

        <main
          className={`grid bg-white/70 gap-8 ${
            editingInSecondContainer
              ? "grid-cols-1 lg:grid-cols-2 max-w-6xl"
              : "grid-cols-1 max-w-2xl"
          }`}
        >
          <div
            className="backdrop-blur-xl border border-white/20 p-6 rounded-xl shadow-lg space-y-6 text-black"
            style={{ backgroundColor: "#e6e6e6" }}
          >
            <h2 className="text-3xl font-semibold">Cotas</h2>

            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
              <input
                type="text"
                placeholder="Pesquisar cota..."
                className="w-full p-2 bg-transparent border border-white/20 rounded-md mb-4 placeholder:text-black/0 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black border-black"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <ul className="zebra-list space-y-2 h-48 overflow-y-auto pr-2">
                {filteredCotas.map((cota) => {
                  const consorcio = dataConsorcios?.consorcios?.find(
                    (c) => c.id === cota.consorcioId
                  );
                  const usuario = dataUsuarios?.usuarios?.find(
                    (u) => u.id === cota.usuarioId
                  );

                  return (
                    <li
                      key={cota.id}
                      className="flex justify-between items-center p-3 rounded-md transition-colors hover:bg-white/30 odd:bg-gray-100/80 even:bg-gray-200/90 backdrop-blur-sm border border-white/20"
                    >
                      <div className="flex flex-col flex-grow">
                        <span className="text-sm md:text-base text-gray-800 font-medium">
                          Cota: {cota.numeroCota} | ID: {cota.id} | Status:{" "}
                          {cota.status}
                        </span>
                        <span className="text-sm text-gray-700">
                          Consórcio:{" "}
                          {consorcio?.nome || `ID ${cota.consorcioId}`}
                        </span>
                        <span className="text-sm text-gray-700">
                          Usuário: {usuario?.nome || `ID ${cota.usuarioId}`} |
                          Valor: R${" "}
                          {cota.valor.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditCotaInSecondContainer(cota)}
                          className="bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700 border border-blue-400/50 transition-all shadow-sm text-sm"
                        >
                          Editar
                        </button>
                        <button className="bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700 border border-red-400/50 transition-all shadow-sm text-sm">
                          Excluir
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
              {formCota}
            </div>
          </div>

          {editingInSecondContainer && (
            <div
              className="backdrop-blur-xl border border-white/20 p-6 rounded-xl shadow-lg space-y-6 text-black"
              style={{ backgroundColor: "#e6e6e6" }}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-semibold">Editar Cota</h2>
                <button
                  onClick={() => setEditingInSecondContainer(null)}
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md transition-all shadow-sm"
                >
                  ✕ Fechar
                </button>
              </div>

              <div className="bg-white/20 backdrop-blur-lg rounded-lg p-4 space-y-3">
                <h3 className="text-xl font-bold text-gray-800">
                  {editingInSecondContainer.numeroCota}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-gray-800">ID:</span>
                    <span className="text-gray-700 ml-2">
                      {editingInSecondContainer.id}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800">
                      Status Atual:
                    </span>
                    <span className="text-gray-700 ml-2">
                      {editingInSecondContainer.status}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800">
                      Valor Atual:
                    </span>
                    <span className="text-gray-700 ml-2">
                      R${" "}
                      {editingInSecondContainer.valor.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800">
                      Data de Criação:
                    </span>
                    <span className="text-gray-700 ml-2">
                      {new Date(
                        editingInSecondContainer.dataCriacao
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
                <h4 className="text-lg font-semibold mb-4 text-black">
                  Editar Informações
                </h4>
                <form
                  onSubmit={handleSaveEditInSecondContainer}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="edit-cota-numero"
                        className="block text-sm font-medium text-black mb-2"
                      >
                        Número da Cota *
                      </label>
                      <input
                        id="edit-cota-numero"
                        type="text"
                        placeholder="Ex: COTA-001"
                        className="w-full p-3 bg-white/90 border border-gray-300 rounded-md text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        value={cotaForm.numeroCota}
                        onChange={(e) =>
                          setCotaForm({
                            ...cotaForm,
                            numeroCota: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="edit-cota-valor"
                        className="block text-sm font-medium text-black mb-2"
                      >
                        Valor (R$) *
                      </label>
                      <input
                        id="edit-cota-valor"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Ex: 50000.00"
                        className="w-full p-3 bg-white/90 border border-gray-300 rounded-md text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        value={cotaForm.valor}
                        onChange={(e) =>
                          setCotaForm({ ...cotaForm, valor: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="edit-cota-consorcio"
                        className="block text-sm font-medium text-black mb-2"
                      >
                        Consórcio *
                      </label>
                      <select
                        id="edit-cota-consorcio"
                        className="w-full p-3 bg-white/90 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        value={cotaForm.consorcioId}
                        onChange={(e) =>
                          setCotaForm({
                            ...cotaForm,
                            consorcioId: e.target.value,
                          })
                        }
                        required
                      >
                        <option value="">Selecione um consórcio</option>
                        {dataConsorcios?.consorcios?.map((consorcio) => (
                          <option key={consorcio.id} value={consorcio.id}>
                            {consorcio.nome} (ID: {consorcio.id})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="edit-cota-usuario"
                        className="block text-sm font-medium text-black mb-2"
                      >
                        Usuário *
                      </label>
                      <select
                        id="edit-cota-usuario"
                        className="w-full p-3 bg-white/90 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        value={cotaForm.usuarioId}
                        onChange={(e) =>
                          setCotaForm({
                            ...cotaForm,
                            usuarioId: e.target.value,
                          })
                        }
                        required
                      >
                        <option value="">Selecione um usuário</option>
                        {dataUsuarios?.usuarios?.map((usuario) => (
                          <option key={usuario.id} value={usuario.id}>
                            {usuario.nome} - {usuario.email}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label
                        htmlFor="edit-cota-status"
                        className="block text-sm font-medium text-black mb-2"
                      >
                        Status *
                      </label>
                      <select
                        id="edit-cota-status"
                        className="w-full p-3 bg-white/90 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        value={cotaForm.status}
                        onChange={(e) =>
                          setCotaForm({ ...cotaForm, status: e.target.value })
                        }
                        required
                      >
                        <option value="Ativa">Ativa</option>
                        <option value="Inativa">Inativa</option>
                        <option value="Pendente">Pendente</option>
                        <option value="Cancelada">Cancelada</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={loadingUsuarios || loadingConsorcios}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingUsuarios || loadingConsorcios
                        ? "Carregando..."
                        : "Atualizar Cota"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingInSecondContainer(null)}
                      className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CotaManager;
