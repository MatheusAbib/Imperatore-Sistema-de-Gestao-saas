const express = require('express');
const autenticar = require('../middlewares/auth');
const {
    criarProduto,
    listarProdutos,
    buscarProduto,
    atualizarProduto,
    deletarProduto,
    adicionarIngrediente,
    listarIngredientesDoProduto,
    removerIngredienteDoProduto
} = require('../controllers/produtoController');

const router = express.Router();

router.use(autenticar);

router.post('/', criarProduto);
router.get('/', listarProdutos);
router.get('/:id', buscarProduto);
router.put('/:id', atualizarProduto);
router.delete('/:id', deletarProduto);
router.post('/:id/ingredientes', adicionarIngrediente);
router.get('/:id/ingredientes', listarIngredientesDoProduto);
router.delete('/:id/ingredientes/:ingredienteId', removerIngredienteDoProduto);

module.exports = router;