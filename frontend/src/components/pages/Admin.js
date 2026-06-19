import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FiUsers, FiServer, FiPackage, FiTrendingUp, FiAlertCircle, FiCheckCircle, FiDollarSign, FiClock, FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function Admin() {
    const [stats, setStats] = useState({
        totalEstabelecimentos: 0,
        totalUsuarios: 0,
        totalProdutos: 0,
        totalPedidos: 0
    });
    const [ultimosEstabelecimentos, setUltimosEstabelecimentos] = useState([]);
    const [crescimentoMensal, setCrescimentoMensal] = useState([]);
    const [distribuicaoPlanos, setDistribuicaoPlanos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            const [statsRes, estabelecimentosRes, crescimentoRes, planosRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/ultimos-estabelecimentos'),
                api.get('/admin/crescimento-mensal'),
                api.get('/admin/distribuicao-planos')
            ]);
            
            setStats(statsRes.data);
            setUltimosEstabelecimentos(estabelecimentosRes.data);
            setCrescimentoMensal(crescimentoRes.data);
            setDistribuicaoPlanos(planosRes.data);
        } catch (error) {
            console.error('Erro ao carregar dados', error);
            toast.error('Erro ao carregar dados');
        } finally {
            setLoading(false);
        }
    };

    const coresPlanos = {
        'gratis': '#6c757d',
        'basico': '#007bff',
        'profissional': '#28a745'
    };

    const coresCrescimento = ['#b85a3a', '#b88b4a', '#6b8c4a', '#5a7a8c', '#d4a84a', '#8a6b8c'];

    if (loading) return <div className="loading-state">Carregando...</div>;

    return (
        <div className="admin-container">
            <div className="page-header">
                <div>
                    <h1>Painel Administrativo</h1>
                    <p className="text-muted">Visão geral do sistema</p>
                </div>
            </div>

            <div className="status-grid">
                <div className="card status-card">
                    <div className="status-card-icon" style={{ backgroundColor: '#b85a3a22', color: '#b85a3a' }}>
                        <FiServer size={24} />
                    </div>
                    <div className="status-card-content">
                        <span className="status-card-value">{stats.totalEstabelecimentos}</span>
                        <span className="status-card-title">Estabelecimentos</span>
                    </div>
                </div>

                <div className="card status-card">
                    <div className="status-card-icon" style={{ backgroundColor: '#5a7a8c22', color: '#5a7a8c' }}>
                        <FiUsers size={24} />
                    </div>
                    <div className="status-card-content">
                        <span className="status-card-value">{stats.totalUsuarios}</span>
                        <span className="status-card-title">Usuários</span>
                    </div>
                </div>

                <div className="card status-card">
                    <div className="status-card-icon" style={{ backgroundColor: '#6b8c4a22', color: '#6b8c4a' }}>
                        <FiPackage size={24} />
                    </div>
                    <div className="status-card-content">
                        <span className="status-card-value">{stats.totalProdutos}</span>
                        <span className="status-card-title">Produtos</span>
                    </div>
                </div>

                <div className="card status-card">
                    <div className="status-card-icon" style={{ backgroundColor: '#d4a84a22', color: '#d4a84a' }}>
                        <FiCheckCircle size={24} />
                    </div>
                    <div className="status-card-content">
                        <span className="status-card-value">{stats.totalPedidos}</span>
                        <span className="status-card-title">Pedidos</span>
                    </div>
                </div>
            </div>

            <div className="charts-grid">
                <div className="card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiTrendingUp size={18} />
                        Crescimento Mensal
                    </h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={crescimentoMensal}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="mes" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="total" fill="#b85a3a">
                                {crescimentoMensal.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={coresCrescimento[index % coresCrescimento.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiDollarSign size={18} />
                        Distribuição de Planos
                    </h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={distribuicaoPlanos}
                                cx="50%"
                                cy="50%"
                                labelLine={true}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {distribuicaoPlanos.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={coresPlanos[entry.name] || '#6c757d'} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="card">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FiClock size={18} />
                    Últimos Estabelecimentos Cadastrados
                </h3>
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>CNPJ</th>
                                <th>Plano</th>
                                <th>Data</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ultimosEstabelecimentos.map((est) => (
                                <tr key={est.id}>
                                    <td>{est.nome}</td>
                                    <td>{est.cnpj || '-'}</td>
                                    <td><span className="badge" style={{ backgroundColor: coresPlanos[est.plano] || '#6c757d', color: 'white' }}>{est.plano || 'gratis'}</span></td>
                                    <td>{new Date(est.created_at).toLocaleDateString('pt-BR')}</td>
                                </tr>
                            ))}
                            {ultimosEstabelecimentos.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center text-muted">
                                        <p>Nenhum estabelecimento cadastrado</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Admin;