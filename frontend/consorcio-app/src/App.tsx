import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";

import ConsorcioList from "./components/ConsorcioList";
import ConsorcioManager from "./components/ConsorcioManager";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Consórcio Microfrontend</h1>
          <nav>
            <Link to="/" style={{ color: "white", marginRight: "10px" }}>
              Home
            </Link>
            <Link
              to="/consorcios"
              style={{ color: "white", marginRight: "10px" }}
            >
              Lista Simples
            </Link>
            <Link to="/manager" style={{ color: "white", marginRight: "10px" }}>
              Gerenciador Completo
            </Link>
          </nav>
        </header>
        <main style={{ padding: "20px" }}>
          <Suspense
            fallback={<div>Carregando Consórcio App Components...</div>}
          >
            <Routes>
              <Route
                path="/"
                element={<div>Seja bem-vindo ao Consórcio App!</div>}
              />
              <Route path="/consorcios" element={<ConsorcioList />} />
              <Route path="/manager" element={<ConsorcioManager />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
}

export default App;
