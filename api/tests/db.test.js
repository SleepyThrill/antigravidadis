const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { startTestDB, stopTestDB } = require('./setup');
const Periferico = require('../src/models/Periferico');

describe('Modulo de Banco de Dados', () => {
  before(async () => {
    await startTestDB();
  });

  after(async () => {
    await stopTestDB();
  });

  test('Deve conectar ao banco e criar um periferico valido', async () => {
    const item = await Periferico.create({
      marca: 'Corsair',
      modelo: 'K70 RGB PRO',
      preco: 899.90,
      foto: 'https://cwsmgmt.corsair.com/k70.png',
    });

    assert.equal(item.marca, 'Corsair');
    assert.equal(item.modelo, 'K70 RGB PRO');
    assert.equal(item.preco, 899.90);
    assert.ok(item._id);
    assert.ok(item.createdAt);
  });

  test('Deve falhar ao tentar cadastrar marca diferente de Corsair', async () => {
    await assert.rejects(
      async () => {
        await Periferico.create({
          marca: 'Razer',
          modelo: 'BlackWidow',
          preco: 500,
          foto: 'https://exemplo.com/razer.png',
        });
      },
      (err) => {
        assert.match(err.message, /Corsair/);
        return true;
      }
    );
  });
});
