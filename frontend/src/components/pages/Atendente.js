import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
    FiPlus, FiTrash2, FiSearch, FiX, FiCoffee, FiPackage, 
    FiShoppingBag, FiCreditCard, FiUser, FiClipboard, 
    FiCheckCircle, FiClock, FiAlertCircle, FiDollarSign,
    FiChevronLeft, FiChevronRight
} from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Atendente() {
    const [produtos, setProdutos] = useState([]);
    const [busca, setBusca] = useState('');
    const [comandas, setComandas] = useState([]);
    const [comandaAtual, setComandaAtual] = useState(null);
    const [itensComanda, setItensComanda] = useState([]);
    const [mostrarProdutos, setMostrarProdutos] = useState(false);
    const [numeroMesa, setNumeroMesa] = useState('');
    const [nomeCliente, setNomeCliente] = useState('');
    const [loading, setLoading] = useState(false);
    const [modalAberto, setModalAberto] = useState(false);
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [quantidade, setQuantidade] = useState('1');
    const [observacao, setObservacao] = useState('');
    const [statusPedidos, setStatusPedidos] = useState([]);
    const [modalConfirmacao, setModalConfirmacao] = useState(null);
    const [modalFecharComanda, setModalFecharComanda] = useState(false);
    const [paginaProdutos, setPaginaProdutos] = useState(1);
    const itensPorPagina = 15;

    useEffect(() => {
        carregarProdutos();
        carregarComandas();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (comandaAtual) {
                carregarStatusPedidos(comandaAtual.id);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [comandaAtual]);

    const carregarProdutos = async () => {
        try {
            const response = await api.get('/produtos');
            setProdutos(response.data);
        } catch (error) {
            console.error('Erro ao carregar produtos', error);
            toast.error('Erro ao carregar produtos');
        }
    };

    const carregarComandas = async () => {
        try {
            const response = await api.get('/comandas');
            setComandas(response.data);
        } catch (error) {
            console.error('Erro ao carregar comandas', error);
            toast.error('Erro ao carregar comandas');
        }
    };

    const carregarItensComanda = async (comandaId) => {
        try {
            const response = await api.get(`/comandas/${comandaId}/itens`);
            setItensComanda(response.data);
        } catch (error) {
            console.error('Erro ao carregar itens', error);
        }
    };

    const carregarStatusPedidos = async (comandaId) => {
        try {
            const response = await api.get(`/comandas/${comandaId}/pedidos/status`);
            setStatusPedidos(response.data);
        } catch (error) {
            console.error('Erro ao carregar status', error);
        }
    };

    const criarComanda = async () => {
        if (!numeroMesa) {
            toast.warning('Digite o número da mesa');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/comandas', {
                numero_mesa: parseInt(numeroMesa),
                nome_cliente: nomeCliente || null
            });
            setComandaAtual(response.data);
            setNumeroMesa('');
            setNomeCliente('');
            setMostrarProdutos(true);
            await carregarComandas();
            await carregarItensComanda(response.data.id);
            toast.success(`Comanda da Mesa ${response.data.numero_mesa} criada!`);
        } catch (error) {
            console.error('Erro ao criar comanda', error);
            toast.error('Erro ao criar comanda');
        } finally {
            setLoading(false);
        }
    };

    const abrirModal = (produto) => {
        setProdutoSelecionado(produto);
        setQuantidade('1');
        setObservacao('');
        setModalAberto(true);
    };

    const fecharModal = () => {
        setModalAberto(false);
        setProdutoSelecionado(null);
        setQuantidade('1');
        setObservacao('');
    };

    const confirmarAdicionarItem = async () => {
        if (!produtoSelecionado) return;
        
        if (!quantidade || parseFloat(quantidade) <= 0) {
            toast.warning('Digite uma quantidade válida');
            return;
        }

        setLoading(true);
        try {
            await api.post('/comandas/itens', {
                comanda_id: comandaAtual.id,
                produto_id: produtoSelecionado.id,
                quantidade: parseFloat(quantidade),
                observacao: observacao || null
            });
            await carregarItensComanda(comandaAtual.id);
            await carregarStatusPedidos(comandaAtual.id);
            await carregarComandas();
            fecharModal();
            toast.success('Item adicionado com sucesso!');
        } catch (error) {
            console.error('Erro ao adicionar item', error);
            toast.error('Erro ao adicionar item');
        } finally {
            setLoading(false);
        }
    };

    const removerItem = async (itemId) => {
        setModalConfirmacao({
            id: itemId,
            acao: 'remover'
        });
    };

    const confirmarRemocao = async () => {
        if (!modalConfirmacao) return;
        setLoading(true);
        try {
            await api.delete(`/comandas/itens/${modalConfirmacao.id}`);
            await carregarItensComanda(comandaAtual.id);
            await carregarComandas();
            toast.success('Item removido com sucesso');
        } catch (error) {
            console.error('Erro ao remover item', error);
            toast.error('Erro ao remover item');
        } finally {
            setLoading(false);
            setModalConfirmacao(null);
        }
    };

    const marcarEntregue = async (itemId) => {
        setLoading(true);
        try {
            await api.put(`/pedidos/${itemId}/status`, { status: 'entregue' });
            
            setStatusPedidos(prev => 
                prev.map(s => 
                    s.id === itemId 
                        ? { ...s, status: 'entregue' } 
                        : s
                )
            );
            
            toast.success('Pedido marcado como entregue!');
        } catch (error) {
            console.error('Erro ao marcar entregue', error);
            toast.error('Erro ao marcar entregue');
        } finally {
            setLoading(false);
        }
    };

    const fecharComanda = async () => {
        setModalFecharComanda(true);
    };

    const confirmarFecharComanda = async () => {
        setLoading(true);
        try {
            await api.put(`/comandas/${comandaAtual.id}/fechar`);
            setComandaAtual(null);
            setItensComanda([]);
            setMostrarProdutos(false);
            await carregarComandas();
            toast.success('Comanda fechada com sucesso!');
        } catch (error) {
            console.error('Erro ao fechar comanda', error);
            toast.error('Erro ao fechar comanda');
        } finally {
            setLoading(false);
            setModalFecharComanda(false);
        }
    };

    const produtosFiltrados = produtos.filter(p =>
        p.nome.toLowerCase().includes(busca.toLowerCase()) ||
        (p.categoria && p.categoria.toLowerCase().includes(busca.toLowerCase()))
    );

    const produtosPaginados = produtosFiltrados.slice(
        (paginaProdutos - 1) * itensPorPagina,
        paginaProdutos * itensPorPagina
    );

    const totalPaginas = Math.ceil(produtosFiltrados.length / itensPorPagina);

    const totalComanda = itensComanda.reduce((sum, item) => sum + (item.quantidade * item.preco_unitario), 0);

    const getStatusConfig = (status) => {
        const configs = {
            'pendente': { 
                label: 'Pendente', 
                cor: '#ffc107', 
                icon: FiClock 
            },
            'preparo': { 
                label: 'Preparo', 
                cor: '#17a2b8', 
                icon: FiCoffee 
            },
            'pronto': { 
                label: 'Pronto', 
                cor: '#28a745', 
                icon: FiCheckCircle 
            },
            'entregue': { 
                label: 'Entregue', 
                cor: '#6c757d', 
                icon: FiCheckCircle 
            }
        };
        return configs[status] || { 
            label: status, 
            cor: '#6c757d', 
            icon: FiAlertCircle 
        };
    };

    const getIcon = (produto) => {
        if (produto.categoria === 'Lanche') return <FiCoffee size={18} />;
        if (produto.categoria === 'Bebida') return <FiDollarSign size={18} />;
        return <FiPackage size={18} />;
    };

    const PaginacaoProdutos = () => {
        if (totalPaginas <= 1) return null;
        return (
            <div className="pagination" style={{ marginTop: 12, justifyContent: 'center' }}>
                <button
                    className="btn btn-secondary"
                    onClick={() => setPaginaProdutos(p => Math.max(1, p - 1))}
                    disabled={paginaProdutos <= 1}
                    style={{ padding: '4px 12px' }}
                >
                    <FiChevronLeft size={16} />
                </button>
                <span style={{ fontSize: 13, margin: '0 8px' }}>
                    Página {paginaProdutos} de {totalPaginas}
                </span>
                <button
                    className="btn btn-secondary"
                    onClick={() => setPaginaProdutos(p => Math.min(totalPaginas, p + 1))}
                    disabled={paginaProdutos >= totalPaginas}
                    style={{ padding: '4px 12px' }}
                >
                    <FiChevronRight size={16} />
                </button>
            </div>
        );
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} theme="dark" />

            <div className="page-header">
                <div>
                    <h1>Atendente</h1>
                    <p className="text-muted">Gerencie comandas e pedidos</p>
                </div>
                {loading && <span className="text-muted">Carregando...</span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 20 }}>
                <div className="card">
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <FiClipboard size={20} />
                        Comandas Abertas
                    </h2>
                    <div style={{ marginBottom: 15 }}>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <input
                                type="number"
                                placeholder="Número da mesa"
                                value={numeroMesa}
                                onChange={(e) => setNumeroMesa(e.target.value)}
                                style={{ flex: 1 }}
                            />
                            <button 
                                className="btn btn-primary" 
                                onClick={criarComanda} 
                                disabled={loading}
                                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                            >
                                <FiPlus size={16} />
                                Nova
                            </button>
                        </div>
                        <input
                            type="text"
                            placeholder="Nome do cliente (opcional)"
                            value={nomeCliente}
                            onChange={(e) => setNomeCliente(e.target.value)}
                            style={{ width: '100%', marginTop: 10 }}
                        />
                    </div>

                    {comandas.length === 0 ? (
                        <p className="text-muted">Nenhuma comanda aberta</p>
                    ) : (
                        comandas.map(comanda => (
                            <div
                                key={comanda.id}
                                className={`comanda-item ${comandaAtual?.id === comanda.id ? 'active' : ''}`}
                                onClick={async () => {
                                    setComandaAtual(comanda);
                                    setPaginaProdutos(1);
                                    await carregarItensComanda(comanda.id);
                                    await carregarStatusPedidos(comanda.id);
                                    setMostrarProdutos(true);
                                }}
                            >
                                <div>
                                    <strong>Mesa {comanda.numero_mesa}</strong>
                                    {comanda.nome_cliente && <span> - {comanda.nome_cliente}</span>}
                                </div>
                                <span className="comanda-total">
                                    R$ {parseFloat(comanda.total).toFixed(2)}
                                </span>
                            </div>
                        ))
                    )}
                </div>

                <div className="card">
                    {!mostrarProdutos ? (
                        <div className="empty-state">
                            <FiClipboard size={48} />
                            <h3>Selecione uma comanda</h3>
                            <p className="text-muted">ou crie uma nova para começar</p>
                        </div>
                    ) : (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                <h2 style={{ margin: 0 }}>Mesa {comandaAtual?.numero_mesa}</h2>
                                <button 
                                    className="btn btn-danger" 
                                    onClick={fecharComanda} 
                                    disabled={loading}
                                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                                >
                                    <FiX size={16} />
                                    Fechar Comanda
                                </button>
                            </div>
                            
                            <div className="search-box">
                                <FiSearch size={20} className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Buscar produto..."
                                    value={busca}
                                    onChange={(e) => {
                                        setBusca(e.target.value);
                                        setPaginaProdutos(1);
                                    }}
                                />
                            </div>

                            <div className="produtos-grid">
                                {produtosPaginados.map(produto => (
                                    <button
                                        key={produto.id}
                                        className="btn produto-btn"
                                        onClick={() => abrirModal(produto)}
                                    >
                                        <span className="produto-btn-nome">{produto.nome}</span>
                                        <span className="produto-btn-preco">
                                            R$ {parseFloat(produto.preco_venda).toFixed(2)}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <PaginacaoProdutos />

                            {produtosFiltrados.length === 0 && (
                                <p className="text-muted" style={{ textAlign: 'center', marginTop: 16 }}>
                                    Nenhum produto encontrado
                                </p>
                            )}

                            <h3 style={{ marginTop: 16 }}>Itens da Comanda</h3>
                            {itensComanda.length === 0 ? (
                                <p className="text-muted">Nenhum item adicionado</p>
                            ) : (
                                <div className="table-responsive">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Produto</th>
                                                <th>Qtd</th>
                                                <th>Preço</th>
                                                <th>Total</th>
                                                <th>Status</th>
                                                <th>Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {itensComanda.map(item => {
                                                const statusPedido = statusPedidos.find(s => s.id === item.id);
                                                const statusAtual = statusPedido?.status || 'pendente';
                                                const statusConfig = getStatusConfig(statusAtual);
                                                const StatusIcon = statusConfig.icon;
                                                
                                                return (
                                                    <tr key={item.id}>
                                                        <td>{item.produto_nome}</td>
                                                        <td>{item.quantidade}</td>
                                                        <td>R$ {parseFloat(item.preco_unitario).toFixed(2)}</td>
                                                        <td>R$ {(item.quantidade * item.preco_unitario).toFixed(2)}</td>
                                                        <td>
                                                            <span style={{ 
                                                                color: statusConfig.cor,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 4,
                                                                fontSize: 12
                                                            }}>
                                                                <StatusIcon size={14} />
                                                                {statusConfig.label}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div style={{ display: 'flex', gap: 4 }}>
                                                                {statusAtual === 'pronto' && (
                                                                    <button 
                                                                        className="btn-icon btn-success" 
                                                                        onClick={() => marcarEntregue(item.id)}
                                                                        title="Marcar como entregue"
                                                                        style={{ 
                                                                            background: 'var(--green)', 
                                                                            color: 'white',
                                                                            borderRadius: '50%',
                                                                            width: 28,
                                                                            height: 28,
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            border: 'none',
                                                                            cursor: 'pointer'
                                                                        }}
                                                                    >
                                                                        <FiCheckCircle size={14} />
                                                                    </button>
                                                                )}
                                                                <button 
                                                                    className="btn-icon btn-delete" 
                                                                    onClick={() => removerItem(item.id)}
                                                                    title="Remover"
                                                                >
                                                                    <FiTrash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            <hr />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ margin: 0 }}>Total: R$ {totalComanda.toFixed(2)}</h3>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {modalAberto && produtoSelecionado && (
                <div className="modal-overlay" onClick={fecharModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>
                                <FiShoppingBag size={18} style={{ marginRight: 8 }} />
                                {produtoSelecionado.nome}
                            </h3>
                            <button className="modal-close" onClick={fecharModal}>
                                <FiX size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <p style={{ color: 'var(--primary)', fontWeight: 'bold', marginBottom: 16 }}>
                                Preço: R$ {parseFloat(produtoSelecionado.preco_venda).toFixed(2)}
                            </p>
                            
                            <div className="form-group">
                                <label>Quantidade</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={quantidade}
                                    onChange={(e) => setQuantidade(e.target.value)}
                                    min="0.01"
                                    autoFocus
                                />
                            </div>

                            <div className="form-group">
                                <label>Observação (opcional)</label>
                                <textarea
                                    value={observacao}
                                    onChange={(e) => setObservacao(e.target.value)}
                                    placeholder="Ex: sem cebola, bem passado..."
                                    rows={2}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={fecharModal}>Cancelar</button>
                            <button className="btn btn-primary" onClick={confirmarAdicionarItem} disabled={loading}>
                                <FiPlus size={16} style={{ marginRight: 6 }} />
                                Adicionar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {modalConfirmacao && (
                <div className="modal-overlay" onClick={() => setModalConfirmacao(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Confirmar</h3>
                            <button className="modal-close" onClick={() => setModalConfirmacao(null)}>
                                <FiX size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <FiAlertCircle size={32} className="modal-icon-warning" />
                            <p>Remover este item da comanda?</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setModalConfirmacao(null)}>
                                Cancelar
                            </button>
                            <button className="btn btn-danger" onClick={confirmarRemocao}>
                                <FiTrash2 size={16} style={{ marginRight: 6 }} />
                                Remover
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {modalFecharComanda && comandaAtual && (
                <div className="modal-overlay" onClick={() => setModalFecharComanda(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Fechar Comanda</h3>
                            <button className="modal-close" onClick={() => setModalFecharComanda(false)}>
                                <FiX size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <FiAlertCircle size={32} className="modal-icon-warning" />
                            <p>Tem certeza que deseja fechar a comanda da <strong>Mesa {comandaAtual.numero_mesa}</strong>?</p>
                            <p className="text-muted">Total: R$ {totalComanda.toFixed(2)}</p>
                            <p className="text-muted" style={{ fontSize: 12 }}>Esta ação não pode ser desfeita.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setModalFecharComanda(false)}>
                                Cancelar
                            </button>
                            <button className="btn btn-danger" onClick={confirmarFecharComanda} disabled={loading}>
                                <FiX size={16} style={{ marginRight: 6 }} />
                                Fechar Comanda
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Atendente;