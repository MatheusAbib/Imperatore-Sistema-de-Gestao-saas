import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
    FiClock, FiCoffee, FiCheckCircle, FiAlertCircle, 
    FiShoppingBag, FiClipboard, FiRefreshCw, FiBell
} from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Cozinha() {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [atualizando, setAtualizando] = useState(false);
    const [notificando, setNotificando] = useState({});

    useEffect(() => {
        carregarPedidos();
        const interval = setInterval(carregarPedidos, 5000);
        return () => clearInterval(interval);
    }, []);

    const carregarPedidos = async () => {
        setAtualizando(true);
        try {
            const response = await api.get('/pedidos/cozinha');
            const pedidosOrdenados = response.data.sort((a, b) => {
                return new Date(b.created_at) - new Date(a.created_at);
            });
            setPedidos(pedidosOrdenados);
        } catch (error) {
            console.error('Erro ao carregar pedidos', error);
        } finally {
            setAtualizando(false);
        }
    };

const atualizarStatus = async (pedidoId, status) => {
    setLoading(true);
    try {
        await api.put(`/pedidos/${pedidoId}/status`, { status });
        
        setPedidos(prevPedidos => 
            prevPedidos.map(p => 
                p.id === pedidoId 
                    ? { ...p, status_atual: status } 
                    : p
            )
        );
        
        toast.success('Status atualizado com sucesso!');
    } catch (error) {
        console.error('Erro ao atualizar status', error);
        toast.error('Erro ao atualizar status');
        await carregarPedidos();
    } finally {
        setLoading(false);
    }
};

    const enviarNotificacao = async (pedidoId) => {
        setNotificando(prev => ({ ...prev, [pedidoId]: true }));
        try {
            const pedido = pedidos.find(p => p.id === pedidoId);
            await api.post('/notificacoes', {
                mensagem: `Pedido da Mesa ${pedido.numero_mesa} - ${pedido.produto_nome} está pronto a mais de 5 minutos!`,
                pedido_id: pedidoId
            });
            toast.success('Notificação enviada para o atendente!');
        } catch (error) {
            console.error('Erro ao enviar notificação', error);
            toast.error('Erro ao enviar notificação');
        } finally {
            setNotificando(prev => ({ ...prev, [pedidoId]: false }));
        }
    };

    const getStatusConfig = (status) => {
        const configs = {
            'pendente': { 
                label: 'Pendente', 
                cor: '#d4a84a', 
                icon: FiClock,
                bg: '#f5edd4'
            },
            'preparo': { 
                label: 'Em preparo', 
                cor: '#5a7a8c', 
                icon: FiCoffee,
                bg: '#dce8ec'
            },
            'pronto': { 
                label: 'Pronto', 
                cor: '#6b8c4a', 
                icon: FiCheckCircle,
                bg: '#dce8d0'
            }
        };
        return configs[status] || { 
            label: status, 
            cor: '#b0a89c', 
            icon: FiAlertCircle,
            bg: '#f0ede8'
        };
    };

    const pedidosPendentes = pedidos.filter(p => p.status_atual === 'pendente');
    const pedidosPreparo = pedidos.filter(p => p.status_atual === 'preparo');
    const pedidosProntos = pedidos.filter(p => p.status_atual === 'pronto');

    const PedidoCard = ({ pedido, status, acao, labelBotao, corBotao }) => {
        const config = getStatusConfig(status);
        const StatusIcon = config.icon;
        const tempoPronto = status === 'pronto' ? Math.floor((new Date() - new Date(pedido.updated_at)) / 60000) : 0;
        const mostrarNotificacao = status === 'pronto' && tempoPronto >= 5;

        return (
            <div className="pedido-card">
                <div className="pedido-card-header">
                    <div className="pedido-card-mesa">
                        <FiClipboard size={16} />
                        <strong>Mesa {pedido.numero_mesa}</strong>
                    </div>
                    <span className="pedido-card-status" style={{ color: config.cor }}>
                        <StatusIcon size={14} />
                        {config.label}
                    </span>
                </div>
                <div className="pedido-card-body">
                    <span className="pedido-card-produto">
                        <FiShoppingBag size={14} />
                        {pedido.produto_nome}
                        {pedido.observacao && (
                            <span className="pedido-card-obs">
                                ({pedido.observacao})
                            </span>
                        )}
                    </span>
                    <span className="pedido-card-quantidade">
                        {pedido.quantidade}x
                    </span>
                </div>
                <div className="pedido-card-footer">
                    <div className="pedido-card-footer-left">
                        <small>
                            {new Date(pedido.created_at).toLocaleTimeString('pt-BR', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                            })}
                        </small>
                        {status === 'pronto' && (
                            <small style={{ color: tempoPronto >= 5 ? '#dc3545' : '#6c757d' }}>
                                • {tempoPronto} min pronto
                            </small>
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                        {mostrarNotificacao && (
                            <button
                                className="btn btn-warning"
                                onClick={() => enviarNotificacao(pedido.id)}
                                disabled={notificando[pedido.id]}
                                style={{ padding: '6px 10px', fontSize: 12 }}
                            >
                                <FiBell size={14} />
                            </button>
                        )}
                        {acao && (
                            <button
                                className={`btn ${corBotao}`}
                                onClick={() => atualizarStatus(pedido.id, acao)}
                                disabled={loading}
                            >
                                {labelBotao}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} theme="dark" />

            <div className="page-header">
                <div>
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <FiCoffee size={28} color="var(--primary)" />
                        Cozinha
                    </h1>
                    <p className="text-muted">Gerencie os pedidos em tempo real</p>
                </div>
                <button 
                    className="btn btn-secondary" 
                    onClick={carregarPedidos}
                    disabled={atualizando}
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                    <FiRefreshCw size={16} className={atualizando ? 'spinning' : ''} />
                    {atualizando ? 'Atualizando...' : 'Atualizar'}
                </button>
            </div>

            {pedidos.length === 0 ? (
                <div className="card empty-state">
                    <FiCheckCircle size={48} color="var(--green)" />
                    <h3>Tudo em ordem!</h3>
                    <p className="text-muted">Nenhum pedido pendente no momento</p>
                </div>
            ) : (
                <div className="cozinha-grid">
                    <div className="card card-cozinha">
                        <h2 className="cozinha-title" style={{ color: '#d4a84a' }}>
                            <FiClock size={20} />
                            Pendentes
                            <span className="cozinha-badge">{pedidosPendentes.length}</span>
                        </h2>
                        {pedidosPendentes.length === 0 ? (
                            <p className="text-muted">Nenhum pedido pendente</p>
                        ) : (
                            <div className="pedidos-scroll">
                                {pedidosPendentes.map(pedido => (
                                    <PedidoCard
                                        key={pedido.id}
                                        pedido={pedido}
                                        status="pendente"
                                        acao="preparo"
                                        labelBotao="Iniciar Preparo"
                                        corBotao="btn-primary"
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="card card-cozinha">
                        <h2 className="cozinha-title" style={{ color: '#5a7a8c' }}>
                            <FiCoffee size={20} />
                            Em preparo
                            <span className="cozinha-badge">{pedidosPreparo.length}</span>
                        </h2>
                        {pedidosPreparo.length === 0 ? (
                            <p className="text-muted">Nenhum pedido em preparo</p>
                        ) : (
                            <div className="pedidos-scroll">
                                {pedidosPreparo.map(pedido => (
                                    <PedidoCard
                                        key={pedido.id}
                                        pedido={pedido}
                                        status="preparo"
                                        acao="pronto"
                                        labelBotao="Marcar Pronto"
                                        corBotao="btn-success"
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="card card-cozinha">
                        <h2 className="cozinha-title" style={{ color: '#6b8c4a' }}>
                            <FiCheckCircle size={20} />
                            Prontos
                            <span className="cozinha-badge">{pedidosProntos.length}</span>
                        </h2>
                        {pedidosProntos.length === 0 ? (
                            <p className="text-muted">Nenhum pedido pronto</p>
                        ) : (
                            <div className="pedidos-scroll">
                                {pedidosProntos.map(pedido => (
                                    <PedidoCard
                                        key={pedido.id}
                                        pedido={pedido}
                                        status="pronto"
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default Cozinha;