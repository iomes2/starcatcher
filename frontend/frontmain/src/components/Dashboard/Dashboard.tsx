import React, { useState, Suspense } from "react";
import { useNavigate, Routes, Route, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { RootState } from "../../app/store";
import EntitySection from "./EntitySection";
import { useQuery } from "@apollo/client/react";
import {
  GET_CONSORCIOS,
  GET_COTAS,
  GetConsorciosData,
  GetCotasData,
  Consorcio,
  Cota,
} from "../../graphql/queries";
import "./Dashboard.css";

const RemoteUserList = React.lazy(() => import("authApp/UserList"));
const RemoteCota = React.lazy(() => import("cotasApp/Cotas"));
const RemoteConsorcio = React.lazy(() => import("consorcioApp/Consorcio"));

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const {
    loading: loadingConsorcios,
    error: errorConsorcios,
    data: consorciosData,
  } = useQuery<GetConsorciosData>(GET_CONSORCIOS);
  const {
    loading: loadingCotas,
    error: errorCotas,
    data: cotasData,
  } = useQuery<GetCotasData>(GET_COTAS);

  const [searchTermConsorcio, setSearchTermConsorcio] = useState("");
  const [searchTermCota, setSearchTermCota] = useState("");

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("jwt_token");
    navigate("/");
    window.location.reload();
  };

  const consorcios: Consorcio[] = consorciosData?.consorcios || [];
  const cotas: Cota[] = cotasData?.cotas || [];

  const filteredConsorcios = consorcios.filter((c) =>
    c.nome.toLowerCase().includes(searchTermConsorcio.toLowerCase())
  );
  const filteredCotas = cotas.filter((c) =>
    c.numeroCota.toLowerCase().includes(searchTermCota.toLowerCase())
  );

  if (loadingConsorcios || loadingCotas) return <p>Carregando...</p>;
  if (errorConsorcios)
    return <p>Erro ao carregar consórcios: {errorConsorcios.message}</p>;
  if (errorCotas) return <p>Erro ao carregar cotas: {errorCotas.message}</p>;

  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: "url('/topaz_bg.jpg')",
          filter: "blur(8px)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      ></div>

      <div
        className="relative z-10  min-h-screen text-black"
        style={{ padding: "3rem 8rem" }}
      >
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <nav className="flex items-center space-x-4">
            <Link to="/" className="text-lg hover:underline">
              Home
            </Link>
            <Link to="/users" className="text-lg hover:underline">
              Usuários
            </Link>
            <Link to="/cotas" className="text-lg hover:underline">
              Cotas
            </Link>
            <Link to="/consorcios" className="text-lg hover:underline">
              Consórcios
            </Link>
            <span className="text-lg">Olá, {user?.nome || "Usuário"}!</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-500 backdrop-blur-sm text-white font-bold py-2 px-4 rounded-lg transition-all"
            >
              Sair
            </button>
          </nav>
        </header>

        <main
          className={`bg-white/70 ${
            window.location.pathname === "/users" ||
            window.location.pathname === "/consorcios" ||
            window.location.pathname === "/cotas"
              ? ""
              : "grid grid-cols-1 lg:grid-cols-2 gap-8"
          }`}
        >
          <Suspense fallback={<div>Carregando Componente...</div>}>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <EntitySection
                      title="Consórcios"
                      items={filteredConsorcios}
                      searchTerm={searchTermConsorcio}
                      onSearchChange={setSearchTermConsorcio}
                      searchPlaceholder="Pesquisar consórcio..."
                      renderItem={(item: Consorcio) => (
                        <li
                          key={item.id}
                          className="flex justify-between items-center p-3 rounded-md transition-colors hover:bg-white/30 odd:bg-gray-100/80 even:bg-gray-200/90 backdrop-blur-sm border border-white/20"
                        >
                          <span className="text-gray-800 font-medium">
                            ID: {item.id} | {item.nome}
                          </span>
                        </li>
                      )}
                    />

                    <EntitySection
                      title="Cotas"
                      items={filteredCotas}
                      searchTerm={searchTermCota}
                      onSearchChange={setSearchTermCota}
                      searchPlaceholder="Pesquisar cota..."
                      renderItem={(item: Cota) => (
                        <li
                          key={item.id}
                          className="flex justify-between items-center p-3 rounded-md transition-colors hover:bg-white/30 odd:bg-gray-100/80 even:bg-gray-200/90 backdrop-blur-sm border border-white/20"
                        >
                          <div className="flex flex-col">
                            <span className="text-sm md:text-base text-gray-800 font-medium">
                              ConsórcioID: {item.consorcioId} | UsuárioID:{" "}
                              {item.usuarioId} | ID: {item.id}
                            </span>
                            <span className="text-sm md:text-base text-gray-700">
                              Status: {item.status} | Nº: {item.numeroCota} |
                              Valor: {item.valor}
                            </span>
                          </div>
                        </li>
                      )}
                    />
                  </>
                }
              />
              <Route path="/users" element={<RemoteUserList />} />
              <Route path="/cotas" element={<RemoteCota />} />
              <Route path="/consorcios" element={<RemoteConsorcio />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
