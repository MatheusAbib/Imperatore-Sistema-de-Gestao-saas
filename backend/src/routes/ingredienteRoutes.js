const express = require('express');
const autenticar = require('../middlewares/auth');
const {
    criarIngrediente,
    listarIngredientes,
    buscarIngrediente,
    atualizarIngrediente,
    deletarIngrediente
} = require('../controllers/ingredienteController');

const router = express.Router();

router.use(autenticar);

router.post('/', criarIngrediente);
router.get('/', listarIngredientes);
router.get('/:id', buscarIngrediente);
router.put('/:id', atualizarIngrediente);
router.delete('/:id', deletarIngrediente);

module.exports = router;