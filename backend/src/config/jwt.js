const jwt = require('jsonwebtoken');

function gerarToken(usuarioId, estabelecimentoId) {
    return jwt.sign({ id: usuarioId, estabelecimento_id: estabelecimentoId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function verificarToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
}

module.exports = { gerarToken, verificarToken };