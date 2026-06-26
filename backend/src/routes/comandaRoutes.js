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
    listarNotificacoes,
    marcarNotificacaoLida,
    marcarTodasNotificacoesLidas,
    criarNotificacao,
    listarDetalhesComandaFinalizada,
    listarComandasFinalizadas
} = require('../controllers/comandaController');

const router = express.Router();

router.use(autenticar);

router.post('/comandas', criarComanda);
router.get('/comandas', listarComandas);
router.get('/comandas/finalizadas', listarComandasFinalizadas);
router.get('/comandas/:id/itens', listarItensComanda);
router.get('/comandas/:id/pedidos/status', listarStatusPedidos);
router.post('/comandas/itens', adicionarItem);
router.delete('/comandas/itens/:id', removerItem);
router.get('/pedidos/cozinha', listarPedidosCozinha);
router.get('/notificacoes', listarNotificacoes);
router.get('/pedidos/notificacoes', listarNotificacoes);
router.post('/notificacoes', criarNotificacao);
router.put('/pedidos/:id/status', atualizarStatusPedido);
router.put('/comandas/:id/fechar', fecharComanda);
router.put('/notificacoes/:id/lida', marcarNotificacaoLida);
router.put('/notificacoes/lidas', marcarTodasNotificacoesLidas);
router.get('/comandas/finalizadas/:id/detalhes', listarDetalhesComandaFinalizada);

module.exports = router;