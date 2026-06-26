import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
    FiClipboard, FiClock, FiUser, FiDollarSign, 
    FiSearch, FiX, FiCalendar, FiRefreshCw, FiEye,
    FiShoppingBag, FiInfo
} from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ComandasFinalizadas() {
    const [comandas, setComandas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState('');
    const [atualizando, setAtualizando] = useState(false);
    const [modalAberto, setModalAberto] = useState(false);
    const [detalhes, setDetalhes] = useState(null);
    const [carregandoDetalhes, setCarregandoDetalhes] = useState(false);

    useEffect(() => {
        carregarComandas();
        const interval = setInterval(carregarComandas, 30000);
        return () => clearInterval(interval);
    }, []);

    const carregarComandas = async () => {
        setAtualizando(true);
        try {
            const response = await api.get('/comandas/finalizadas');
            setComandas(response.data);
        } catch (error) {
            console.error('Erro ao carregar comandas finalizadas', error);
            toast.error('Erro ao carregar comandas');
        } finally {
            setLoading(false);
            setAtualizando(false);
        }
    };

    const verDetalhes = async (comandaId) => {
        setCarregandoDetalhes(true);
        setModalAberto(true);
        try {
            const response = await api.get(`/comandas/finalizadas/${comandaId}/detalhes`);
            setDetalhes(response.data);
        } catch (error) {
            console.error('Erro ao carregar detalhes', error);
            toast.error('Erro ao carregar detalhes da comanda');
            setModalAberto(false);
        } finally {
            setCarregandoDetalhes(false);
        }
    };

    const fecharModal = () => {
        setModalAberto(false);
        setDetalhes(null);
    };

    const comandasFiltradas = comandas.filter(c =>
        c.numero_mesa.toString().includes(busca) ||
        (c.nome_cliente && c.nome_cliente.toLowerCase().includes(busca.toLowerCase()))
    );

    const formatarData = (data) => {
        return new Date(data).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

if (loading) {
    return (
        <div className="skeleton-container">
            <div className="page-header">
                <div>
                    <h1>Comandas Finalizadas</h1>
                    <p className="text-muted">Histórico de comandas já fechadas</p>
                </div>
            </div>
            <div className="card">
                <div className="skeleton-container">
                    <div className="skeleton-card" style={{ height: 50, minHeight: 50 }}></div>
                    <div className="skeleton-table"></div>
                </div>
            </div>
        </div>
    );
}

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} theme="dark" />

            <div className="page-header">
                <div>
                    <h1>Comandas Finalizadas</h1>
                    <p className="text-muted">Histórico de comandas já fechadas</p>
                </div>
                <button 
                    className="btn btn-secondary" 
                    onClick={carregarComandas}
                    disabled={atualizando}
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                    <FiRefreshCw size={16} className={atualizando ? 'spinning' : ''} />
                    {atualizando ? 'Atualizando...' : 'Atualizar'}
                </button>
            </div>

            <div className="card">
                <div className="search-box">
                    <FiSearch size={20} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Buscar por mesa ou cliente..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />
                    {busca && (
                        <button className="search-clear" onClick={() => setBusca('')}>
                            <FiX size={18} />
                        </button>
                    )}
                </div>

                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Mesa</th>
                                <th>Cliente</th>
                                <th>Itens</th>
                                <th>Total</th>
                                <th>Fechada em</th>
                                <th>Status</th>
                                <th className="text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comandasFiltradas.map((comanda) => (
                                <tr key={comanda.id}>
                                    <td>
                                        <strong>Mesa {comanda.numero_mesa}</strong>
                                    </td>
                                    <td>{comanda.nome_cliente || '-'}</td>
                                    <td>{comanda.total_itens || 0}</td>
                                    <td style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                                        R$ {parseFloat(comanda.valor_total || comanda.total || 0).toFixed(2)}
                                    </td>
                                    <td>{formatarData(comanda.updated_at)}</td>
                                    <td>
                                        <span className="badge" style={{ backgroundColor: '#6c757d', color: 'white' }}>
                                            Fechada
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        <button 
                                            className="btn-icon btn-info" 
                                            onClick={() => verDetalhes(comanda.id)}
                                            title="Ver detalhes"
                                            style={{ color: '#5a7a8c' }}
                                        >
                                            <FiEye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {comandasFiltradas.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="text-center text-muted">
                                        <FiClipboard size={32} />
                                        <p>Nenhuma comanda finalizada encontrada</p>
                                        <span>As comandas fechadas aparecerão aqui</span>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)' }}>
                    {comandasFiltradas.length} comanda(s) finalizada(s)
                </div>
            </div>

            {modalAberto && detalhes && (
                <div className="modal-overlay" onClick={fecharModal}>
                    <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>
                                <FiClipboard size={18} style={{ marginRight: 8 }} />
                                Detalhes da Comanda
                            </h3>
                            <button className="modal-close" onClick={fecharModal}>
                                <FiX size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            {carregandoDetalhes ? (
                                <div className="loading-container">
                                    <div className="loading-spinner"></div>
                                    <span>Carregando detalhes...</span>
                                </div>
                            ) : (
                                <>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                                        <div><strong>Mesa:</strong> {detalhes.comanda.numero_mesa}</div>
                                        <div><strong>Cliente:</strong> {detalhes.comanda.nome_cliente || '-'}</div>
                                        <div><strong>Total de Itens:</strong> {detalhes.comanda.total_itens}</div>
                                        <div><strong>Valor Total:</strong> <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>R$ {parseFloat(detalhes.comanda.valor_total).toFixed(2)}</span></div>
                                        <div style={{ gridColumn: '1 / -1' }}><strong>Fechada em:</strong> {formatarData(detalhes.comanda.updated_at)}</div>
                                    </div>

                                    <h4 style={{ marginBottom: 12 }}>Itens da Comanda</h4>
                                    <div className="table-responsive">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Produto</th>
                                                    <th>Categoria</th>
                                                    <th>Quantidade</th>
                                                    <th>Preço Unit.</th>
                                                    <th>Subtotal</th>
                                                    <th>Observação</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {detalhes.itens.map((item) => (
                                                    <tr key={item.id}>
                                                        <td>{item.produto_nome}</td>
                                                        <td>{item.categoria || '-'}</td>
                                                        <td>{item.quantidade}</td>
                                                        <td>R$ {parseFloat(item.preco_unitario).toFixed(2)}</td>
                                                        <td style={{ fontWeight: 'bold' }}>R$ {(item.quantidade * item.preco_unitario).toFixed(2)}</td>
                                                        <td>{item.observacao || '-'}</td>
                                                    </tr>
                                                ))}
                                                {detalhes.itens.length === 0 && (
                                                    <tr>
                                                        <td colSpan="6" className="text-center text-muted">
                                                            Nenhum item encontrado
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={fecharModal}>
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ComandasFinalizadas;