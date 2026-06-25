const Comanda = require('../models/Comanda');
const Pedido = require('../models/Pedido');
const Produto = require('../models/Produto');
const Usuario = require('../models/Usuario');
const { logAction } = require('../utils/logHelper');

async function getEstabelecimentoId(usuarioId) {
    if (!usuarioId) {
        throw new Error('Usuário não autenticado');
    }
    const usuario = await Usuario.buscarPorId(usuarioId);
    if (!usuario) {
        throw new Error('Usuário não encontrado');
    }
    return usuario.estabelecimento_id;
}

async function registrarNotificacao(estabelecimento_id, mensagem, pedido_id = null) {
    const db = require('../config/database');
    await db.execute(
        'INSERT INTO notificacoes (estabelecimento_id, mensagem, pedido_id, lida) VALUES (?, ?, ?, 0)',
        [estabelecimento_id, mensagem, pedido_id]
    );
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
        
        await logAction(req.usuarioId, estabelecimento_id, 'Notificacoes', 'Criou', `Criou notificação: ${mensagem}`, req.ip);
        
        res.status(201).json({ mensagem: 'Notificação enviada com sucesso' });
    } catch (error) {
        console.error('Erro ao criar notificação:', error);
        res.status(500).json({ mensagem: 'Erro ao criar notificação' });
    }
}

async function criarComanda(req, res) {
    const { numero_mesa, nome_cliente } = req.body;
    const estabelecimento_id = await getEstabelecimentoId(req.usuarioId);

    if (!numero_mesa) {
        return res.status(400).json({ mensagem: 'Numero da mesa é obrigatorio' });
    }

    const id = await Comanda.criar({ numero_mesa, nome_cliente, estabelecimento_id });
    const comanda = await Comanda.buscarPorId(id, estabelecimento_id);

    await registrarNotificacao(estabelecimento_id, `Comanda da Mesa ${numero_mesa} foi aberta${nome_cliente ? ` para ${nome_cliente}` : ''}`);
    await logAction(req.usuarioId, estabelecimento_id, 'Comandas', 'Criou', `Criou comanda da Mesa ${numero_mesa}${nome_cliente ? ` para ${nome_cliente}` : ''}`, req.ip);

    res.status(201).json(comanda);
}

async function listarComandas(req, res) {
    try {
        console.log('=== listarComandas iniciado ===');
        console.log('req.usuarioId:', req.usuarioId);
        
        const estabelecimento_id = await getEstabelecimentoId(req.usuarioId);
        console.log('estabelecimento_id:', estabelecimento_id);
        
        const comandas = await Comanda.listarPorEstabelecimento(estabelecimento_id);
        console.log('comandas encontradas:', comandas.length);
        
        res.json(comandas);
    } catch (error) {
        console.error('ERRO em listarComandas:', error.message);
        console.error('Stack:', error.stack);
        res.status(500).json({ 
            mensagem: 'Erro ao listar comandas', 
            erro: error.message,
            stack: error.stack 
        });
    }
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

    await registrarNotificacao(estabelecimento_id, `Pedido de ${produto.nome} (${quantidade}x) adicionado à Mesa ${comanda.numero_mesa}`);
    await logAction(req.usuarioId, estabelecimento_id, 'Comandas', 'Adicionou Item', `Adicionou ${quantidade}x ${produto.nome} à comanda ${comanda_id} (Mesa ${comanda.numero_mesa})`, req.ip);

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

    await logAction(req.usuarioId, estabelecimento_id, 'Comandas', 'Removeu Item', `Removeu item da comanda ${comanda_id}`, req.ip);

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
    const estabelecimento_id = await getEstabelecimentoId(usuario_id);

    await Pedido.atualizarStatus(id, status, usuario_id);

    const db = require('../config/database');
    const [pedidoInfo] = await db.execute(
        `SELECT p.quantidade, pr.nome as produto_nome, c.numero_mesa
         FROM pedidos p 
         JOIN produtos pr ON p.produto_id = pr.id 
         JOIN comandas c ON p.comanda_id = c.id 
         WHERE p.id = ?`,
        [id]
    );

    if (pedidoInfo.length > 0) {
        const p = pedidoInfo[0];
        let mensagem = '';
        switch (status) {
            case 'preparo':
                mensagem = `Pedido de ${p.produto_nome} (${p.quantidade}x) entrou em preparo - Mesa ${p.numero_mesa}`;
                break;
            case 'pronto':
                mensagem = `Pedido de ${p.produto_nome} (${p.quantidade}x) está pronto - Mesa ${p.numero_mesa}`;
                break;
            case 'entregue':
                mensagem = `Pedido de ${p.produto_nome} (${p.quantidade}x) foi entregue - Mesa ${p.numero_mesa}`;
                break;
            default:
                mensagem = `Status do pedido ${p.produto_nome} atualizado para ${status}`;
        }
        await registrarNotificacao(estabelecimento_id, mensagem, id);
        await logAction(req.usuarioId, estabelecimento_id, 'Pedidos', 'Mudou Status', `Pedido ${id} - ${p.produto_nome} (${p.quantidade}x) - Status: ${status} (Mesa ${p.numero_mesa})`, req.ip);
    }

    res.json({ mensagem: 'Status atualizado com sucesso' });
}

async function fecharComanda(req, res) {
    const { id } = req.params;
    const estabelecimento_id = await getEstabelecimentoId(req.usuarioId);

    const comanda = await Comanda.buscarPorId(id, estabelecimento_id);
    if (!comanda) {
        return res.status(404).json({ mensagem: 'Comanda nao encontrada' });
    }

    const total = comanda.total;
    const numero_mesa = comanda.numero_mesa;

    await Comanda.fecharComanda(id);
    await registrarNotificacao(estabelecimento_id, `Comanda da Mesa ${numero_mesa} foi fechada - Total: R$ ${parseFloat(total).toFixed(2)}`);
    await logAction(req.usuarioId, estabelecimento_id, 'Comandas', 'Fechou', `Fechou comanda da Mesa ${numero_mesa} - Total: R$ ${parseFloat(total).toFixed(2)}`, req.ip);

    res.json({ mensagem: 'Comanda fechada com sucesso' });
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
    
    await logAction(req.usuarioId, estabelecimento_id, 'Notificacoes', 'Marcou Lida', `Marcou notificação ${id} como lida`, req.ip);
    
    res.json({ mensagem: 'Notificação marcada como lida' });
}

async function marcarTodasNotificacoesLidas(req, res) {
    const estabelecimento_id = await getEstabelecimentoId(req.usuarioId);
    const db = require('../config/database');
    
    await db.execute(
        'UPDATE notificacoes SET lida = 1 WHERE estabelecimento_id = ?',
        [estabelecimento_id]
    );
    
    await logAction(req.usuarioId, estabelecimento_id, 'Notificacoes', 'Marcou Todas Lidas', 'Marcou todas as notificações como lidas', req.ip);
    
    res.json({ mensagem: 'Todas notificações marcadas como lidas' });
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
    marcarNotificacaoLida,
    marcarTodasNotificacoesLidas,
    listarStatusPedidos,
    criarNotificacao
};