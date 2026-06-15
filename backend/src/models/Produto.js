const db = require('../config/database');

class Produto {
    static async criar(produto) {
        const { nome, preco_venda, categoria, estabelecimento_id } = produto;
        const [result] = await db.execute(
            'INSERT INTO produtos (nome, preco_venda, categoria, estabelecimento_id) VALUES (?, ?, ?, ?)',
            [nome, preco_venda, categoria, estabelecimento_id]
        );
        return result.insertId;
    }

    static async listarPorEstabelecimento(estabelecimento_id) {
        const [rows] = await db.execute(
            'SELECT * FROM produtos WHERE estabelecimento_id = ? ORDER BY nome',
            [estabelecimento_id]
        );
        return rows;
    }

    static async buscarPorId(id, estabelecimento_id) {
        const [rows] = await db.execute(
            'SELECT * FROM produtos WHERE id = ? AND estabelecimento_id = ?',
            [id, estabelecimento_id]
        );
        return rows[0];
    }

    static async atualizar(id, estabelecimento_id, dados) {
        const { nome, preco_venda, categoria } = dados;
        const [result] = await db.execute(
            'UPDATE produtos SET nome = ?, preco_venda = ?, categoria = ? WHERE id = ? AND estabelecimento_id = ?',
            [nome, preco_venda, categoria, id, estabelecimento_id]
        );
        return result.affectedRows;
    }

    static async deletar(id, estabelecimento_id) {
        const [result] = await db.execute(
            'DELETE FROM produtos WHERE id = ? AND estabelecimento_id = ?',
            [id, estabelecimento_id]
        );
        return result.affectedRows;
    }

    static async calcularCusto(produto_id, estabelecimento_id) {
        const [rows] = await db.execute(
            `SELECT SUM(pi.quantidade * i.custo_medio) as custo_total
             FROM produto_ingredientes pi
             JOIN ingredientes i ON pi.ingrediente_id = i.id
             WHERE pi.produto_id = ? AND i.estabelecimento_id = ?`,
            [produto_id, estabelecimento_id]
        );
        return rows[0].custo_total || 0;
    }
}

module.exports = Produto;