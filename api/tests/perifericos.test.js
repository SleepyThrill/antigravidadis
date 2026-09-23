process.env.NODE_ENV = 'test';
const { test, describe, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../src/app');
const { startTestDB, stopTestDB, clearTestDB } = require('./setup');
const Periferico = require('../src/models/Periferico');

describe('Suite de Testes da API de Perifericos Corsair', () => {
  before(async () => {
    await startTestDB();
  });

  after(async () => {
    await stopTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  // Health check e rota 404
  test('GET /api/health deve retornar status 200 e ok', async () => {
    const res = await request(app).get('/api/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'ok');
  });

  test('GET /api/rota-inexistente deve retornar status 404 com erro em JSON', async () => {
    const res = await request(app).get('/api/rota-inexistente');
    assert.equal(res.status, 404);
    assert.equal(res.body.error, 'Rota nao encontrada');
  });

  // GET /api/perifericos
  test('GET /api/perifericos deve retornar lista vazia inicialmente', async () => {
    const res = await request(app).get('/api/perifericos');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.data));
    assert.equal(res.body.data.length, 0);
  });

  // POST /api/perifericos
  test('POST /api/perifericos deve cadastrar com sucesso um periferico valido', async () => {
    const payload = {
      marca: 'Corsair',
      modelo: 'K70 RGB PRO Mechanical Gaming Keyboard',
      preco: 999.90,
      foto: 'https://cwsmgmt.corsair.com/media/catalog/product/k/7/k70.png',
    };

    const res = await request(app)
      .post('/api/perifericos')
      .send(payload);

    assert.equal(res.status, 201);
    assert.ok(res.body._id);
    assert.equal(res.body.marca, 'Corsair');
    assert.equal(res.body.modelo, payload.modelo);
    assert.equal(res.body.preco, 999.90);
    assert.equal(res.body.foto, payload.foto);
    assert.ok(res.body.createdAt);
    assert.ok(res.body.updatedAt);
  });

  test('POST /api/perifericos deve rejeitar marca diferente de Corsair', async () => {
    const payload = {
      marca: 'Logitech',
      modelo: 'G Pro X',
      preco: 600,
      foto: 'https://exemplo.com/mouse.png',
    };

    const res = await request(app)
      .post('/api/perifericos')
      .send(payload);

    assert.equal(res.status, 400);
    assert.equal(res.body.error, 'A marca deve ser obrigatoriamente Corsair');
  });

  test('POST /api/perifericos deve rejeitar modelo vazio ou ausente', async () => {
    const payloadSemModelo = {
      marca: 'Corsair',
      preco: 600,
      foto: 'https://exemplo.com/mouse.png',
    };

    const res = await request(app)
      .post('/api/perifericos')
      .send(payloadSemModelo);

    assert.equal(res.status, 400);
    assert.equal(res.body.error, 'Modelo e obrigatorio');

    const payloadModeloEspacos = {
      marca: 'Corsair',
      modelo: '   ',
      preco: 600,
      foto: 'https://exemplo.com/mouse.png',
    };

    const resEspacos = await request(app)
      .post('/api/perifericos')
      .send(payloadModeloEspacos);

    assert.equal(resEspacos.status, 400);
    assert.equal(resEspacos.body.error, 'Modelo e obrigatorio');
  });

  test('POST /api/perifericos deve rejeitar preco ausente, nao numerico ou negativo', async () => {
    // Ausente
    const resAusente = await request(app)
      .post('/api/perifericos')
      .send({
        marca: 'Corsair',
        modelo: 'HS80 RGB',
        foto: 'https://exemplo.com/hs80.png',
      });
    assert.equal(resAusente.status, 400);
    assert.equal(resAusente.body.error, 'Preco e obrigatorio');

    // Nao numerico
    const resString = await request(app)
      .post('/api/perifericos')
      .send({
        marca: 'Corsair',
        modelo: 'HS80 RGB',
        preco: 'abc',
        foto: 'https://exemplo.com/hs80.png',
      });
    assert.equal(resString.status, 400);
    assert.equal(resString.body.error, 'Preco deve ser um numero valido');

    // Negativo
    const resNegativo = await request(app)
      .post('/api/perifericos')
      .send({
        marca: 'Corsair',
        modelo: 'HS80 RGB',
        preco: -10,
        foto: 'https://exemplo.com/hs80.png',
      });
    assert.equal(resNegativo.status, 400);
    assert.equal(resNegativo.body.error, 'Preco deve ser maior ou igual a zero');
  });

  test('POST /api/perifericos deve rejeitar foto com URL invalida', async () => {
    const res = await request(app)
      .post('/api/perifericos')
      .send({
        marca: 'Corsair',
        modelo: 'Scimitar RGB Elite',
        preco: 450,
        foto: 'imagem-nao-url.jpg',
      });
    assert.equal(res.status, 400);
    assert.equal(res.body.error, 'Foto deve ser uma URL valida (http ou https)');
  });

  // GET /api/perifericos/:id
  test('GET /api/perifericos/:id deve retornar dados do item existente', async () => {
    const item = await Periferico.create({
      marca: 'Corsair',
      modelo: 'Virtuoso RGB Wireless',
      preco: 1200,
      foto: 'https://cwsmgmt.corsair.com/virtuoso.png',
    });

    const res = await request(app).get(`/api/perifericos/${item._id}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.data._id, String(item._id));
    assert.equal(res.body.data.modelo, 'Virtuoso RGB Wireless');
  });

  test('GET /api/perifericos/:id com ID inexistente deve retornar 404', async () => {
    const res = await request(app).get('/api/perifericos/674205a1c0de981a2f183999');
    assert.equal(res.status, 404);
    assert.equal(res.body.error, 'Periferico nao encontrado');
  });

  test('GET /api/perifericos/:id com ID em formato invalido deve retornar 400', async () => {
    const res = await request(app).get('/api/perifericos/id-invalido-123');
    assert.equal(res.status, 400);
    assert.equal(res.body.error, 'Identificador invalido');
  });

  // PUT /api/perifericos/:id
  test('PUT /api/perifericos/:id deve atualizar o item existente com sucesso', async () => {
    const item = await Periferico.create({
      marca: 'Corsair',
      modelo: 'Harpoon RGB Wireless',
      preco: 250,
      foto: 'https://cwsmgmt.corsair.com/harpoon.png',
    });

    const alteracao = {
      marca: 'Corsair',
      modelo: 'Harpoon RGB PRO',
      preco: 280,
      foto: 'https://cwsmgmt.corsair.com/harpoon-pro.png',
    };

    const res = await request(app)
      .put(`/api/perifericos/${item._id}`)
      .send(alteracao);

    assert.equal(res.status, 200);
    assert.equal(res.body._id, String(item._id));
    assert.equal(res.body.modelo, 'Harpoon RGB PRO');
    assert.equal(res.body.preco, 280);
    assert.equal(res.body.foto, alteracao.foto);
  });

  test('PUT /api/perifericos/:id com ID inexistente deve retornar 404', async () => {
    const res = await request(app)
      .put('/api/perifericos/674205a1c0de981a2f183999')
      .send({
        marca: 'Corsair',
        modelo: 'MM300 Mousepad',
        preco: 120,
        foto: 'https://exemplo.com/pad.png',
      });

    assert.equal(res.status, 404);
    assert.equal(res.body.error, 'Periferico nao encontrado');
  });

  // DELETE /api/perifericos/:id
  test('DELETE /api/perifericos/:id deve remover o item e retornar 204', async () => {
    const item = await Periferico.create({
      marca: 'Corsair',
      modelo: 'M65 RGB Ultra',
      preco: 399,
      foto: 'https://cwsmgmt.corsair.com/m65.png',
    });

    const res = await request(app).delete(`/api/perifericos/${item._id}`);
    assert.equal(res.status, 204);

    // Confirma que nao existe mais
    const check = await Periferico.findById(item._id);
    assert.equal(check, null);
  });

  test('DELETE /api/perifericos/:id com ID inexistente deve retornar 404', async () => {
    const res = await request(app).delete('/api/perifericos/674205a1c0de981a2f183999');
    assert.equal(res.status, 404);
    assert.equal(res.body.error, 'Periferico nao encontrado');
  });

  test('DELETE /api/perifericos/:id com ID formato invalido deve retornar 400', async () => {
    const res = await request(app).delete('/api/perifericos/abc-123-nao-objectid');
    assert.equal(res.status, 400);
    assert.equal(res.body.error, 'Identificador invalido');
  });
});
