const express = require('express');
const autenticar = require('../middlewares/auth');
const {
    listarNotificacoes,
    marcarNotificacaoLida,
    marcarTodasNotificacoesLidas,
    deletarTodasNotificacoes,
    criarNotificacao
} = require('../controllers/notificacaoController');

const router = express.Router();

router.use(autenticar);

router.post('/', criarNotificacao);
router.get('/', listarNotificacoes);
router.delete('/', deletarTodasNotificacoes);
router.put('/lidas', marcarTodasNotificacoesLidas);
router.put('/:id/lida', marcarNotificacaoLida);

module.exports = router;