import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { logout } from "../../features/auth/authSlice";

const Inicio = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
      <header className="bg-gray-800 shadow-md py-4 px-16 flex justify-between items-center text-white">
        <div className="logo">
          <Link to="/" className="text-2xl font-bold">
            Consórcio-X
          </Link>
        </div>
        <nav className="flex items-center space-x-6">
          {!token ? (
            <>
              <Link to="/login" className="hover:text-blue-300">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <span>Olá, {user?.nome || "Usuário"}!</span>
              <Link to="/dashboard" className="hover:text-blue-300">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-transparent border-none cursor-pointer text-white hover:underline"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </header>
      <main
        className="flex-grow flex justify-center items-center text-center text-white"
        style={{
          backgroundImage: "url('/topaz_bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-black bg-opacity-50 py-16 px-8 rounded-lg">
          <h1 className="text-5xl font-bold mb-4">
            Encontre o consórcio dos seus sonhos
          </h1>
          <p className="text-xl mb-8">
            A maneira mais inteligente de conquistar seus bens.
          </p>
          <Link
            to="/login"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-md text-lg transition-colors duration-300"
          >
            Ver Planos
          </Link>
        </div>
      </main>
      <footer className="bg-gray-800 text-white text-center p-4">
        <p>&copy; 2024 Consórcio-X. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Inicio;
