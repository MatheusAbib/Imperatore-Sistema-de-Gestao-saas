const Lote = require('../models/Lote');
const Ingrediente = require('../models/Ingrediente');
const Usuario = require('../models/Usuario');

async function getEstabelecimentoId(usuarioId) {
    const usuario = await Usuario.buscarPorId(usuarioId);
    return usuario.estabelecimento_id;
}

async function registrarLote(req, res) {
    try {
        const { ingrediente_id, quantidade, data_validade, lote } = req.body;
        const estabelecimento_id = await getEstabelecimentoId(req.usuarioId);
        const usuario_id = req.usuarioId;

        if (!ingrediente_id || !quantidade || !data_validade) {
            return res.status(400).json({ mensagem: 'Ingrediente, quantidade e data de validade sao obrigatorios' });
        }

        const ingrediente = await Ingrediente.buscarPorId(ingrediente_id, estabelecimento_id);
        if (!ingrediente) {
            return res.status(404).json({ mensagem: 'Ingrediente nao encontrado' });
        }

        const id = await Lote.criar({ 
            ingrediente_id: parseInt(ingrediente_id), 
            quantidade: parseFloat(quantidade), 
            data_validade, 
            lote: lote || null, 
            estabelecimento_id,
            usuario_id
        });

        return res.status(201).json({ mensagem: 'Lote registrado com sucesso', id });
    } catch (error) {
        console.error('Erro ao registrar lote:', error);
        return res.status(500).json({ mensagem: 'Erro interno ao registrar lote', erro: error.message });
    }
}

async function listarLotes(req, res) {
    try {
        const estabelecimento_id = await getEstabelecimentoId(req.usuarioId);
        const lotes = await Lote.listarPorEstabelecimento(estabelecimento_id);
        return res.json(lotes);
    } catch (error) {
        console.error('Erro ao listar lotes:', error);
        return res.status(500).json({ mensagem: 'Erro ao listar lotes' });
    }
}

async function listarLotesPorIngrediente(req, res) {
    try {
        const { id } = req.params;
        const estabelecimento_id = await getEstabelecimentoId(req.usuarioId);
        
        const ingrediente = await Ingrediente.buscarPorId(id, estabelecimento_id);
        if (!ingrediente) {
            return res.status(404).json({ mensagem: 'Ingrediente nao encontrado' });
        }
        
        const lotes = await Lote.listarPorIngrediente(id, estabelecimento_id);
        return res.json(lotes);
    } catch (error) {
        console.error('Erro ao listar lotes por ingrediente:', error);
        return res.status(500).json({ mensagem: 'Erro ao listar lotes' });
    }
}

async function deletarLote(req, res) {
    try {
        const { id } = req.params;
        const estabelecimento_id = await getEstabelecimentoId(req.usuarioId);

        const result = await Lote.deletar(id, estabelecimento_id);
        if (result === 0) {
            return res.status(404).json({ mensagem: 'Lote nao encontrado' });
        }

        return res.json({ mensagem: 'Lote deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar lote:', error);
        return res.status(500).json({ mensagem: 'Erro ao deletar lote' });
    }
}

module.exports = { registrarLote, listarLotes, listarLotesPorIngrediente, deletarLote };