const Usuario = require('../models/Usuario');

async function getEstabelecimentoId(usuarioId) {
    const usuario = await Usuario.buscarPorId(usuarioId);
    return usuario.estabelecimento_id;
}

async function listarNotificacoes(req, res) {
    const estabelecimento_id = await getEstabelecimentoId(req.usuarioId);
    const db = require('../config/database');
    
    const [rows] = await db.execute(
        `SELECT * FROM notificacoes 
         WHERE estabelecimento_id = ? 
         ORDER BY created_at DESC 
         LIMIT 50`,
        [estabelecimento_id]
    );
    
    res.json(rows);
}

async function marcarNotificacaoLida(req, res) {
    const { id } = req.params;
    const estabelecimento_id = await getEstabelecimentoId(req.usuarioId);
    const db = require('../config/database');
    
    await db.execute(
        'UPDATE notificacoes SET lida = 1 WHERE id = ? AND estabelecimento_id = ?',
        [id, estabelecimento_id]
    );
    
    res.json({ mensagem: 'Notificação marcada como lida' });
}

async function marcarTodasNotificacoesLidas(req, res) {
    const estabelecimento_id = await getEstabelecimentoId(req.usuarioId);
    const db = require('../config/database');
    
    await db.execute(
        'UPDATE notificacoes SET lida = 1 WHERE estabelecimento_id = ?',
        [estabelecimento_id]
    );
    
    res.json({ mensagem: 'Todas notificações marcadas como lidas' });
}

async function deletarTodasNotificacoes(req, res) {
    const estabelecimento_id = await getEstabelecimentoId(req.usuarioId);
    const db = require('../config/database');
    
    await db.execute(
        'DELETE FROM notificacoes WHERE estabelecimento_id = ?',
        [estabelecimento_id]
    );
    
    res.json({ mensagem: 'Todas notificações deletadas' });
}

async function criarNotificacao(req, res) {
    try {
        const { mensagem, pedido_id } = req.body;
        const estabelecimento_id = await getEstabelecimentoId(req.usuarioId);
        const db = require('../config/database');
        
        if (!mensagem) {
            return res.status(400).json({ mensagem: 'Mensagem é obrigatória' });
        }
        
        await db.execute(
            'INSERT INTO notificacoes (estabelecimento_id, mensagem, pedido_id, lida) VALUES (?, ?, ?, 0)',
            [estabelecimento_id, mensagem, pedido_id || null]
        );
        
        res.status(201).json({ mensagem: 'Notificação enviada com sucesso' });
    } catch (error) {
        console.error('Erro ao criar notificação:', error);
        res.status(500).json({ mensagem: 'Erro ao criar notificação' });
    }
}

module.exports = {
    listarNotificacoes,
    marcarNotificacaoLida,
    marcarTodasNotificacoesLidas,
    deletarTodasNotificacoes,
    criarNotificacao
};