const db = require('../config/database');

async function getStats(req, res) {
    try {
        const [estabelecimentos] = await db.execute('SELECT COUNT(*) as total FROM estabelecimentos');
        const [usuarios] = await db.execute('SELECT COUNT(*) as total FROM usuarios');
        const [produtos] = await db.execute('SELECT COUNT(*) as total FROM produtos');
        const [pedidos] = await db.execute('SELECT COUNT(*) as total FROM pedidos');

        res.json({
            totalEstabelecimentos: estabelecimentos[0].total,
            totalUsuarios: usuarios[0].total,
            totalProdutos: produtos[0].total,
            totalPedidos: pedidos[0].total
        });
    } catch (error) {
        console.error('Erro ao buscar stats:', error);
        res.status(500).json({ mensagem: 'Erro ao buscar estatísticas' });
    }
}

async function listarEstabelecimentos(req, res) {
    try {
        const [rows] = await db.execute(
            'SELECT * FROM estabelecimentos ORDER BY nome'
        );
        res.json(rows);
    } catch (error) {
        console.error('Erro ao listar estabelecimentos:', error);
        res.status(500).json({ mensagem: 'Erro ao listar estabelecimentos' });
    }
}

async function criarEstabelecimento(req, res) {
    try {
        const { nome, cnpj, plano, status } = req.body;
        const [result] = await db.execute(
            'INSERT INTO estabelecimentos (nome, cnpj, plano, status) VALUES (?, ?, ?, ?)',
            [nome, cnpj || null, plano || 'gratis', status || 'ativo']
        );
        res.status(201).json({ id: result.insertId, mensagem: 'Estabelecimento criado com sucesso' });
    } catch (error) {
        console.error('Erro ao criar estabelecimento:', error);
        res.status(500).json({ mensagem: 'Erro ao criar estabelecimento' });
    }
}

async function atualizarEstabelecimento(req, res) {
    try {
        const { id } = req.params;
        const { nome, cnpj, plano, status } = req.body;
        await db.execute(
            'UPDATE estabelecimentos SET nome = ?, cnpj = ?, plano = ?, status = ? WHERE id = ?',
            [nome, cnpj || null, plano || 'gratis', status || 'ativo', id]
        );
        res.json({ mensagem: 'Estabelecimento atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar estabelecimento:', error);
        res.status(500).json({ mensagem: 'Erro ao atualizar estabelecimento' });
    }
}

async function deletarEstabelecimento(req, res) {
    try {
        const { id } = req.params;
        const db = require('../config/database');
        
        await db.execute('DELETE FROM notificacoes WHERE estabelecimento_id = ?', [id]);
        await db.execute('DELETE FROM movimentos_estoque WHERE lote_id IN (SELECT id FROM lotes WHERE estabelecimento_id = ?)', [id]);
        await db.execute('DELETE FROM lotes WHERE estabelecimento_id = ?', [id]);
        await db.execute('DELETE FROM produto_ingredientes WHERE produto_id IN (SELECT id FROM produtos WHERE estabelecimento_id = ?)', [id]);
        await db.execute('DELETE FROM status_pedido WHERE pedido_id IN (SELECT id FROM pedidos WHERE comanda_id IN (SELECT id FROM comandas WHERE estabelecimento_id = ?))', [id]);
        await db.execute('DELETE FROM pedidos WHERE comanda_id IN (SELECT id FROM comandas WHERE estabelecimento_id = ?)', [id]);
        await db.execute('DELETE FROM comandas WHERE estabelecimento_id = ?', [id]);
        await db.execute('DELETE FROM ingredientes WHERE estabelecimento_id = ?', [id]);
        await db.execute('DELETE FROM produtos WHERE estabelecimento_id = ?', [id]);
        await db.execute('DELETE FROM usuarios WHERE estabelecimento_id = ?', [id]);
        await db.execute('DELETE FROM estabelecimentos WHERE id = ?', [id]);

        res.json({ mensagem: 'Estabelecimento e todos os dados associados deletados com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar estabelecimento:', error);
        res.status(500).json({ mensagem: 'Erro ao deletar estabelecimento' });
    }
}

async function listarTodosUsuarios(req, res) {
    try {
        const [rows] = await db.execute(
            `SELECT u.id, u.nome, u.email, u.perfil, u.estabelecimento_id, 
                    e.nome as estabelecimento_nome, e.cnpj
             FROM usuarios u
             LEFT JOIN estabelecimentos e ON u.estabelecimento_id = e.id
             ORDER BY e.nome, u.nome`
        );
        res.json(rows);
    } catch (error) {
        console.error('Erro ao listar todos os usuarios:', error);
        res.status(500).json({ mensagem: 'Erro ao listar usuários' });
    }
}

async function listarUsuariosPorEstabelecimento(req, res) {
    try {
        const { id } = req.params;
        const [rows] = await db.execute(
            'SELECT id, nome, email, perfil, created_at FROM usuarios WHERE estabelecimento_id = ? ORDER BY nome',
            [id]
        );
        res.json(rows);
    } catch (error) {
        console.error('Erro ao listar usuarios:', error);
        res.status(500).json({ mensagem: 'Erro ao listar usuários' });
    }
}

async function criarUsuarioAdmin(req, res) {
    try {
        const { nome, email, senha, perfil, estabelecimento_id } = req.body;
        const bcrypt = require('bcryptjs');
        const senhaHash = await bcrypt.hash(senha, 10);
        const [result] = await db.execute(
            'INSERT INTO usuarios (nome, email, senha, perfil, estabelecimento_id) VALUES (?, ?, ?, ?, ?)',
            [nome, email, senhaHash, perfil || 'atendente', estabelecimento_id]
        );
        res.status(201).json({ id: result.insertId, mensagem: 'Usuário criado com sucesso' });
    } catch (error) {
        console.error('Erro ao criar usuario:', error);
        res.status(500).json({ mensagem: 'Erro ao criar usuário' });
    }
}

async function atualizarUsuarioAdmin(req, res) {
    try {
        const { id } = req.params;
        const { nome, email, perfil, senha } = req.body;
        
        if (senha) {
            const bcrypt = require('bcryptjs');
            const senhaHash = await bcrypt.hash(senha, 10);
            await db.execute(
                'UPDATE usuarios SET nome = ?, email = ?, perfil = ?, senha = ? WHERE id = ?',
                [nome, email, perfil, senhaHash, id]
            );
        } else {
            await db.execute(
                'UPDATE usuarios SET nome = ?, email = ?, perfil = ? WHERE id = ?',
                [nome, email, perfil, id]
            );
        }
        
        res.json({ mensagem: 'Usuário atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar usuario:', error);
        res.status(500).json({ mensagem: 'Erro ao atualizar usuário' });
    }
}

async function deletarUsuarioAdmin(req, res) {
    try {
        const { id } = req.params;
        await db.execute('DELETE FROM usuarios WHERE id = ?', [id]);
        res.json({ mensagem: 'Usuário deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar usuario:', error);
        res.status(500).json({ mensagem: 'Erro ao deletar usuário' });
    }
}

module.exports = {
    getStats,
    listarEstabelecimentos,
    criarEstabelecimento,
    atualizarEstabelecimento,
    deletarEstabelecimento,
    listarUsuariosPorEstabelecimento,
    criarUsuarioAdmin,
    atualizarUsuarioAdmin,
    deletarUsuarioAdmin,
    listarTodosUsuarios 
};