const express = require('express');
const autenticar = require('../middlewares/auth');
const { registrarValidade, listarValidades, listarVencendo, deletarValidade } = require('../controllers/validadeController');

const router = express.Router();

router.use(autenticar);

router.post('/', registrarValidade);
router.get('/', listarValidades);
router.get('/vencendo', listarVencendo);
router.delete('/:id', deletarValidade);

module.exports = router;