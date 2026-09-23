const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDB();
    console.log('Conexao com o MongoDB estabelecida com sucesso.');
  } catch (err) {
    console.warn('Aviso: Iniciando servidor sem conexao imediata com o MongoDB:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Documentacao dos endpoints disponivel em api.md`);
  });
}

startServer();
