function errorHandler(err, req, res, next) {
  // Erro de JSON mal formatado na requisicao
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Formato JSON invalido no corpo da requisicao' });
  }

  // Erros de validacao do Mongoose
  if (err.name === 'ValidationError') {
    const firstMessage = Object.values(err.errors)[0]?.message || 'Dados invalidos';
    return res.status(400).json({ error: firstMessage });
  }

  // Erros de casting do Mongoose
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Identificador invalido' });
  }

  // Erro generico do servidor (sem vazar stack trace)
  console.error('Erro interno nao tratado:', err);
  return res.status(500).json({ error: 'Erro interno do servidor' });
}

function notFoundHandler(req, res) {
  return res.status(404).json({ error: 'Rota nao encontrada' });
}

module.exports = {
  errorHandler,
  notFoundHandler,
};
