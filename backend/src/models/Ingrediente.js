const db = require('../config/database');

class Ingrediente {
    static async criar(ingrediente) {
        const { nome, unidade, custo_medio, estabelecimento_id, fator_conversao, unidade_uso } = ingrediente;
        const [result] = await db.execute(
            'INSERT INTO ingredientes (nome, unidade, custo_medio, estabelecimento_id, fator_conversao, unidade_uso) VALUES (?, ?, ?, ?, ?, ?)',
            [nome, unidade, custo_medio, estabelecimento_id, fator_conversao || 1, unidade_uso || unidade]
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
        const { nome, unidade, custo_medio, fator_conversao, unidade_uso } = dados;
        const [result] = await db.execute(
            'UPDATE ingredientes SET nome = ?, unidade = ?, custo_medio = ?, fator_conversao = ?, unidade_uso = ? WHERE id = ? AND estabelecimento_id = ?',
            [nome, unidade, custo_medio, fator_conversao || 1, unidade_uso || unidade, id, estabelecimento_id]
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

    static async calcularCustoUso(ingrediente_id, estabelecimento_id) {
        const [rows] = await db.execute(
            'SELECT custo_medio, fator_conversao FROM ingredientes WHERE id = ? AND estabelecimento_id = ?',
            [ingrediente_id, estabelecimento_id]
        );
        if (rows.length === 0) return 0;
        const custo = parseFloat(rows[0].custo_medio);
        const fator = parseFloat(rows[0].fator_conversao) || 1;
        return custo / fator;
    }
}

module.exports = Ingrediente;