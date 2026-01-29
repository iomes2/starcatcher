// Servidor simples para compartilhar token entre aplicações
// Este arquivo deve ser executado junto com o frontmain

const express = require("express");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3003",
    ],
    credentials: true,
  })
);

app.use(express.json());

// Armazenar token em memória (em produção, use Redis ou similar)
let currentToken = null;

// Endpoint para definir token (chamado pelo frontmain)
app.post("/api/auth/token", (req, res) => {
  const { token } = req.body;
  currentToken = token;
  console.log("Token set:", token ? "Token received" : "Token cleared");
  res.json({ success: true });
});

// Endpoint para obter token (chamado pelos microfrontends)
app.get("/api/auth/token", (req, res) => {
  res.json({ token: currentToken });
});

// Endpoint para remover token (chamado pelo frontmain)
app.delete("/api/auth/token", (req, res) => {
  currentToken = null;
  console.log("Token cleared");
  res.json({ success: true });
});

const PORT = 3999;
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});

module.exports = app;
