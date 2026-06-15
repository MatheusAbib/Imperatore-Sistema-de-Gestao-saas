const db = require('../config/database');

class Ingrediente {
    static async criar(ingrediente) {
        const { nome, unidade, custo_medio, estabelecimento_id } = ingrediente;
        const [result] = await db.execute(
            'INSERT INTO ingredientes (nome, unidade, custo_medio, estabelecimento_id) VALUES (?, ?, ?, ?)',
            [nome, unidade, custo_medio, estabelecimento_id]
        );
        return result.insertId;
    }

    static async listarPorEstabelecimento(estabelecimento_id) {
        const [rows] = await db.execute(
            'SELECT * FROM ingredientes WHERE estabelecimento_id = ? ORDER BY nome',
            [estabelecimento_id]
        );
        return rows;
    }

    static async buscarPorId(id, estabelecimento_id) {
        const [rows] = await db.execute(
            'SELECT * FROM ingredientes WHERE id = ? AND estabelecimento_id = ?',
            [id, estabelecimento_id]
        );
        return rows[0];
    }

    static async atualizar(id, estabelecimento_id, dados) {
        const { nome, unidade, custo_medio } = dados;
        const [result] = await db.execute(
            'UPDATE ingredientes SET nome = ?, unidade = ?, custo_medio = ? WHERE id = ? AND estabelecimento_id = ?',
            [nome, unidade, custo_medio, id, estabelecimento_id]
        );
        return result.affectedRows;
    }

    static async deletar(id, estabelecimento_id) {
        const [result] = await db.execute(
            'DELETE FROM ingredientes WHERE id = ? AND estabelecimento_id = ?',
            [id, estabelecimento_id]
        );
        return result.affectedRows;
    }
}

module.exports = Ingrediente;