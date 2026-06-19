const db = require('../config/database');

class Log {
    static async criar(log) {
        const { usuario_id, estabelecimento_id, modulo, acao, descricao, ip } = log;
        const [result] = await db.execute(
            'INSERT INTO logs (usuario_id, estabelecimento_id, modulo, acao, descricao, ip) VALUES (?, ?, ?, ?, ?, ?)',
            [usuario_id, estabelecimento_id || null, modulo, acao, descricao, ip || null]
        );
        return result.insertId;
    }

    static async listar(filtros = {}) {
        let sql = `
            SELECT l.*, u.nome as usuario_nome, u.perfil, e.nome as estabelecimento_nome
            FROM logs l
            JOIN usuarios u ON l.usuario_id = u.id
            LEFT JOIN estabelecimentos e ON l.estabelecimento_id = e.id
            WHERE 1=1
        `;
        const params = [];

        if (filtros.estabelecimento_id) {
            sql += ' AND l.estabelecimento_id = ?';
            params.push(filtros.estabelecimento_id);
        }

        if (filtros.modulo) {
            sql += ' AND l.modulo = ?';
            params.push(filtros.modulo);
        }

        if (filtros.usuario_id) {
            sql += ' AND l.usuario_id = ?';
            params.push(filtros.usuario_id);
        }

        if (filtros.data_inicio) {
            sql += ' AND DATE(l.created_at) >= ?';
            params.push(filtros.data_inicio);
        }

        if (filtros.data_fim) {
            sql += ' AND DATE(l.created_at) <= ?';
            params.push(filtros.data_fim);
        }

        sql += ' ORDER BY l.created_at DESC LIMIT ? OFFSET ?';
        params.push(filtros.limite || 20);
        params.push(filtros.offset || 0);

        const [rows] = await db.execute(sql, params);
        return rows;
    }

    static async contar(filtros = {}) {
        let sql = 'SELECT COUNT(*) as total FROM logs l WHERE 1=1';
        const params = [];

        if (filtros.estabelecimento_id) {
            sql += ' AND l.estabelecimento_id = ?';
            params.push(filtros.estabelecimento_id);
        }

        if (filtros.modulo) {
            sql += ' AND l.modulo = ?';
            params.push(filtros.modulo);
        }

        if (filtros.usuario_id) {
            sql += ' AND l.usuario_id = ?';
            params.push(filtros.usuario_id);
        }

        if (filtros.data_inicio) {
            sql += ' AND DATE(l.created_at) >= ?';
            params.push(filtros.data_inicio);
        }

        if (filtros.data_fim) {
            sql += ' AND DATE(l.created_at) <= ?';
            params.push(filtros.data_fim);
        }

        const [rows] = await db.execute(sql, params);
        return rows[0].total;
    }

    static async deletarAntigos(dias) {
        const [result] = await db.execute(
            'DELETE FROM logs WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)',
            [dias]
        );
        return result.affectedRows;
    }
}

module.exports = Log;