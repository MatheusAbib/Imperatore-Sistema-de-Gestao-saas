import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
    FiPackage, FiDollarSign, FiTrendingUp, FiTrendingDown,
    FiBarChart2, FiInfo, FiPieChart, FiChevronLeft, FiChevronRight,
    FiHelpCircle, FiCheckCircle, FiAlertCircle, FiXCircle
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function AnaliseVendas() {
    const [dados, setDados] = useState(null);
    const [todosProdutos, setTodosProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tooltipAtivo, setTooltipAtivo] = useState(null);
    const [paginaSemVenda, setPaginaSemVenda] = useState(1);
    const itensPorPagina = 10;

useEffect(() => {
    carregarDados();
    carregarTodosProdutos();

    const handleReload = () => {
        carregarDados();
        carregarTodosProdutos();
    };

    window.addEventListener('reloadData', handleReload);
    return () => window.removeEventListener('reloadData', handleReload);
}, []);

    const carregarDados = async () => {
        try {
            const response = await api.get('/analise/vendas');
            setDados(response.data);
        } catch (error) {
            console.error('Erro ao carregar análise', error);
            toast.error('Erro ao carregar dados');
        } finally {
            setLoading(false);
        }
    };

    const carregarTodosProdutos = async () => {
        try {
            const response = await api.get('/produtos');
            setTodosProdutos(response.data);
        } catch (error) {
            console.error('Erro ao carregar produtos', error);
        }
    };

    const TooltipInfo = ({ id, texto }) => (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <FiHelpCircle 
                size={14} 
                color="var(--text-muted)" 
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setTooltipAtivo(id)}
                onMouseLeave={() => setTooltipAtivo(null)}
            />
            {tooltipAtivo === id && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: 'calc(100% + 10px)',
                    transform: 'translateY(-50%)',
                    backgroundColor: '#2c2c2c',
                    color: '#e8ddd8',
                    padding: '8px 12px',
                    borderRadius: 6,
                    fontSize: 11,
                    maxWidth: 220,
                    width: 'max-content',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    zIndex: 100,
                    textAlign: 'left',
                    lineHeight: 1.4
                }}>
                    {texto}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '-6px',
                        transform: 'translateY(-50%)',
                        border: '6px solid transparent',
                        borderRightColor: '#2c2c2c'
                    }} />
                </div>
            )}
        </div>
    );

    if (loading) {
        return (
            <div className="skeleton-container">
                <div className="page-header">
                    <div>
                        <h1>Analise de Vendas</h1>
                        <p className="text-muted">Veja quais produtos sao mais vendidos e lucrativos</p>
                    </div>
                </div>
                <div className="skeleton-grid status-grid">
                    <div className="skeleton-card"></div>
                    <div className="skeleton-card"></div>
                    <div className="skeleton-card"></div>
                    <div className="skeleton-card"></div>
                </div>
                <div className="skeleton-grid charts-grid">
                    <div className="skeleton-card skeleton-chart"></div>
                    <div className="skeleton-card skeleton-chart"></div>
                </div>
                <div className="skeleton-card skeleton-chart"></div>
                <div className="skeleton-table"></div>
            </div>
        );
    }

    if (!dados) {
        return (
            <div className="card" style={{ textAlign: 'center', padding: 60 }}>
                <FiPackage size={48} color="var(--text-muted)" />
                <h3>Nenhum dado de venda encontrado</h3>
                <p className="text-muted">Ainda nao ha pedidos registrados para analise.</p>
            </div>
        );
    }

    const { produtos, resumo } = dados;

    const cores = ['#b85a3a', '#b88b4a', '#6b8c4a', '#5a7a8c', '#d4a84a', '#8a6b8c', '#c4884a', '#b0a89c'];

    const dadosTabela = produtos.map(p => ({
        id: p.produto_id,
        nome: p.produto_nome,
        quantidade: parseFloat(p.total_vendido),
        faturamento: parseFloat(p.faturamento_total),
        custo_total: parseFloat(p.custo) * parseFloat(p.total_vendido),
        lucro: p.lucro_total,
        margem: p.margem,
        preco: p.preco_atual,
        custo_unitario: p.custo
    }));

    const produtosComMargem = dadosTabela.map(p => ({
        nome: p.nome,
        margem: parseFloat(p.margem) || 0,
        preco: parseFloat(p.preco) || 0,
        custo: parseFloat(p.custo_unitario) || 0
    }));

    const produtosAlerta = produtosComMargem.filter(p => p.margem < 40);

    const idsComVenda = new Set(dadosTabela.map(p => p.id));
    const produtosSemVenda = todosProdutos
        .filter(p => !idsComVenda.has(p.id))
        .map(p => ({
            id: p.id,
            nome: p.nome,
            preco: parseFloat(p.preco_venda),
            custo: parseFloat(p.custo) || 0,
            categoria: p.categoria || '-'
        }));

    const totalSemVenda = produtosSemVenda.length;
    const produtosSemVendaPaginados = produtosSemVenda.slice(
        (paginaSemVenda - 1) * itensPorPagina,
        paginaSemVenda * itensPorPagina
    );
    const totalPaginasSemVenda = Math.ceil(totalSemVenda / itensPorPagina);

    const dadosVendidos = produtos.map(p => ({
        nome: p.produto_nome,
        quantidade: parseFloat(p.total_vendido),
        faturamento: parseFloat(p.faturamento_total)
    }));

    const dadosLucro = produtos.map(p => ({
        nome: p.produto_nome,
        lucro: p.lucro_total,
        margem: p.margem,
        vendido: parseFloat(p.total_vendido),
        faturamento: parseFloat(p.faturamento_total)
    }));

    const Paginacao = ({ pagina, setPagina, totalPaginas }) => {
        if (totalPaginas <= 1) return null;
        return (
            <div className="pagination">
                <button
                    className="btn btn-secondary"
                    onClick={() => setPagina(p => Math.max(1, p - 1))}
                    disabled={pagina <= 1}
                >
                    <FiChevronLeft size={16} />
                </button>
                <span>Página {pagina} de {totalPaginas}</span>
                <button
                    className="btn btn-secondary"
                    onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
                    disabled={pagina >= totalPaginas}
                >
                    <FiChevronRight size={16} />
                </button>
            </div>
        );
    };

    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1>Analise de Vendas</h1>
                    <p className="text-muted">Veja quais produtos sao mais vendidos e lucrativos</p>
                </div>
            </div>

            <div className="status-grid" style={{ marginBottom: 20 }}>
                <div className="card status-card" style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
                        <TooltipInfo id="fat" texto="Soma de todo o dinheiro que entrou com as vendas de todos os produtos." />
                    </div>
                    <div className="status-card-icon" style={{ backgroundColor: '#b85a3a22', color: '#b85a3a' }}>
                        <FiDollarSign size={24} />
                    </div>
                    <div className="status-card-content">
                        <span className="status-card-value">R$ {resumo.faturamento_geral.toFixed(2).replace('.', ',')}</span>
                        <span className="status-card-title">Faturamento Total</span>
                    </div>
                </div>

                <div className="card status-card" style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
                        <TooltipInfo id="luc" texto="'Lucro Total = Faturamento Total - Custo Total' de todos os produtos vendidos. Mostra quanto realmente sobrou para o negocio depois de pagar todos os custos." />
                    </div>
                    <div className="status-card-icon" style={{ backgroundColor: '#6b8c4a22', color: '#6b8c4a' }}>
                        <FiTrendingUp size={24} />
                    </div>
                    <div className="status-card-content">
                        <span className="status-card-value">R$ {resumo.lucro_geral.toFixed(2).replace('.', ',')}</span>
                        <span className="status-card-title">Lucro Total</span>
                    </div>
                </div>

                <div className="card status-card" style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
                        <TooltipInfo id="margem" texto="Porcentagem de lucro sobre o faturamento total. Quanto maior, mais saudavel e o negocio. Ideal: acima de 50%." />
                    </div>
                    <div className="status-card-icon" style={{ backgroundColor: resumo.margem_geral >= 50 ? '#6b8c4a22' : '#d4a84a22', color: resumo.margem_geral >= 50 ? '#6b8c4a' : '#d4a84a' }}>
                        <FiBarChart2 size={24} />
                    </div>
                    <div className="status-card-content">
                        <span className="status-card-value">{resumo.margem_geral.toFixed(1)}%</span>
                        <span className="status-card-title">Margem Geral</span>
                        <span className="status-card-subtitle">{resumo.margem_geral >= 50 ? 'Saudavel' : resumo.margem_geral >= 30 ? 'Atencao' : 'Critica'}</span>
                    </div>
                </div>

                <div className="card status-card" style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
                        <TooltipInfo id="prod" texto="Quantos produtos diferentes tiveram pelo menos uma venda registrada no periodo." />
                    </div>
                    <div className="status-card-icon" style={{ backgroundColor: '#5a7a8c22', color: '#5a7a8c' }}>
                        <FiPackage size={24} />
                    </div>
                    <div className="status-card-content">
                        <span className="status-card-value">{resumo.total_produtos}</span>
                        <span className="status-card-title">Total Produtos</span>
                        <span className="status-card-subtitle">{resumo.produtos_com_venda || resumo.total_produtos} com venda</span>
                    </div>
                </div>
            </div>

            {produtosAlerta.length > 0 && (
                <div className="card alerta-margem">
                    <div className="alerta-margem-header">
                        <div className="alerta-margem-titulo">
                            <FiAlertCircle size={20} color="#b85a4a" />
                            <h3>Produtos com Margem Baixa</h3>
                            <span className="alerta-margem-badge">{produtosAlerta.length}</span>
                            <TooltipInfo 
                                id="alerta-margem"
                                texto="Produtos com margem abaixo de 40%. Recomenda-se revisar o preço de venda ou reduzir custos para aumentar a rentabilidade."
                            />
                        </div>
                    </div>
                    <div className="alerta-margem-grid">
                        {produtosAlerta.slice(0, 6).map((p, idx) => (
                            <div key={idx} className="alerta-margem-item">
                                <div className="alerta-margem-item-info">
                                    <span className="alerta-margem-item-nome">{p.nome}</span>
                                    <span className="alerta-margem-item-margem" style={{ color: '#b85a4a' }}>
                                        {p.margem.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="alerta-margem-bar">
                                    <div 
                                        className="alerta-margem-bar-fill" 
                                        style={{ width: `${Math.min(p.margem, 40)}%`, backgroundColor: '#b85a4a' }}
                                    />
                                </div>
                                <div className="alerta-margem-item-precos">
                                    <span>Preço: R$ {p.preco.toFixed(2)}</span>
                                    <span>Custo: R$ {p.custo.toFixed(2)}</span>
                                    <span style={{ color: '#b85a4a', fontWeight: 'bold' }}>
                                        Lucro: R$ {(parseFloat(p.preco) - parseFloat(p.custo)).toFixed(2).replace('.', ',')}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {produtosAlerta.length > 6 && (
                            <div className="alerta-margem-mais">
                                + {produtosAlerta.length - 6} produtos com margem baixa
                            </div>
                        )}
                    </div>
                    <div className="alerta-margem-footer">
                        <FiInfo size={14} color="#b0a89c" />
                        <span>Produtos com margem abaixo de 40% precisam de atenção. Considere ajustar preços ou reduzir custos.</span>
                    </div>
                </div>
            )}

            <div className="analise-grid">
                <div className="card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiBarChart2 size={18} />
                        Mais Vendidos
                        <TooltipInfo id="vendas" texto="Produtos com maior quantidade de unidades vendidas. Mostra quais produtos saem mais e sao mais populares entre os clientes." />
                    </h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={dadosVendidos} layout="vertical" margin={{ right: 20, top: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" />
                            <YAxis 
                                dataKey="nome" 
                                type="category" 
                                width={100}
                                tick={{ fontSize: 11, fill: 'var(--text-color)' }}
                                interval={0}
                            />
                            <Tooltip formatter={(value) => `${value} unidades`} />
                            <Bar dataKey="quantidade" fill="#b85a3a" barSize={18}>
                                {dadosVendidos.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiDollarSign size={18} />
                        Mais Lucrativos
                        <TooltipInfo id="lucro" texto="Produtos que geram mais lucro total (quantidade vendida x lucro por unidade). Mostra quais produtos trazem mais dinheiro para o negocio." />
                    </h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={dadosLucro} layout="vertical" margin={{ right: 20, top: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" />
                            <YAxis 
                                dataKey="nome" 
                                type="category" 
                                width={100}
                                tick={{ fontSize: 11, fill: 'var(--text-color)' }}
                                interval={0}
                            />
                            <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
                            <Bar dataKey="lucro" fill="#6b8c4a" barSize={18}>
                                {dadosLucro.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

<div className="card">
    <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <FiPieChart size={18} />
        Distribuição do Faturamento
        <TooltipInfo id="faturamento" texto="Participacao de cada produto no faturamento total. Mostra quais produtos sao responsaveis pela maior parte da receita do negocio." />
    </h3>
    <div className="pie-chart-container">
        <div className="pie-chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={dadosVendidos}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={90}
                        fill="#8884d8"
                        dataKey="faturamento"
                        isAnimationActive={false}
                        nameKey="nome"
                    >
                        {dadosVendidos.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />
                        ))}
                    </Pie>
                    <Tooltip 
                        formatter={(value, name, props) => {
                            return [`R$ ${value.toFixed(2)}`, props.payload.nome];
                        }}
                        labelFormatter={(label, payload) => {
                            if (payload && payload.length > 0) {
                                return payload[0].payload.nome;
                            }
                            return label;
                        }}
                        contentStyle={{
                            backgroundColor: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 6,
                            padding: '8px 12px'
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
        <div className="pie-legend-wrapper">
            <h4 style={{ fontSize: 13, marginBottom: 8, color: 'var(--text-secondary)' }}>
                Produtos ({dadosVendidos.length})
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {dadosVendidos
                    .sort((a, b) => b.faturamento - a.faturamento)
                    .map((item, index) => {
                        const percent = (item.faturamento / dadosVendidos.reduce((sum, i) => sum + i.faturamento, 0)) * 100;
                        return (
                            <div 
                                key={index} 
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 8,
                                    padding: '4px 8px',
                                    borderRadius: 4,
                                    fontSize: 12,
                                    backgroundColor: index % 2 === 0 ? 'var(--bg-hover)' : 'transparent'
                                }}
                            >
                                <span style={{ 
                                    display: 'inline-block', 
                                    width: 12, 
                                    height: 12, 
                                    borderRadius: 3, 
                                    backgroundColor: cores[index % cores.length],
                                    flexShrink: 0
                                }} />
                                <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {item.nome}
                                </span>
                                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                    {percent.toFixed(1)}%
                                </span>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    </div>
    {dadosVendidos.length > 8 && (
        <p className="text-muted" style={{ textAlign: 'center', fontSize: 11, marginTop: 8 }}>
            * Apenas produtos com mais de 5% aparecem no rótulo. Todos aparecem na legenda.
        </p>
    )}
</div>

            <div className="card">
                <h3>Detalhamento por Produto</h3>
                
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Quantidade Vendida</th>
                                <th>Venda Total</th>
                                <th>Custo Total</th>
                                <th>Lucro Total</th>
                                <th>Margem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dadosTabela.map((p, index) => {
                                const margemClass = p.margem >= 60 ? 'text-success' : p.margem >= 40 ? 'text-warning' : 'text-danger';
                                return (
                                    <tr key={index}>
                                        <td>{p.nome}</td>
                                        <td>{p.quantidade} unidades</td>
                                        <td>R$ {p.faturamento.toFixed(2).replace('.', ',')}</td>
                                        <td>R$ {p.custo_total.toFixed(2).replace('.', ',')}</td>
                                        <td>R$ {p.lucro.toFixed(2).replace('.', ',')}</td>
                                        <td className={margemClass}>{p.margem.toFixed(1)}%</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {totalSemVenda > 0 && (
                <div className="card" style={{ border: '1px solid #d4a84a' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#d4a84a' }}>
                        <FiXCircle size={18} />
                        Produtos sem Venda
                        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)' }}>
                            {totalSemVenda} produtos
                        </span>
                    </h3>
                    <p className="text-muted" style={{ marginBottom: 16 }}>
                        Estes produtos estao cadastrados mas nao tiveram nenhuma venda registrada.
                    </p>
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Produto</th>
                                    <th>Categoria</th>
                                    <th>Preço de Venda</th>
                                    <th>Custo Unitário</th>
                                    <th>Margem</th>
                                </tr>
                            </thead>
                            <tbody>
                                {produtosSemVendaPaginados.map((p) => {
                                    const margem = p.preco > 0 ? ((p.preco - p.custo) / p.preco * 100) : 0;
                                    const margemClass = margem >= 60 ? 'text-success' : margem >= 40 ? 'text-warning' : 'text-danger';
                                    return (
                                        <tr key={p.id}>
                                            <td>{p.nome}</td>
                                            <td>{p.categoria}</td>
                                            <td>R$ {p.preco.toFixed(2).replace('.', ',')}</td>
                                            <td>R$ {p.custo.toFixed(2).replace('.', ',')}</td>
                                            <td className={margemClass}>{margem.toFixed(1)}%</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <Paginacao pagina={paginaSemVenda} setPagina={setPaginaSemVenda} totalPaginas={totalPaginasSemVenda} />
                </div>
            )}
        </div>
    );
}

export default AnaliseVendas;