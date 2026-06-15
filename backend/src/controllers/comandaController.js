const Comanda = require('../models/Comanda');
const Pedido = require('../models/Pedido');
const Produto = require('../models/Produto');
const Usuario = require('../models/Usuario');

async function getEstabelecimentoId(usuarioId) {
    const usuario = await Usuario.buscarPorId(usuarioId);
    return usuario.estabelecimento_id;
}

async function criarComanda(req, res) {
    const { numero_mesa, nome_cliente } = req.body;
    const estabelecimento_id = await getEstabelecimentoId(req.usuarioId);

    if (!numero_mesa) {
        return res.status(400).json({ mensagem: 'Numero da mesa é obrigatorio' });
    }

    const id = await Comanda.criar({ numero_mesa, nome_cliente, estabelecimento_id });
    const comanda = await Comanda.buscarPorId(id, estabelecimento_id);

    res.status(201).json(comanda);
}

async function listarComandas(req, res) {
    const estabelecimento_id = await getEstabelecimentoId(req.usuarioId);
    const comandas = await Comanda.listarPorEstabelecimento(estabelecimento_id);
    res.json(comandas);
}

async function listarItensComanda(req, res) {
    const { id } = req.params;
    const estabelecimento_id = await getEstabelecimentoId(req.usuarioId);
    
    const comanda = await Comanda.buscarPorId(id, estabelecimento_id);
    if (!comanda) {
        return res.status(404).json({ mensagem: 'Comanda nao encontrada' });
    }
    
    const itens = await Pedido.listarPorComanda(id, estabelecimento_id);
    res.json(itens);
}

async function adicionarItem(req, res) {
    const { comanda_id, produto_id, quantidade, observacao } = req.body;
    const usuario_id = req.usuarioId;
    const estabelecimento_id = await getEstabelecimentoId(usuario_id);

    const comanda = await Comanda.buscarPorId(comanda_id, estabelecimento_id);
    if (!comanda) {
        return res.status(404).json({ mensagem: 'Comanda nao encontrada' });
    }

    const produto = await Produto.buscarPorId(produto_id, estabelecimento_id);
    if (!produto) {
        return res.status(404).json({ mensagem: 'Produto nao encontrado' });
    }

    const pedidoId = await Pedido.criar({
        comanda_id,
        produto_id,
        quantidade,
        preco_unitario: produto.preco_venda,
        criado_por: usuario_id,
        observacao: observacao || null
    });

    const itens = await Pedido.listarPorComanda(comanda_id, estabelecimento_id);
    let total = 0;
    for (const item of itens) {
        total += item.quantidade * item.preco_unitario;
    }
    await Comanda.atualizarTotal(comanda_id, total);

    res.status(201).json({ mensagem: 'Item adicionado com sucesso', pedido_id: pedidoId });
}

async function removerItem(req, res) {
    const { id } = req.params;
    const usuario_id = req.usuarioId;
    const estabelecimento_id = await getEstabelecimentoId(usuario_id);

    const db = require('../config/database');
    
    const [rows] = await db.execute(
        `SELECT p.comanda_id 
         FROM pedidos p 
         JOIN comandas c ON p.comanda_id = c.id 
         WHERE p.id = ? AND c.estabelecimento_id = ?`,
        [id, estabelecimento_id]
    );
    
    if (rows.length === 0) {
        return res.status(404).json({ mensagem: 'Item nao encontrado' });
    }
    
    const comanda_id = rows[0].comanda_id;
    
    await db.execute('DELETE FROM pedidos WHERE id = ?', [id]);
    
    const itens = await Pedido.listarPorComanda(comanda_id, estabelecimento_id);
    let total = 0;
    for (const item of itens) {
        total += item.quantidade * item.preco_unitario;
    }
    await Comanda.atualizarTotal(comanda_id, total);

    res.json({ mensagem: 'Item removido com sucesso' });
}

async function listarPedidosCozinha(req, res) {
    const estabelecimento_id = await getEstabelecimentoId(req.usuarioId);
    const pedidos = await Pedido.listarPorCozinha(estabelecimento_id);
    res.json(pedidos);
}

async function atualizarStatusPedido(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    const usuario_id = req.usuarioId;

    await Pedido.atualizarStatus(id, status, usuario_id);
    res.json({ mensagem: 'Status atualizado com sucesso' });
}

async function fecharComanda(req, res) {
    const { id } = req.params;
    const estabelecimento_id = await getEstabelecimentoId(req.usuarioId);

    const comanda = await Comanda.buscarPorId(id, estabelecimento_id);
    if (!comanda) {
        return res.status(404).json({ mensagem: 'Comanda nao encontrada' });
    }

    await Comanda.fecharComanda(id);
    res.json({ mensagem: 'Comanda fechada com sucesso' });
}

async function listarNotificacoes(req, res) {
    const estabelecimento_id = await getEstabelecimentoId(req.usuarioId);
    const db = require('../config/database');
    
    const [rows] = await db.execute(
        `SELECT p.id, p.status, p.quantidade, pr.nome as produto_nome, c.numero_mesa
         FROM pedidos p 
         JOIN produtos pr ON p.produto_id = pr.id 
         JOIN comandas c ON p.comanda_id = c.id 
         WHERE pr.estabelecimento_id = ? AND c.status = 'aberta'
         ORDER BY p.updated_at DESC`,
        [estabelecimento_id]
    );
    
    res.json(rows);
}

async function listarStatusPedidos(req, res) {
    const { id } = req.params;
    const estabelecimento_id = await getEstabelecimentoId(req.usuarioId);
    
    const db = require('../config/database');
    const [rows] = await db.execute(
        `SELECT p.id, sp.status 
         FROM pedidos p 
         LEFT JOIN (
            SELECT pedido_id, status, created_at
            FROM status_pedido sp1
            WHERE created_at = (
                SELECT MAX(created_at)
                FROM status_pedido sp2
                WHERE sp2.pedido_id = sp1.pedido_id
            )
         ) sp ON p.id = sp.pedido_id
         WHERE p.comanda_id = ?`,
        [id]
    );
    
    res.json(rows);
}

module.exports = {
    criarComanda,
    listarComandas,
    listarItensComanda,
    adicionarItem,
    removerItem,
    listarPedidosCozinha,
    atualizarStatusPedido,
    fecharComanda,
    listarNotificacoes,
    listarStatusPedidos
};