const Log = require('../models/Log');
const db = require('../config/database');

async function registrarLog(usuario_id, estabelecimento_id, modulo, acao, descricao, ip = null) {
    try {
        await Log.criar({
            usuario_id,
            estabelecimento_id,
            modulo,
            acao,
            descricao,
            ip
        });
    } catch (error) {
        console.error('Erro ao registrar log:', error);
    }
}

async function listarLogs(req, res) {
    try {
        const usuario_id = req.usuarioId;
        const usuario = await db.execute('SELECT perfil, estabelecimento_id FROM usuarios WHERE id = ?', [usuario_id]);
        const perfil = usuario[0][0].perfil;
        const estabelecimento_id_usuario = usuario[0][0].estabelecimento_id;

        const { modulo, estabelecimento_id, usuario_id: filtro_usuario, data_inicio, data_fim, pagina = 1, limite = 20 } = req.query;
        const limit = parseInt(limite) || 20;
        const offset = parseInt((pagina - 1) * limit) || 0;

        let sql = `
            SELECT l.*, u.nome as usuario_nome, u.perfil, e.nome as estabelecimento_nome
            FROM logs l
            JOIN usuarios u ON l.usuario_id = u.id
            LEFT JOIN estabelecimentos e ON l.estabelecimento_id = e.id
            WHERE 1=1
        `;
        const params = [];

        if (perfil === 'admin') {
            if (estabelecimento_id) {
                sql += ' AND l.estabelecimento_id = ?';
                params.push(parseInt(estabelecimento_id));
            }
        } else if (perfil === 'dono' || perfil === 'gerente') {
            sql += ' AND l.estabelecimento_id = ?';
            params.push(estabelecimento_id_usuario);
        } else {
            return res.status(403).json({ mensagem: 'Acesso negado' });
        }

        if (filtro_usuario) {
            sql += ' AND l.usuario_id = ?';
            params.push(parseInt(filtro_usuario));
        }

        if (modulo) {
            sql += ' AND l.modulo = ?';
            params.push(modulo);
        }

        if (data_inicio) {
            sql += ' AND DATE(l.created_at) >= ?';
            params.push(data_inicio);
        }

        if (data_fim) {
            sql += ' AND DATE(l.created_at) <= ?';
            params.push(data_fim);
        }

        let countSql = sql.replace(
            'SELECT l.*, u.nome as usuario_nome, u.perfil, e.nome as estabelecimento_nome',
            'SELECT COUNT(*) as total'
        );
        const [countResult] = await db.execute(countSql, params);
        const total = countResult[0].total;

        sql += ' ORDER BY l.created_at DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const [rows] = await db.execute(sql, params);

        res.json({
            logs: rows,
            total,
            pagina: parseInt(pagina),
            totalPaginas: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error('Erro ao listar logs:', error);
        res.status(500).json({ mensagem: 'Erro ao listar logs', error: error.message });
    }
}

async function limparLogsAntigos(req, res) {
    try {
        const { dias = 30 } = req.query;
        const removidos = await Log.deletarAntigos(parseInt(dias));
        res.json({ mensagem: `${removidos} logs removidos` });
    } catch (error) {
        console.error('Erro ao limpar logs:', error);
        res.status(500).json({ mensagem: 'Erro ao limpar logs' });
    }
}

module.exports = {
    registrarLog,
    listarLogs,
    limparLogsAntigos
};