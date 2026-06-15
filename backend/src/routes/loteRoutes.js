const express = require('express');
const autenticar = require('../middlewares/auth');
const { registrarLote, listarLotes, listarLotesPorIngrediente, deletarLote } = require('../controllers/loteController');

const router = express.Router();

router.use(autenticar);

router.post('/', registrarLote);
router.get('/', listarLotes);
router.get('/ingrediente/:id', listarLotesPorIngrediente);
router.delete('/:id', deletarLote);

module.exports = router;