process.env.NODE_ENV = 'test';
const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../src/app');
const { startTestDB, stopTestDB } = require('./setup');

describe('Testes de Integracao do Fluxo Completo (CRUD + CORS + Casos de Borda)', () => {
  before(async () => {
    await startTestDB();
  });

  after(async () => {
    await stopTestDB();
  });

  test('Fluxo completo: Cadastrar -> Consultar -> Listar -> Editar -> Excluir -> Confirmar remocao', async () => {
    // 1. Cadastra
    const payloadCriacao = {
      marca: 'Corsair',
      modelo: 'K100 RGB Optical-Mechanical Keyboard',
      preco: 1499.90,
      foto: 'https://cwsmgmt.corsair.com/media/k100.png',
    };

    const resCriar = await request(app)
      .post('/api/perifericos')
      .send(payloadCriacao);

    assert.equal(resCriar.status, 201);
    const novoId = resCriar.body._id;
    assert.ok(novoId);
    assert.equal(resCriar.body.modelo, payloadCriacao.modelo);

    // 2. Consulta pelo ID
    const resGet = await request(app).get(`/api/perifericos/${novoId}`);
    assert.equal(resGet.status, 200);
    assert.equal(resGet.body.data.modelo, payloadCriacao.modelo);
    assert.equal(resGet.body.data.preco, 1499.90);

    // 3. Consulta na listagem
    const resList = await request(app).get('/api/perifericos');
    assert.equal(resList.status, 200);
    const itemNaLista = resList.body.data.find((p) => p._id === novoId);
    assert.ok(itemNaLista);
    assert.equal(itemNaLista.preco, 1499.90);

    // 4. Edita o periferico
    const payloadEdicao = {
      marca: 'Corsair',
      modelo: 'K100 RGB Midnight Gold Edition',
      preco: 1699.00,
      foto: 'https://cwsmgmt.corsair.com/media/k100-gold.png',
    };

    const resEdit = await request(app)
      .put(`/api/perifericos/${novoId}`)
      .send(payloadEdicao);

    assert.equal(resEdit.status, 200);
    assert.equal(resEdit.body.modelo, payloadEdicao.modelo);
    assert.equal(resEdit.body.preco, 1699.00);

    // 5. Exclui o periferico
    const resDelete = await request(app).delete(`/api/perifericos/${novoId}`);
    assert.equal(resDelete.status, 204);

    // 6. Confirma que agora retorna 404
    const resPosDelete = await request(app).get(`/api/perifericos/${novoId}`);
    assert.equal(resPosDelete.status, 404);
  });

  test('Caso de borda: Preco zero (0.00) deve ser aceito como valido', async () => {
    const res = await request(app)
      .post('/api/perifericos')
      .send({
        marca: 'Corsair',
        modelo: 'Brinde Especial Corsair',
        preco: 0,
        foto: 'https://cwsmgmt.corsair.com/media/brinde.png',
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.preco, 0);
  });

  test('Seguranca e CORS: Cabecalho Access-Control-Allow-Origin deve estar presente', async () => {
    const res = await request(app).get('/api/perifericos');
    assert.ok(res.headers['access-control-allow-origin']);
  });

  test('Seguranca: Requisicoes OPTIONS (Preflight) devem retornar status 204 ou 200', async () => {
    const res = await request(app).options('/api/perifericos');
    assert.ok(res.status === 204 || res.status === 200);
  });
});
