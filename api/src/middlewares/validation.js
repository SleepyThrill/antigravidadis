const mongoose = require('mongoose');

function isValidUrl(urlString) {
  if (typeof urlString !== 'string') return false;
  try {
    const parsed = new URL(urlString);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

function validateObjectId(req, res, next) {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id) || String(new mongoose.Types.ObjectId(id)) !== id) {
    return res.status(400).json({ error: 'Identificador invalido' });
  }
  next();
}

function validatePerifericoBody(req, res, next) {
  const { marca, modelo, preco, foto } = req.body;

  // Validacao de marca
  if (marca === undefined || marca === null || typeof marca !== 'string' || marca.trim() === '') {
    return res.status(400).json({ error: 'Marca e obrigatoria' });
  }

  if (marca.trim() !== 'Corsair') {
    return res.status(400).json({ error: 'A marca deve ser obrigatoriamente Corsair' });
  }

  // Validacao de modelo
  if (modelo === undefined || modelo === null || typeof modelo !== 'string' || modelo.trim() === '') {
    return res.status(400).json({ error: 'Modelo e obrigatorio' });
  }

  // Validacao de preco
  if (preco === undefined || preco === null || preco === '') {
    return res.status(400).json({ error: 'Preco e obrigatorio' });
  }

  const precoNum = Number(preco);
  if (typeof preco === 'boolean' || isNaN(precoNum)) {
    return res.status(400).json({ error: 'Preco deve ser um numero valido' });
  }

  if (precoNum < 0) {
    return res.status(400).json({ error: 'Preco deve ser maior ou igual a zero' });
  }

  // Validacao de foto
  if (foto === undefined || foto === null || typeof foto !== 'string' || foto.trim() === '') {
    return res.status(400).json({ error: 'Foto e obrigatoria' });
  }

  if (!isValidUrl(foto.trim())) {
    return res.status(400).json({ error: 'Foto deve ser uma URL valida (http ou https)' });
  }

  // Injeta dados sanitizados
  req.sanitizedPeriferico = {
    marca: marca.trim(),
    modelo: modelo.trim(),
    preco: precoNum,
    foto: foto.trim(),
  };

  next();
}

module.exports = {
  validateObjectId,
  validatePerifericoBody,
  isValidUrl,
};
