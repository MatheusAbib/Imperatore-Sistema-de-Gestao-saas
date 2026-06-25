const db = require('../config/database');
const { logAction } = require('../utils/logHelper');

async function getStats(req, res) {
    try {
        const [estabelecimentos] = await db.execute('SELECT COUNT(*) as total FROM estabelecimentos');
        const [usuarios] = await db.execute('SELECT COUNT(*) as total FROM usuarios');
        const [produtos] = await db.execute('SELECT COUNT(*) as total FROM produtos');
        const [pedidos] = await db.execute('SELECT COUNT(*) as total FROM pedidos');
        const [faturamento] = await db.execute('SELECT SUM(preco_unitario * quantidade) as total FROM pedidos');
        const [lotesVencidos] = await db.execute(
            'SELECT COUNT(*) as total FROM lotes WHERE data_validade < CURDATE() AND quantidade > 0'
        );
        const [mediaProdutos] = await db.execute(
            'SELECT AVG(total) as media FROM (SELECT COUNT(*) as total FROM produtos GROUP BY estabelecimento_id) as sub'
        );

        res.json({
            totalEstabelecimentos: estabelecimentos[0].total || 0,
            totalUsuarios: usuarios[0].total || 0,
            totalProdutos: produtos[0].total || 0,
            totalPedidos: pedidos[0].total || 0,
            totalFaturamento: parseFloat(faturamento[0].total) || 0,
            totalLotesVencidos: lotesVencidos[0].total || 0,
            mediaProdutosPorEstabelecimento: parseFloat(mediaProdutos[0].media)?.toFixed(1) || 0
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
        const { 
            nome, cnpj, plano, status, 
            endereco, numero, telefone, 
            cpf_dono, nome_dono, data_abertura, observacoes,
            cep, estado
        } = req.body;
        
        const [result] = await db.execute(
            `INSERT INTO estabelecimentos 
            (nome, cnpj, plano, status, endereco, numero, telefone, cpf_dono, nome_dono, data_abertura, observacoes, cep, estado) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nome, cnpj || null, plano || 'gratis', status || 'ativo', 
             endereco || null, numero || null, telefone || null, 
             cpf_dono || null, nome_dono || null, data_abertura || null, observacoes || null,
             cep || null, estado || null]
        );

        await logAction(req.usuarioId, result.insertId, 'Admin', 'Criou Estabelecimento', `Criou estabelecimento "${nome}" (ID: ${result.insertId})`, req.ip);

        res.status(201).json({ id: result.insertId, mensagem: 'Estabelecimento criado com sucesso' });
    } catch (error) {
        console.error('Erro ao criar estabelecimento:', error);
        res.status(500).json({ mensagem: 'Erro ao criar estabelecimento' });
    }
}

async function listarUltimosEstabelecimentos(req, res) {
    try {
        const [rows] = await db.execute(
            'SELECT id, nome, cnpj, plano, created_at FROM estabelecimentos ORDER BY created_at DESC LIMIT 5'
        );
        res.json(rows);
    } catch (error) {
        console.error('Erro ao listar ultimos estabelecimentos:', error);
        res.status(500).json({ mensagem: 'Erro ao listar últimos estabelecimentos' });
    }
}

async function getCrescimentoMensal(req, res) {
    try {
        const [rows] = await db.execute(
            `SELECT 
                DATE_FORMAT(created_at, '%b/%Y') as mes,
                COUNT(*) as total
             FROM estabelecimentos
             WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
             GROUP BY DATE_FORMAT(created_at, '%b/%Y')
             ORDER BY MIN(created_at) ASC`
        );
        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar crescimento mensal:', error);
        res.status(500).json({ mensagem: 'Erro ao buscar crescimento mensal' });
    }
}

async function getDistribuicaoPlanos(req, res) {
    try {
        const [rows] = await db.execute(
            `SELECT 
                plano as name,
                COUNT(*) as value
             FROM estabelecimentos
             GROUP BY plano`
        );
        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar distribuição de planos:', error);
        res.status(500).json({ mensagem: 'Erro ao buscar distribuição de planos' });
    }
}

async function getTopProdutos(req, res) {
    try {
        const [rows] = await db.execute(
            `SELECT p.id, p.nome, COUNT(pe.id) as total
             FROM produtos p
             JOIN pedidos pe ON p.id = pe.produto_id
             GROUP BY p.id
             ORDER BY total DESC
             LIMIT 5`
        );
        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar top produtos:', error);
        res.status(500).json({ mensagem: 'Erro ao buscar top produtos' });
    }
}

async function getTopEstabelecimentos(req, res) {
    try {
        const [rows] = await db.execute(
            `SELECT e.id, e.nome, COALESCE(SUM(pe.preco_unitario * pe.quantidade), 0) as faturamento
             FROM estabelecimentos e
             LEFT JOIN comandas c ON e.id = c.estabelecimento_id
             LEFT JOIN pedidos pe ON c.id = pe.comanda_id
             GROUP BY e.id
             ORDER BY faturamento DESC
             LIMIT 5`
        );
        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar top estabelecimentos:', error);
        res.status(500).json({ mensagem: 'Erro ao buscar top estabelecimentos' });
    }
}

async function getDistribuicaoPerfis(req, res) {
    try {
        const [rows] = await db.execute(
            `SELECT perfil as name, COUNT(*) as value
             FROM usuarios
             GROUP BY perfil`
        );
        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar distribuição de perfis:', error);
        res.status(500).json({ mensagem: 'Erro ao buscar distribuição de perfis' });
    }
}

async function atualizarEstabelecimento(req, res) {
    try {
        const { id } = req.params;
        
        const { 
            nome, cnpj, plano, status, 
            endereco, numero, telefone, 
            cpf_dono, nome_dono, data_abertura, observacoes,
            cep, estado
        } = req.body;
        
        await db.execute(
            `UPDATE estabelecimentos SET 
                nome = ?, cnpj = ?, plano = ?, status = ?,
                endereco = ?, numero = ?, telefone = ?, 
                cpf_dono = ?, nome_dono = ?, data_abertura = ?, observacoes = ?,
                cep = ?, estado = ?
            WHERE id = ?`,
            [
                nome, 
                cnpj || null, 
                plano || 'gratis', 
                status || 'ativo',
                endereco || null, 
                numero || null, 
                telefone || null,
                cpf_dono || null, 
                nome_dono || null, 
                data_abertura || null, 
                observacoes || null,
                cep || null,
                estado || null,
                id
            ]
        );

        await logAction(req.usuarioId, id, 'Admin', 'Editou Estabelecimento', `Editou estabelecimento "${nome}" (ID: ${id})`, req.ip);

        res.json({ mensagem: 'Estabelecimento atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar estabelecimento:', error);
        res.status(500).json({ mensagem: 'Erro ao atualizar estabelecimento', error: error.message });
    }
}

async function deletarEstabelecimento(req, res) {
    try {
        const { id } = req.params;
        const nome = req.body.nome || id;
        
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

        await logAction(req.usuarioId, id, 'Admin', 'Deletou Estabelecimento', `Deletou estabelecimento "${nome}" (ID: ${id})`, req.ip);

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

        await logAction(req.usuarioId, estabelecimento_id, 'Admin', 'Criou Usuário', `Criou usuário "${nome}" (${email})`, req.ip);

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

        await logAction(req.usuarioId, null, 'Admin', 'Editou Usuário', `Editou usuário "${nome}" (ID: ${id}, Email: ${email})`, req.ip);

        res.json({ mensagem: 'Usuário atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar usuario:', error);
        res.status(500).json({ mensagem: 'Erro ao atualizar usuário' });
    }
}

async function deletarUsuarioAdmin(req, res) {
    try {
        const { id } = req.params;
        const nome = req.body.nome || id;
        
        await db.execute('DELETE FROM usuarios WHERE id = ?', [id]);

        await logAction(req.usuarioId, null, 'Admin', 'Deletou Usuário', `Deletou usuário "${nome}" (ID: ${id})`, req.ip);

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
    listarTodosUsuarios,
    listarUltimosEstabelecimentos,
    getCrescimentoMensal,
    getDistribuicaoPlanos,
    getTopProdutos,
    getTopEstabelecimentos,
    getDistribuicaoPerfis
};