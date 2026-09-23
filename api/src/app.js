require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const perifericosRoutes = require('./routes/perifericosRoutes');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

const app = express();

// Servir arquivos estaticos do frontend
app.use(express.static(path.join(__dirname, '../../frontend')));

// Middlewares globais
const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(
  cors({
    origin: corsOrigin === '*' ? '*' : corsOrigin.split(',').map((o) => o.trim()),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

// Middleware para garantir conexao com banco em operacoes serverless
app.use('/api', async (req, res, next) => {
  try {
    if (process.env.NODE_ENV !== 'test') {
      await connectDB();
    }
    next();
  } catch (err) {
    console.error('Falha de conexao com o banco de dados:', err.message);
    return res.status(500).json({ error: 'Falha na conexao com o banco de dados' });
  }
});

// Endpoint de verificacao de saude da aplicacao
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rotas principais
app.use('/api/perifericos', perifericosRoutes);

// Tratamento de 404 e erros globais
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
