const mongoose = require('mongoose');

const perifericoSchema = new mongoose.Schema(
  {
    marca: {
      type: String,
      required: [true, 'Marca e obrigatoria'],
      enum: {
        values: ['Corsair'],
        message: 'A marca deve ser obrigatoriamente Corsair',
      },
      default: 'Corsair',
      trim: true,
    },
    modelo: {
      type: String,
      required: [true, 'Modelo e obrigatorio'],
      trim: true,
      minlength: [1, 'Modelo nao pode ser vazio'],
    },
    preco: {
      type: Number,
      required: [true, 'Preco e obrigatorio'],
      min: [0, 'Preco deve ser maior ou igual a zero'],
    },
    foto: {
      type: String,
      required: [true, 'Foto e obrigatoria'],
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Preparado para expansao futura de marcas caso necessario
module.exports = mongoose.models.Periferico || mongoose.model('Periferico', perifericoSchema);
