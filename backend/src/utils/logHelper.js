const { registrarLog } = require('../controllers/logController');

async function logAction(usuarioId, estabelecimentoId, modulo, acao, descricao, ip = null) {
    await registrarLog(usuarioId, estabelecimentoId, modulo, acao, descricao, ip);
}

module.exports = { logAction };