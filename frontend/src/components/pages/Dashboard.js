import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, 
    CartesianGrid, Tooltip, ResponsiveContainer
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
import AnaliseVendas from './AnaliseVendas';

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
    const [paginaIngredientes, setPaginaIngredientes] = useState(1);
    const [paginaLotes, setPaginaLotes] = useState(1);
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

    const totalProdutos = produtos.length;
    const produtosPaginados = produtos.slice(
        (paginaProdutos - 1) * itensPorPagina,
        paginaProdutos * itensPorPagina
    );


const StatusCard = ({ icon: Icon, title, value, color, subtitle, tooltip }) => (
    <div className="card status-card" style={{ position: 'relative' }}>
        {tooltip && (
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
                <TooltipInfo id={`tooltip-${title.replace(/\s/g, '')}`} texto={tooltip} />
            </div>
        )}
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
    <div style={{ position: 'relative', display: 'inline-block'}}>
        <FiHelpCircle 
            size={16} 
            color="var(--text-muted)" 
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => setTooltipAtivo(id)}
            onMouseLeave={() => setTooltipAtivo(null)}
        />
        {tooltipAtivo === id && (
            <div style={{
                position: 'absolute',
                top: '50px',
                left: 'calc(100% + 12px)',
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
        tooltip="Número total de produtos cadastrados no cardápio. Isso inclui todos os produtos, independente de estarem sendo vendidos ou não."
    />
    <StatusCard
        icon={FiTrendingUp}
        title="Margem Média"
        value={produtosComMargem.length > 0 ? 
            (produtosComMargem.reduce((sum, p) => sum + p.margem, 0) / produtosComMargem.length).toFixed(1) + '%' : 
            '0%'}
        color="#6b8c4a"
        subtitle="Média geral"
        tooltip="Média aritmética de todas as margens de lucro dos produtos cadastrados. Quanto maior, mais saudável é o negócio. Ideal: acima de 50%."
    />
    <StatusCard
        icon={FiAlertCircle}
        title="Em Alerta"
        value={produtosAlerta.length}
        color="#b85a4a"
        subtitle="Margem < 40%"
        tooltip="Produtos com margem de lucro abaixo de 40%. Isso significa que o lucro é baixo e pode indicar que o preço está muito próximo do custo. Considere aumentar o preço ou reduzir custos."
    />
    <StatusCard
        icon={FiCheckCircle}
        title="Excelentes"
        value={produtosExcelente.length}
        color="#6b8c4a"
        subtitle="Margem > 60%"
        tooltip="Produtos com margem de lucro acima de 60%. São os produtos mais rentáveis do cardápio. Ótimo para focar as vendas e promoções."
    />
</div>



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
            texto="Ranking dos produtos com as maiores margens de lucro. Quanto maior a barra, mais rentável é o produto."
        />
    </h3>
    <ResponsiveContainer width="100%" height={350}>
        <BarChart data={dadosBarra} layout="vertical" margin={{  right: 20, top: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis 
                dataKey="nome" 
                type="category" 
                width={120} 
                tick={{ fontSize: 11, fill: 'var(--text-color)' }}
                interval={0}
            />
            <Tooltip 
                contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                formatter={(value) => `${value.toFixed(1)}%`}
            />
            <Bar dataKey="margem" fill="#b88b4a" barSize={20}>
                {dadosBarra.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.margem >= 60 ? '#6b8c4a' : (entry.margem >= 40 ? '#d4a84a' : '#b85a4a')} />
                ))}
            </Bar>
        </BarChart>
    </ResponsiveContainer>
</div>
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
                                    <div>
            
                                    </div>
                                </>
                            )}
                        </>
                    )}
                    {pagina === 'analise' && <AnaliseVendas />}
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