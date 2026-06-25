const db = require('../config/database');

class Comanda {
    static async criar(comanda) {
        const { numero_mesa, nome_cliente, estabelecimento_id } = comanda;
        const [result] = await db.execute(
            'INSERT INTO comandas (numero_mesa, nome_cliente, estabelecimento_id, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
            [numero_mesa, nome_cliente, estabelecimento_id]
        );
        return result.insertId;
    }

static async listarPorEstabelecimento(estabelecimento_id) {
    const [rows] = await db.execute(
        `SELECT * FROM comandas 
         WHERE estabelecimento_id = ? 
         AND status = ? 
         ORDER BY numero_mesa`,
        [estabelecimento_id, 'aberta']
    );
    return rows;
}

    static async buscarPorId(id, estabelecimento_id) {
        const [rows] = await db.execute(
            'SELECT * FROM comandas WHERE id = ? AND estabelecimento_id = ?',
            [id, estabelecimento_id]
        );
        return rows[0];
    }

    static async atualizarTotal(id, total) {
        await db.execute(
            'UPDATE comandas SET total = ?, updated_at = NOW() WHERE id = ?',
            [total, id]
        );
    }

    static async fecharComanda(id) {
        await db.execute(
            'UPDATE comandas SET status = "fechada", updated_at = NOW() WHERE id = ?',
            [id]
        );
    }
}

module.exports = Comanda;