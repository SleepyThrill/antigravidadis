const Periferico = require('../models/Periferico');

// GET /api/perifericos
async function listarPerifericos(req, res, next) {
  try {
    const perifericos = await Periferico.find().sort({ createdAt: -1 });
    return res.status(200).json({ data: perifericos });
  } catch (error) {
    return next(error);
  }
}

// GET /api/perifericos/:id
async function obterPerifericoPorId(req, res, next) {
  try {
    const { id } = req.params;
    const periferico = await Periferico.findById(id);

    if (!periferico) {
      return res.status(404).json({ error: 'Periferico nao encontrado' });
    }

    return res.status(200).json({ data: periferico });
  } catch (error) {
    return next(error);
  }
}

// POST /api/perifericos
async function criarPeriferico(req, res, next) {
  try {
    const dados = req.sanitizedPeriferico;
    const novoPeriferico = await Periferico.create(dados);
    return res.status(201).json(novoPeriferico);
  } catch (error) {
    return next(error);
  }
}

// PUT /api/perifericos/:id
async function atualizarPeriferico(req, res, next) {
  try {
    const { id } = req.params;
    const dados = req.sanitizedPeriferico;

    const perifericoAtualizado = await Periferico.findByIdAndUpdate(
      id,
      dados,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!perifericoAtualizado) {
      return res.status(404).json({ error: 'Periferico nao encontrado' });
    }

    return res.status(200).json(perifericoAtualizado);
  } catch (error) {
    return next(error);
  }
}

// DELETE /api/perifericos/:id
async function excluirPeriferico(req, res, next) {
  try {
    const { id } = req.params;
    const perifericoExcluido = await Periferico.findByIdAndDelete(id);

    if (!perifericoExcluido) {
      return res.status(404).json({ error: 'Periferico nao encontrado' });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listarPerifericos,
  obterPerifericoPorId,
  criarPeriferico,
  atualizarPeriferico,
  excluirPeriferico,
};
