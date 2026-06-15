const db = require('../config/database');

class Validade {
    static async criar(validade) {
        const { ingrediente_id, quantidade, data_validade, lote, estabelecimento_id } = validade;
        const [result] = await db.execute(
            'INSERT INTO validade (ingrediente_id, quantidade, data_validade, lote, estabelecimento_id) VALUES (?, ?, ?, ?, ?)',
            [ingrediente_id, quantidade, data_validade, lote, estabelecimento_id]
        );
        return result.insertId;
    }

    static async listarPorEstabelecimento(estabelecimento_id) {
        const [rows] = await db.execute(
            `SELECT v.*, i.nome as ingrediente_nome, i.unidade 
             FROM validade v 
             JOIN ingredientes i ON v.ingrediente_id = i.id 
             WHERE v.estabelecimento_id = ? 
             ORDER BY v.data_validade ASC`,
            [estabelecimento_id]
        );
        return rows;
    }
    

    static async listarVencendo(estabelecimento_id, dias = 7) {
        const [rows] = await db.execute(
            `SELECT v.*, i.nome as ingrediente_nome, i.unidade 
             FROM validade v 
             JOIN ingredientes i ON v.ingrediente_id = i.id 
             WHERE v.estabelecimento_id = ? 
             AND v.data_validade <= DATE_ADD(CURDATE(), INTERVAL ? DAY)
             AND v.data_validade >= CURDATE()
             ORDER BY v.data_validade ASC`,
            [estabelecimento_id, dias]
        );
        return rows;
    }

    static async deletar(id, estabelecimento_id) {
        const [result] = await db.execute(
            'DELETE FROM validade WHERE id = ? AND estabelecimento_id = ?',
            [id, estabelecimento_id]
        );
        return result.affectedRows;
    }
}

module.exports = Validade;