const express = require('express');
const autenticar = require('../middlewares/auth');
const {
    criarComanda,
    listarComandas,
    listarItensComanda,
    adicionarItem,
    removerItem,
    listarPedidosCozinha,
    atualizarStatusPedido,
    fecharComanda,
    listarStatusPedidos,
    listarNotificacoes
} = require('../controllers/comandaController');

const router = express.Router();

router.use(autenticar);

router.post('/comandas', criarComanda);
router.get('/comandas', listarComandas);
router.get('/comandas/:id/itens', listarItensComanda);
router.get('/comandas/:id/pedidos/status', listarStatusPedidos);
router.post('/comandas/itens', adicionarItem);
router.delete('/comandas/itens/:id', removerItem);
router.get('/pedidos/cozinha', listarPedidosCozinha);
router.get('/pedidos/notificacoes', listarNotificacoes);
router.put('/pedidos/:id/status', atualizarStatusPedido);
router.put('/comandas/:id/fechar', fecharComanda);

module.exports = router;