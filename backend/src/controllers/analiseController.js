const db = require('../config/database');
const Produto = require('../models/Produto');

async function getAnaliseVendas(req, res) {
    try {
        const usuario_id = req.usuarioId;
        
        const [usuario] = await db.execute(
            'SELECT estabelecimento_id FROM usuarios WHERE id = ?',
            [usuario_id]
        );
        
        const estabelecimento_id = usuario[0]?.estabelecimento_id;
        
        if (!estabelecimento_id) {
            return res.status(400).json({ mensagem: 'Usuário sem estabelecimento associado' });
        }

        const [pedidos] = await db.execute(
            `SELECT 
                p.id as pedido_id,
                p.produto_id,
                pr.nome as produto_nome,
                pr.preco_venda as preco_atual,
                p.preco_unitario as preco_vendido,
                p.quantidade as quantidade,
                p.status
             FROM pedidos p
             JOIN produtos pr ON p.produto_id = pr.id
             WHERE pr.estabelecimento_id = ?
             ORDER BY p.created_at DESC`,
            [estabelecimento_id]
        );

        const produtosMap = new Map();

        pedidos.forEach(item => {
            const produtoId = item.produto_id;
            if (!produtosMap.has(produtoId)) {
                produtosMap.set(produtoId, {
                    produto_id: produtoId,
                    produto_nome: item.produto_nome,
                    preco_atual: parseFloat(item.preco_atual) || 0,
                    quantidade_total: 0,
                    faturamento_total: 0
                });
            }

            const produto = produtosMap.get(produtoId);
            const qtd = parseFloat(item.quantidade) || 0;
            const precoVendido = parseFloat(item.preco_vendido) || 0;
            
            produto.quantidade_total += qtd;
            produto.faturamento_total += qtd * precoVendido;
        });

        const produtosComCusto = await Promise.all(Array.from(produtosMap.values()).map(async (item) => {
            const custo = await Produto.calcularCusto(item.produto_id, estabelecimento_id);
            const preco = parseFloat(item.preco_atual);
            const quantidade = parseFloat(item.quantidade_total);
            const faturamento_total = parseFloat(item.faturamento_total);
            const lucro_total = faturamento_total - (custo * quantidade);
            const margem = faturamento_total > 0 ? (lucro_total / faturamento_total) * 100 : 0;
            
            return {
                produto_id: item.produto_id,
                produto_nome: item.produto_nome,
                preco_atual: preco,
                total_vendido: quantidade,
                faturamento_total: faturamento_total,
                custo: custo,
                lucro_total: lucro_total,
                margem: margem
            };
        }));

        const produtosOrdenados = produtosComCusto.sort((a, b) => b.total_vendido - a.total_vendido);

        const faturamento_geral = produtosOrdenados.reduce((sum, p) => sum + p.faturamento_total, 0);
        const lucro_geral = produtosOrdenados.reduce((sum, p) => sum + p.lucro_total, 0);
        const margem_geral = faturamento_geral > 0 ? (lucro_geral / faturamento_geral) * 100 : 0;

        res.json({
            produtos: produtosOrdenados,
            resumo: {
                total_produtos: produtosOrdenados.length,
                faturamento_geral: faturamento_geral,
                lucro_geral: lucro_geral,
                margem_geral: margem_geral
            }
        });
    } catch (error) {
        console.error('Erro ao buscar análise de vendas:', error);
        res.status(500).json({ mensagem: 'Erro ao buscar análise de vendas', erro: error.message });
    }
}

module.exports = { getAnaliseVendas };