const express = require('express');
const router = express.Router();
const perifericosController = require('../controllers/perifericosController');
const { validateObjectId, validatePerifericoBody } = require('../middlewares/validation');

// GET /api/perifericos
router.get('/', perifericosController.listarPerifericos);

// GET /api/perifericos/:id
router.get('/:id', validateObjectId, perifericosController.obterPerifericoPorId);

// POST /api/perifericos
router.post('/', validatePerifericoBody, perifericosController.criarPeriferico);

// PUT /api/perifericos/:id
router.put('/:id', validateObjectId, validatePerifericoBody, perifericosController.atualizarPeriferico);

// DELETE /api/perifericos/:id
router.delete('/:id', validateObjectId, perifericosController.excluirPeriferico);

module.exports = router;
