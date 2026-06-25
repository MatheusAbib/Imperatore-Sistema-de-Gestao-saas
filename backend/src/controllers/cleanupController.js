const { limparComandasFechadas } = require('../services/cleanupService');

async function limparComandas(req, res) {
    try {
        const removidas = await limparComandasFechadas();
        res.json({ mensagem: `${removidas} comandas removidas` });
    } catch (error) {
        console.error('Erro ao limpar comandas:', error);
        res.status(500).json({ mensagem: 'Erro ao limpar comandas' });
    }
}

module.exports = { limparComandas };