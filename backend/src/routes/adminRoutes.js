const express = require('express');
const autenticar = require('../middlewares/auth');
const {
    getStats,
    listarEstabelecimentos,
    criarEstabelecimento,
    atualizarEstabelecimento,
    deletarEstabelecimento,
    listarUsuariosPorEstabelecimento,
    criarUsuarioAdmin,
    atualizarUsuarioAdmin,
    deletarUsuarioAdmin,
    listarTodosUsuarios,
    listarUltimosEstabelecimentos,
    getCrescimentoMensal,
    getDistribuicaoPlanos
} = require('../controllers/adminController');

const router = express.Router();

router.use(autenticar);

router.get('/stats', getStats);
router.get('/estabelecimentos', listarEstabelecimentos);
router.post('/estabelecimentos', criarEstabelecimento);
router.put('/estabelecimentos/:id', atualizarEstabelecimento);
router.delete('/estabelecimentos/:id', deletarEstabelecimento);
router.get('/estabelecimentos/:id/usuarios', listarUsuariosPorEstabelecimento);
router.get('/usuarios/todos', listarTodosUsuarios);
router.post('/usuarios', criarUsuarioAdmin);
router.put('/usuarios/:id', atualizarUsuarioAdmin);
router.delete('/usuarios/:id', deletarUsuarioAdmin);
router.get('/ultimos-estabelecimentos', listarUltimosEstabelecimentos);
router.get('/crescimento-mensal', getCrescimentoMensal);
router.get('/distribuicao-planos', getDistribuicaoPlanos);

module.exports = router;