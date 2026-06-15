const Produto = require('../models/Produto');
const Ingrediente = require('../models/Ingrediente');
const Usuario = require('../models/Usuario');

async function getEstabelecimentoId(usuarioId) {
    const usuario = await Usuario.buscarPorId(usuarioId);
    return usuario.estabelecimento_id;
}

async function criarProduto(req, res) {
    const { nome, preco_venda, categoria } = req.body;
    const estabelecimento_id = await getEstabelecimentoId(req.usuarioId);

    if (!nome || !preco_venda) {
        return res.status(400).json({ mensagem: 'Nome e preco de venda sao obrigatorios' });
    }

    const id = await Produto.criar({ nome, preco_venda, categoria, estabelecimento_id });
    const produto = await Produto.buscarPorId(id, estabelecimento_id);

    res.status(201).json(produto);
}

async function listarProdutos(req, res) {
    const estabelecimento_id = await getEstabelecimentoId(req.usuarioId);
    const produtos = await Produto.listarPorEstabelecimento(estabelecimento_id);

    for (const produto of produtos) {
        produto.custo = await Produto.calcularCusto(produto.id, estabelecimento_id);
        produto.margem = produto.preco_venda > 0 
            ? ((produto.preco_venda - produto.custo) / produto.preco_venda * 100).toFixed(2)
            : 0;
    }

    res.json(produtos);
}

async function buscarProduto(req, res) {
    const { id } = req.params;
    const estabelecimento_id = await getEstabelecimentoId(req.usuarioId);

    const produto = await Produto.buscarPorId(id, estabelecimento_id);
    if (!produto) {
        return res.status(404).json({ mensagem: 'Produto nao encontrado' });
    }

    produto.custo = await Produto.calcularCusto(produto.id, estabelecimento_id);
    produto.margem = produto.preco_venda > 0
        ? ((produto.preco_venda - produto.custo) / produto.preco_venda * 100).toFixed(2)
        : 0;

    res.json(produto);
}

async function atualizarProduto(req, res) {
    const { id } = req.params;
    const { nome, preco_venda, categoria } = req.body;
    const estabelecimento_id = await getEstabelecimentoId(req.usuarioId);

    const produto = await Produto.buscarPorId(id, estabelecimento_id);
    if (!produto) {
        return res.status(404).json({ mensagem: 'Produto nao encontrado' });
    }

    await Produto.atualizar(id, estabelecimento_id, { nome, preco_venda, categoria });
    res.json({ mensagem: 'Produto atualizado' });
}

async function deletarProduto(req, res) {
    const { id } = req.params;
    const estabelecimento_id = await getEstabelecimentoId(req.usuarioId);

    const produto = await Produto.buscarPorId(id, estabelecimento_id);
    if (!produto) {
        return res.status(404).json({ mensagem: 'Produto nao encontrado' });
    }

    await Produto.deletar(id, estabelecimento_id);
    res.json({ mensagem: 'Produto deletado' });
}

async function adicionarIngrediente(req, res) {
    const { id } = req.params;
    const { ingrediente_id, quantidade } = req.body;
    const estabelecimento_id = await getEstabelecimentoId(req.usuarioId);

    const produto = await Produto.buscarPorId(id, estabelecimento_id);
    if (!produto) {
        return res.status(404).json({ mensagem: 'Produto nao encontrado' });
    }

    const ingrediente = await Ingrediente.buscarPorId(ingrediente_id, estabelecimento_id);
    if (!ingrediente) {
        return res.status(404).json({ mensagem: 'Ingrediente nao encontrado' });
    }

    const db = require('../config/database');
    await db.execute(
        'INSERT INTO produto_ingredientes (produto_id, ingrediente_id, quantidade) VALUES (?, ?, ?)',
        [id, ingrediente_id, quantidade]
    );

    res.status(201).json({ mensagem: 'Ingrediente adicionado ao produto' });
}

async function listarIngredientesDoProduto(req, res) {
    const { id } = req.params;
    const estabelecimento_id = await getEstabelecimentoId(req.usuarioId);

    const produto = await Produto.buscarPorId(id, estabelecimento_id);
    if (!produto) {
        return res.status(404).json({ mensagem: 'Produto nao encontrado' });
    }

    const db = require('../config/database');
    const [rows] = await db.execute(
        `SELECT i.id, i.nome, i.unidade, i.custo_medio, pi.quantidade 
         FROM produto_ingredientes pi 
         JOIN ingredientes i ON pi.ingrediente_id = i.id 
         WHERE pi.produto_id = ? AND i.estabelecimento_id = ?`,
        [id, estabelecimento_id]
    );

    res.json(rows);
}

async function removerIngredienteDoProduto(req, res) {
    const { id, ingredienteId } = req.params;
    const estabelecimento_id = await getEstabelecimentoId(req.usuarioId);

    const produto = await Produto.buscarPorId(id, estabelecimento_id);
    if (!produto) {
        return res.status(404).json({ mensagem: 'Produto nao encontrado' });
    }

    const db = require('../config/database');
    await db.execute(
        'DELETE FROM produto_ingredientes WHERE produto_id = ? AND ingrediente_id = ?',
        [id, ingredienteId]
    );

    res.json({ mensagem: 'Ingrediente removido com sucesso' });
}

module.exports = {
    criarProduto,
    listarProdutos,
    buscarProduto,
    atualizarProduto,
    deletarProduto,
    adicionarIngrediente,
    listarIngredientesDoProduto,
    removerIngredienteDoProduto
};