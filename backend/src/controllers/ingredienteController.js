const Ingrediente = require('../models/Ingrediente');
const Usuario = require('../models/Usuario');

async function getEstabelecimentoId(usuarioId) {
    const usuario = await Usuario.buscarPorId(usuarioId);
    return usuario.estabelecimento_id;
}

async function criarIngrediente(req, res) {
    const { nome, unidade, custo_medio } = req.body;
    const estabelecimento_id = await getEstabelecimentoId(req.usuarioId);

    if (!nome || !unidade) {
        return res.status(400).json({ mensagem: 'Nome e unidade sao obrigatorios' });
    }

    const id = await Ingrediente.criar({ nome, unidade, custo_medio: custo_medio || 0, estabelecimento_id });
    const ingrediente = await Ingrediente.buscarPorId(id, estabelecimento_id);

    res.status(201).json(ingrediente);
}

async function listarIngredientes(req, res) {
    const estabelecimento_id = await getEstabelecimentoId(req.usuarioId);
    const ingredientes = await Ingrediente.listarPorEstabelecimento(estabelecimento_id);
    res.json(ingredientes);
}

async function buscarIngrediente(req, res) {
    const { id } = req.params;
    const estabelecimento_id = await getEstabelecimentoId(req.usuarioId);

    const ingrediente = await Ingrediente.buscarPorId(id, estabelecimento_id);
    if (!ingrediente) {
        return res.status(404).json({ mensagem: 'Ingrediente nao encontrado' });
    }

    res.json(ingrediente);
}

async function atualizarIngrediente(req, res) {
    const { id } = req.params;
    const { nome, unidade, custo_medio } = req.body;
    const estabelecimento_id = await getEstabelecimentoId(req.usuarioId);

    const ingrediente = await Ingrediente.buscarPorId(id, estabelecimento_id);
    if (!ingrediente) {
        return res.status(404).json({ mensagem: 'Ingrediente nao encontrado' });
    }

    await Ingrediente.atualizar(id, estabelecimento_id, { nome, unidade, custo_medio });
    res.json({ mensagem: 'Ingrediente atualizado' });
}

async function deletarIngrediente(req, res) {
    const { id } = req.params;
    const estabelecimento_id = await getEstabelecimentoId(req.usuarioId);

    const ingrediente = await Ingrediente.buscarPorId(id, estabelecimento_id);
    if (!ingrediente) {
        return res.status(404).json({ mensagem: 'Ingrediente nao encontrado' });
    }

    await Ingrediente.deletar(id, estabelecimento_id);
    res.json({ mensagem: 'Ingrediente deletado' });
}

module.exports = {
    criarIngrediente,
    listarIngredientes,
    buscarIngrediente,
    atualizarIngrediente,
    deletarIngrediente
};