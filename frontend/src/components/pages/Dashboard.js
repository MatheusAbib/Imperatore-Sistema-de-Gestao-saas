import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, 
    CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line,
    AreaChart, Area, Legend
} from 'recharts';
import api from '../../services/api';
import { 
    FiPackage, FiTrendingUp, FiTrendingDown, FiAlertCircle, 
    FiCheckCircle, FiClock, FiCalendar, FiDollarSign, FiBarChart2,
    FiChevronLeft, FiChevronRight, FiInfo, FiHome, FiUsers, FiServer,
    FiBox, FiHelpCircle
} from 'react-icons/fi';
import Produtos from './Produtos';
import Ingredientes from './Ingredientes';
import Lotes from './Lotes';
import Relatorios from './Relatorios';
import Usuarios from './Usuarios';
import Atendente from './Atendente';
import Cozinha from './Cozinha';
import Cardapio from './Cardapio';
import Configuracoes from './Configuracoes';
import Header from '../layout/Header';
import Estabelecimentos from './Estabelecimentos';
import Admin from './Admin';
import UsuariosAdmin from './UsuariosAdmin';
import Sobre from './Sobre';
import Logs from './Logs';

function Dashboard() {
    const [produtos, setProdutos] = useState([]);
    const [ingredientes, setIngredientes] = useState([]);
    const [lotes, setLotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagina, setPagina] = useState('dashboard');
    const { usuario } = useAuth();
    const [resumoValidade, setResumoValidade] = useState({
        vencidos: 0,
        venceHoje: 0,
        venceAte7Dias: 0,
        bons: 0
    });
    const [paginaProdutos, setPaginaProdutos] = useState(1);
    const [tooltipAtivo, setTooltipAtivo] = useState(null);
    const itensPorPagina = 6;

    const isAdmin = usuario?.perfil === 'admin';
    const isDono = usuario?.perfil === 'dono';
    const isGerente = usuario?.perfil === 'gerente';
    const isDonoOuGerente = isDono || isGerente;

    useEffect(() => {
        if (isAdmin) {
            setPagina('admin');
        } else if (isDonoOuGerente) {
            carregarDados();
            carregarResumoValidade();
            carregarIngredientes();
            carregarLotes();
        } else if (usuario?.perfil === 'atendente') {
            setPagina('comandas');
        } else if (usuario?.perfil === 'cozinha') {
            setPagina('cozinha');
        }
    }, [usuario]);

    const carregarDados = async () => {
        try {
            const response = await api.get('/produtos');
            setProdutos(response.data);
        } catch (error) {
            console.error('Erro ao carregar dados', error);
        } finally {
            setLoading(false);
        }
    };

    const carregarIngredientes = async () => {
        try {
            const response = await api.get('/ingredientes');
            setIngredientes(response.data);
        } catch (error) {
            console.error('Erro ao carregar ingredientes', error);
        }
    };

    const carregarLotes = async () => {
        try {
            const response = await api.get('/lotes');
            setLotes(response.data);
        } catch (error) {
            console.error('Erro ao carregar lotes', error);
        }
    };

    const carregarResumoValidade = async () => {
        try {
            const response = await api.get('/lotes');
            const lotes = response.data || [];
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);

            let vencidos = 0;
            let venceHoje = 0;
            let venceAte7Dias = 0;
            let total = 0;

            lotes.forEach(l => {
                const quantidade = parseFloat(l.quantidade) || 0;
                total += quantidade;

                const dataValidade = new Date(l.data_validade);
                dataValidade.setHours(0, 0, 0, 0);
                const diffDays = Math.ceil((dataValidade - hoje) / (1000 * 60 * 60 * 24));

                if (diffDays < 0) {
                    vencidos += quantidade;
                } else if (diffDays === 0) {
                    venceHoje += quantidade;
                } else if (diffDays <= 7) {
                    venceAte7Dias += quantidade;
                }
            });

            setResumoValidade({
                vencidos: vencidos || 0,
                venceHoje: venceHoje || 0,
                venceAte7Dias: venceAte7Dias || 0,
                bons: (total - vencidos - venceHoje - venceAte7Dias) || 0
            });
        } catch (error) {
            console.error('Erro ao carregar resumo de validade', error);
            setResumoValidade({
                vencidos: 0,
                venceHoje: 0,
                venceAte7Dias: 0,
                bons: 0
            });
        }
    };

    const produtosComMargem = produtos.map(p => ({
        nome: p.nome,
        margem: parseFloat(p.margem),
        preco: parseFloat(p.preco_venda),
        custo: parseFloat(p.custo)
    }));

    const produtosAlerta = produtosComMargem.filter(p => p.margem < 40);
    const produtosOk = produtosComMargem.filter(p => p.margem >= 40 && p.margem < 60);
    const produtosExcelente = produtosComMargem.filter(p => p.margem >= 60);

    const dadosGraficoMargem = [
        { name: 'Crítico', value: produtosAlerta.length, color: '#b85a4a' },
        { name: 'Atenção', value: produtosOk.length, color: '#d4a84a' },
        { name: 'Excelente', value: produtosExcelente.length, color: '#6b8c4a' }
    ].filter(item => item.value > 0);

    const dadosBarra = produtosComMargem
        .sort((a, b) => b.margem - a.margem)
        .slice(0, 10)
        .map(p => ({
            nome: p.nome.length > 12 ? p.nome.substring(0, 10) + '...' : p.nome,
            margem: p.margem
        }));

    const dadosLucro = produtosComMargem
        .sort((a, b) => (b.preco - b.custo) - (a.preco - a.custo))
        .slice(0, 8)
        .map(p => ({
            nome: p.nome.length > 12 ? p.nome.substring(0, 10) + '...' : p.nome,
            lucro: (p.preco - p.custo)
        }));

    const totalProdutos = produtos.length;
    const produtosPaginados = produtos.slice(
        (paginaProdutos - 1) * itensPorPagina,
        paginaProdutos * itensPorPagina
    );
    const totalPaginas = Math.ceil(totalProdutos / itensPorPagina);

    const Paginacao = () => {
        if (totalPaginas <= 1) return null;
        return (
            <div className="pagination">
                <button
                    className="btn btn-secondary"
                    onClick={() => setPaginaProdutos(p => Math.max(1, p - 1))}
                    disabled={paginaProdutos <= 1}
                >
                    <FiChevronLeft size={16} />
                </button>
                <span>Página {paginaProdutos} de {totalPaginas}</span>
                <button
                    className="btn btn-secondary"
                    onClick={() => setPaginaProdutos(p => Math.min(totalPaginas, p + 1))}
                    disabled={paginaProdutos >= totalPaginas}
                >
                    <FiChevronRight size={16} />
                </button>
            </div>
        );
    };

    const StatusCard = ({ icon: Icon, title, value, color, subtitle }) => (
        <div className="card status-card">
            <div className="status-card-icon" style={{ backgroundColor: color + '22', color }}>
                <Icon size={24} />
            </div>
            <div className="status-card-content">
                <span className="status-card-value">{value}</span>
                <span className="status-card-title">{title}</span>
                {subtitle && <span className="status-card-subtitle">{subtitle}</span>}
            </div>
        </div>
    );

    const TooltipInfo = ({ id, texto }) => (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <FiHelpCircle 
                size={16} 
                color="var(--text-muted)" 
                style={{ cursor: 'pointer', marginLeft: 6 }}
                onMouseEnter={() => setTooltipAtivo(id)}
                onMouseLeave={() => setTooltipAtivo(null)}
            />
            {tooltipAtivo === id && (
                <div style={{
                    position: 'absolute',
                    bottom: 'calc(100% + 10px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#2c2c2c',
                    color: '#e8ddd8',
                    padding: '10px 14px',
                    borderRadius: 8,
                    fontSize: 12,
                    maxWidth: 280,
                    width: 'max-content',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    zIndex: 100,
                    textAlign: 'center',
                    fontWeight: 'normal',
                    lineHeight: 1.5
                }}>
                    {texto}
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        border: '6px solid transparent',
                        borderTopColor: '#2c2c2c'
                    }} />
                </div>
            )}
        </div>
    );

    return (
        <div className="container">
            <Header setPagina={setPagina} paginaAtual={pagina} />

            {isAdmin && (
                <>
                    {pagina === 'admin' && <Admin />}
                    {pagina === 'estabelecimentos' && <Estabelecimentos />}
                    {pagina === 'usuarios' && <UsuariosAdmin />}
                    {pagina === 'configuracoes' && <Configuracoes />}
                    {pagina === 'sobre' && <Sobre />}
                    {pagina === 'logs' && <Logs />}
                </>
            )}
            
            {isDonoOuGerente && (
                <>
                    {pagina === 'dashboard' && (
                        <>
                            {loading ? (
                                <div className="loading-state">Carregando dados...</div>
                            ) : (
                                <>
                                    <div className="status-grid">
                                        <StatusCard
                                            icon={FiPackage}
                                            title="Produtos"
                                            value={totalProdutos}
                                            color="#b85a3a"
                                            subtitle="Total cadastrados"
                                        />
                                        <StatusCard
                                            icon={FiTrendingUp}
                                            title="Margem Média"
                                            value={produtosComMargem.length > 0 ? 
                                                (produtosComMargem.reduce((sum, p) => sum + p.margem, 0) / produtosComMargem.length).toFixed(1) + '%' : 
                                                '0%'}
                                            color="#6b8c4a"
                                            subtitle="Média geral"
                                        />
                                        <StatusCard
                                            icon={FiDollarSign}
                                            title="Lucro Total"
                                            value={'R$ ' + (produtosComMargem.reduce((sum, p) => sum + (p.preco - p.custo), 0)).toFixed(2).replace('.', ',')}
                                            color="#d4a84a"
                                            subtitle="Soma de todos os lucros"
                                        />
                                        <StatusCard
                                            icon={FiAlertCircle}
                                            title="Em Alerta"
                                            value={produtosAlerta.length}
                                            color="#b85a4a"
                                            subtitle="Margem < 40%"
                                        />
                                        <StatusCard
                                            icon={FiCheckCircle}
                                            title="Excelentes"
                                            value={produtosExcelente.length}
                                            color="#6b8c4a"
                                            subtitle="Margem > 60%"
                                        />
                                    </div>

                                    {produtosAlerta.length > 0 && (
                                        <div className="card card-warning">
                                            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <FiAlertCircle size={20} />
                                                Produtos com Margem Baixa
                                            </h3>
                                            <ul style={{ marginBottom: 0 }}>
                                                {produtosAlerta.slice(0, 5).map((p, idx) => (
                                                    <li key={idx}>
                                                        <strong>{p.nome}</strong> - Margem: {p.margem.toFixed(2)}%
                                                        <span className="text-danger"> (Abaixo do ideal)</span>
                                                    </li>
                                                ))}
                                                {produtosAlerta.length > 5 && (
                                                    <li className="text-muted">... e mais {produtosAlerta.length - 5} produtos</li>
                                                )}
                                            </ul>
                                        </div>
                                    )}

                                    <div className="charts-grid">
                                        <div className="card">
                                            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <FiBarChart2 size={18} />
                                                Distribuição de Margens
                                                <TooltipInfo 
                                                    id="graf1" 
                                                    texto="Mostra quantos produtos estão em cada faixa de margem: Crítico (<40%), Atenção (40-60%) e Excelente (>60%). Quanto mais produtos na faixa Excelente, melhor para o negócio."
                                                />
                                            </h3>
                                            <ResponsiveContainer width="100%" height={280}>
                                                <PieChart>
                                                    <Pie
                                                        data={dadosGraficoMargem}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={true}
                                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                        outerRadius={80}
                                                        fill="#8884d8"
                                                        dataKey="value"
                                                    >
                                                        {dadosGraficoMargem.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>

                                        <div className="card">
                                            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <FiTrendingUp size={18} />
                                                Top 10 Margens
                                                <TooltipInfo 
                                                    id="graf2" 
                                                    texto="Ranking dos produtos com as maiores margens de lucro. Quanto maior a barra, mais rentável é o produto. Use esta lista para identificar seus produtos mais lucrativos."
                                                />
                                            </h3>
                                            <ResponsiveContainer width="100%" height={280}>
                                                <BarChart data={dadosBarra} layout="vertical">
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis type="number" domain={[0, 100]} />
                                                    <YAxis dataKey="nome" type="category" width={80} />
                                                    <Tooltip />
                                                    <Bar dataKey="margem" fill="#b88b4a">
                                                        {dadosBarra.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.margem >= 60 ? '#6b8c4a' : (entry.margem >= 40 ? '#d4a84a' : '#b85a4a')} />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <div className="card">
                                        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <FiDollarSign size={18} />
                                            Lucro por Unidade
                                            <TooltipInfo 
                                                id="graf3" 
                                                texto="Mostra quanto de lucro (em R$) cada produto gera por unidade vendida. Quanto maior a barra, mais dinheiro o produto traz para o negócio."
                                            />
                                        </h3>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <BarChart data={dadosLucro}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="nome" />
                                                <YAxis />
                                                <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
                                                <Bar dataKey="lucro" fill="#6b8c4a" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>

                                    <div className="validity-grid">
                                        <div className="card card-danger">
                                            <FiAlertCircle size={24} style={{ marginBottom: 8 }} />
                                            <h3>Vencidos</h3>
                                            <p className="stats-number">{resumoValidade.vencidos || 0}</p>
                                            <small>Produtos vencidos</small>
                                        </div>
                                        <div className="card card-warning">
                                            <FiClock size={24} style={{ marginBottom: 8 }} />
                                            <h3>Vence Hoje</h3>
                                            <p className="stats-number">{resumoValidade.venceHoje || 0}</p>
                                            <small>Vencem hoje</small>
                                        </div>
                                        <div className="card card-orange">
                                            <FiCalendar size={24} style={{ marginBottom: 8 }} />
                                            <h3>7 Dias</h3>
                                            <p className="stats-number">{resumoValidade.venceAte7Dias || 0}</p>
                                            <small>Vencem em até 7 dias</small>
                                        </div>
                                        <div className="card card-success">
                                            <FiCheckCircle size={24} style={{ marginBottom: 8 }} />
                                            <h3>Bons</h3>
                                            <p className="stats-number">{resumoValidade.bons || 0}</p>
                                            <small>Dentro da validade</small>
                                        </div>
                                    </div>

                                    <div className="card">
                                        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <FiPackage size={18} />
                                            Lista de Produtos
                                        </h3>
                                        <div className="table-responsive">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Produto</th>
                                                        <th>Categoria</th>
                                                        <th>Preço Venda</th>
                                                        <th>Custo</th>
                                                        <th>Margem de Lucro</th>
                                                        <th>Lucro (R$)</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {produtosPaginados.map((produto) => {
                                                        const margem = parseFloat(produto.margem);
                                                        const lucro = parseFloat(produto.preco_venda) - parseFloat(produto.custo);
                                                        let status = '';
                                                        let statusClass = '';
                                                        if (margem >= 60) { status = 'Excelente'; statusClass = 'text-success'; }
                                                        else if (margem >= 40) { status = 'Boa'; statusClass = 'text-warning'; }
                                                        else { status = 'Crítica'; statusClass = 'text-danger'; }
                                                        return (
                                                            <tr key={produto.id}>
                                                                <td>{produto.nome}</td>
                                                                <td>{produto.categoria || '-'}</td>
                                                                <td>R$ {parseFloat(produto.preco_venda).toFixed(2).replace('.', ',')}</td>
                                                                <td>R$ {parseFloat(produto.custo).toFixed(2).replace('.', ',')}</td>
                                                                <td className={statusClass}>{produto.margem}%</td>
                                                                <td className={statusClass}>R$ {lucro.toFixed(2).replace('.', ',')}</td>
                                                                <td className={statusClass}>{status}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                    {produtos.length === 0 && (
                                                        <tr>
                                                            <td colSpan="7" className="text-center text-muted">
                                                                <FiPackage size={32} />
                                                                <p>Nenhum produto cadastrado</p>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                        <Paginacao />
                                    </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 20 }}>
                                    <div className="card">
                                        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <FiBox size={18} />
                                            Ingredientes
                                            <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)' }}>
                                                {ingredientes.length} registros
                                            </span>
                                        </h3>
                                        <div className="table-responsive" style={{ maxHeight: 300, overflowY: 'auto' }}>
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Ingrediente</th>
                                                        <th>Unidade</th>
                                                        <th>Custo Unitário</th>
                                                        <th>Estoque Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {ingredientes.slice(0, 10).map(ing => {
                                                        const lotesIng = lotes.filter(l => l.ingrediente_id === ing.id);
                                                        const totalEstoque = lotesIng.reduce((sum, l) => sum + (parseFloat(l.quantidade) || 0), 0);
                                                        return (
                                                            <tr key={ing.id}>
                                                                <td>{ing.nome}</td>
                                                                <td>{ing.unidade}</td>
                                                                <td>
                                                                    R$ {(parseFloat(ing.custo_medio) / (parseFloat(ing.fator_conversao) || 1)).toFixed(2).replace('.', ',')} 
                                                                    / {ing.unidade_uso || ing.unidade}
                                                                </td>
                                                                <td>{totalEstoque.toFixed(2)} {ing.unidade}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                    {ingredientes.length === 0 && (
                                                        <tr>
                                                            <td colSpan="4" className="text-center text-muted">
                                                                <p>Nenhum ingrediente cadastrado</p>
                                                            </td>
                                                        </tr>
                                                    )}
                                                    {ingredientes.length > 10 && (
                                                        <tr>
                                                            <td colSpan="4" className="text-center text-muted">
                                                                <small>... e mais {ingredientes.length - 10} ingredientes</small>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="card">
                                        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <FiCalendar size={18} />
                                            Lotes
                                            <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)' }}>
                                                {lotes.length} registros
                                            </span>
                                        </h3>
                                        <div className="table-responsive" style={{ maxHeight: 300, overflowY: 'auto' }}>
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Ingrediente</th>
                                                        <th>Quantidade</th>
                                                        <th>Validade</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {lotes.slice(0, 10).map(lote => {
                                                        const dias = Math.ceil((new Date(lote.data_validade) - new Date()) / (1000 * 60 * 60 * 24));
                                                        let cor = '#28a745';
                                                        let status = 'OK';
                                                        if (dias < 0) { cor = '#dc3545'; status = 'Vencido'; }
                                                        else if (dias === 0) { cor = '#ffc107'; status = 'Vence Hoje'; }
                                                        else if (dias <= 7) { cor = '#fd7e14'; status = 'Vence em breve'; }
                                                        return (
                                                            <tr key={lote.id}>
                                                                <td>{lote.ingrediente_nome}</td>
                                                                <td>{lote.quantidade} {lote.unidade}</td>
                                                                <td style={{ color: cor }}>
                                                                    {new Date(lote.data_validade).toLocaleDateString('pt-BR')}
                                                                </td>
                                                                <td style={{ color: cor, fontWeight: 'bold' }}>
                                                                    {status} ({dias} dias)
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                    {lotes.length === 0 && (
                                                        <tr>
                                                            <td colSpan="4" className="text-center text-muted">
                                                                <p>Nenhum lote registrado</p>
                                                            </td>
                                                        </tr>
                                                    )}
                                                    {lotes.length > 10 && (
                                                        <tr>
                                                            <td colSpan="4" className="text-center text-muted">
                                                                <small>... e mais {lotes.length - 10} lotes</small>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                </>
                            )}
                        </>
                    )}
                    {pagina === 'produtos' && <Produtos />}
                    {pagina === 'ingredientes' && <Ingredientes />}
                    {pagina === 'lotes' && <Lotes />}
                    {pagina === 'relatorios' && <Relatorios />}
                    {pagina === 'cardapio' && <Cardapio />}
                    {pagina === 'configuracoes' && <Configuracoes />}
                    {isDonoOuGerente && pagina === 'usuarios' && <Usuarios />}
                    {pagina === 'sobre' && <Sobre />}
                    {pagina === 'logs' && <Logs />}
                </>
            )}

            {usuario?.perfil === 'atendente' && (
                <>
                    {pagina === 'comandas' && <Atendente />}
                    {pagina === 'cardapio' && <Cardapio />}
                    {pagina === 'configuracoes' && <Configuracoes />}
                    {pagina === 'sobre' && <Sobre />}
                </>
            )}

            {usuario?.perfil === 'cozinha' && (
                <>
                    {pagina === 'cozinha' && <Cozinha />}
                    {pagina === 'cardapio' && <Cardapio />}
                    {pagina === 'configuracoes' && <Configuracoes />}
                    {pagina === 'sobre' && <Sobre />}
                </>
            )}
        </div>
    );
}

export default Dashboard;