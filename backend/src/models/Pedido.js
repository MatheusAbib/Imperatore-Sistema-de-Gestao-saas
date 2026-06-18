const db = require('../config/database');

class Pedido {
    static async criar(pedido) {
        const { comanda_id, produto_id, quantidade, preco_unitario, criado_por, observacao } = pedido;
        const [result] = await db.execute(
            'INSERT INTO pedidos (comanda_id, produto_id, quantidade, preco_unitario, criado_por, observacao) VALUES (?, ?, ?, ?, ?, ?)',
            [comanda_id, produto_id, quantidade, preco_unitario, criado_por, observacao]
        );
        
        await db.execute(
            'INSERT INTO status_pedido (pedido_id, status, criado_por) VALUES (?, ?, ?)',
            [result.insertId, 'pendente', criado_por]
        );
        
        return result.insertId;
    }

    static async listarPorComanda(comanda_id, estabelecimento_id) {
        const [rows] = await db.execute(
            `SELECT p.*, pr.nome as produto_nome 
             FROM pedidos p 
             JOIN produtos pr ON p.produto_id = pr.id 
             WHERE p.comanda_id = ? AND pr.estabelecimento_id = ? 
             ORDER BY p.created_at ASC`,
            [comanda_id, estabelecimento_id]
        );
        return rows;
    }

    static async listarPorCozinha(estabelecimento_id) {
        const [rows] = await db.execute(
            `SELECT p.*, pr.nome as produto_nome, c.numero_mesa,
                    s.status as status_atual, s.created_at as status_created_at
             FROM pedidos p 
             JOIN produtos pr ON p.produto_id = pr.id 
             JOIN comandas c ON p.comanda_id = c.id 
             LEFT JOIN (
                SELECT pedido_id, status, created_at
                FROM status_pedido sp1
                WHERE created_at = (
                    SELECT MAX(created_at)
                    FROM status_pedido sp2
                    WHERE sp2.pedido_id = sp1.pedido_id
                )
             ) s ON p.id = s.pedido_id
             WHERE pr.estabelecimento_id = ? 
             AND c.status = 'aberta'
             ORDER BY p.created_at DESC`,
            [estabelecimento_id]
        );
        return rows;
    }

    static async atualizarStatus(pedido_id, status, usuario_id) {
        await db.execute(
            'INSERT INTO status_pedido (pedido_id, status, criado_por) VALUES (?, ?, ?)',
            [pedido_id, status, usuario_id]
        );
        
        await db.execute(
            'UPDATE pedidos SET status = ?, updated_at = NOW() WHERE id = ?',
            [status, pedido_id]
        );
    }
}

module.exports = Pedido;