const jwt = require('jsonwebtoken');

function autenticar(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ mensagem: 'Token nao fornecido' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuarioId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ mensagem: 'Token invalido' });
    }
}

module.exports = autenticar;