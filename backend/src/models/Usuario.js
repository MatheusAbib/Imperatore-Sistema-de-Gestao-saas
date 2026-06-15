const db = require('../config/database');

class Usuario {
    static async criar(usuario) {
        const { nome, email, senha, perfil, estabelecimento_id } = usuario;
        const [result] = await db.execute(
            'INSERT INTO usuarios (nome, email, senha, perfil, estabelecimento_id) VALUES (?, ?, ?, ?, ?)',
            [nome, email, senha, perfil || 'atendente', estabelecimento_id]
        );
        return result.insertId;
    }

    static async buscarPorEmail(email) {
        const [rows] = await db.execute(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );
        return rows[0];
    }

    static async buscarPorId(id) {
        const [rows] = await db.execute(
            'SELECT id, nome, email, perfil, estabelecimento_id, created_at FROM usuarios WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    static async listar(usuario_id) {
        const [rows] = await db.execute(
            'SELECT id, nome, email, perfil, created_at FROM usuarios WHERE id != ? ORDER BY nome',
            [usuario_id]
        );
        return rows;
    }

    static async listarPorEstabelecimento(estabelecimento_id, usuario_id) {
        const [rows] = await db.execute(
            'SELECT id, nome, email, perfil, created_at FROM usuarios WHERE estabelecimento_id = ? AND id != ? ORDER BY nome',
            [estabelecimento_id, usuario_id]
        );
        return rows;
    }

    static async atualizarPerfil(id, perfil) {
        const [result] = await db.execute(
            'UPDATE usuarios SET perfil = ? WHERE id = ?',
            [perfil, id]
        );
        return result.affectedRows;
    }

    static async deletar(id) {
        const [result] = await db.execute('DELETE FROM usuarios WHERE id = ?', [id]);
        return result.affectedRows;
    }

    static async atualizarEstabelecimento(id, estabelecimento_id) {
        const [result] = await db.execute(
            'UPDATE usuarios SET estabelecimento_id = ? WHERE id = ?',
            [estabelecimento_id, id]
        );
        return result.affectedRows;
    }
}

module.exports = Usuario;