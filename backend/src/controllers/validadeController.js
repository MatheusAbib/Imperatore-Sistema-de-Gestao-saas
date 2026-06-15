const Validade = require('../models/Validade');
const Ingrediente = require('../models/Ingrediente');
const Usuario = require('../models/Usuario');

async function getEstabelecimentoId(usuarioId) {
    const usuario = await Usuario.buscarPorId(usuarioId);
    return usuario.estabelecimento_id;
}

async function registrarValidade(req, res) {
    const { ingrediente_id, quantidade, data_validade, lote } = req.body;
    const estabelecimento_id = await getEstabelecimentoId(req.usuarioId);

    if (!ingrediente_id || !quantidade || !data_validade) {
        return res.status(400).json({ mensagem: 'Ingrediente, quantidade e data de validade sao obrigatorios' });
    }

    const ingrediente = await Ingrediente.buscarPorId(ingrediente_id, estabelecimento_id);
    if (!ingrediente) {
        return res.status(404).json({ mensagem: 'Ingrediente nao encontrado' });
    }

    const id = await Validade.criar({
        ingrediente_id,
        quantidade,
        data_validade,
        lote,
        estabelecimento_id
    });

    res.status(201).json({ mensagem: 'Validade registrada com sucesso', id });
}

async function listarValidades(req, res) {
    const estabelecimento_id = await getEstabelecimentoId(req.usuarioId);
    const validades = await Validade.listarPorEstabelecimento(estabelecimento_id);
    res.json(validades);
}

async function listarVencendo(req, res) {
    const estabelecimento_id = await getEstabelecimentoId(req.usuarioId);
    const dias = req.query.dias || 7;
    const vencendo = await Validade.listarVencendo(estabelecimento_id, dias);
    res.json(vencendo);
}

async function deletarValidade(req, res) {
    const { id } = req.params;
    const estabelecimento_id = await getEstabelecimentoId(req.usuarioId);

    const result = await Validade.deletar(id, estabelecimento_id);
    if (result === 0) {
        return res.status(404).json({ mensagem: 'Registro nao encontrado' });
    }

    res.json({ mensagem: 'Registro deletado com sucesso' });
}

module.exports = { registrarValidade, listarValidades, listarVencendo, deletarValidade };