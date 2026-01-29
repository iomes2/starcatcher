import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import Login from "./components/Login";
import Register from "./components/Register";
import UserList from "./components/UserList";

function App() {
  return (
    <div className="App">
      <main style={{ padding: "20px" }}>
        <Suspense fallback={<div>Carregando Auth App Components...</div>}>
          <Routes>
            <Route path="/" element={<div>Seja bem-vindo ao Auth App!</div>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/users" element={<UserList />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;
