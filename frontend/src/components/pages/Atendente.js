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
    const [loadingInicial, setLoadingInicial] = useState(true);
    const [loadingAcao, setLoadingAcao] = useState(false);
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
        carregarDadosIniciais();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (comandaAtual) {
                carregarStatusPedidos(comandaAtual.id);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [comandaAtual]);

    const carregarDadosIniciais = async () => {
        setLoadingInicial(true);
        try {
            await Promise.all([
                carregarProdutos(),
                carregarComandas()
            ]);
        } catch (error) {
            console.error('Erro ao carregar dados iniciais', error);
        } finally {
            setLoadingInicial(false);
        }
    };

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

        setLoadingAcao(true);
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
            setLoadingAcao(false);
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

        setLoadingAcao(true);
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
            setLoadingAcao(false);
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
        setLoadingAcao(true);
        try {
            await api.delete(`/comandas/itens/${modalConfirmacao.id}`);
            await carregarItensComanda(comandaAtual.id);
            await carregarComandas();
            toast.success('Item removido com sucesso');
        } catch (error) {
            console.error('Erro ao remover item', error);
            toast.error('Erro ao remover item');
        } finally {
            setLoadingAcao(false);
            setModalConfirmacao(null);
        }
    };

    const marcarEntregue = async (itemId) => {
        setLoadingAcao(true);
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
            setLoadingAcao(false);
        }
    };

    const fecharComanda = async () => {
        setModalFecharComanda(true);
    };

    const confirmarFecharComanda = async () => {
        setLoadingAcao(true);
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
            setLoadingAcao(false);
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
            <div className="pagination pagination-produtos">
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

    if (loadingInicial) {
        return (
            <div className="skeleton-container">
                <div className="page-header">
                    <div>
                        <h1>Mesas e Comandas</h1>
                        <p className="text-muted">Gerencie comandas e pedidos</p>
                    </div>
                </div>
                <div className="atendente-grid">
                    <div className="card">
                        <div className="skeleton-card" style={{ height: 60, minHeight: 60 }}></div>
                        <div className="skeleton-card" style={{ height: 50, minHeight: 50 }}></div>
                        <div className="skeleton-card" style={{ height: 300, minHeight: 300 }}></div>
                    </div>
                    <div className="card">
                        <div className="skeleton-card" style={{ height: 400, minHeight: 400 }}></div>
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
                    <h1>Mesas e Comandas</h1>
                    <p className="text-muted">Gerencie comandas e pedidos</p>
                </div>
            </div>

            <div className="atendente-grid">
                <div className="card comandas-list">
                    <h2>
                        <FiClipboard size={20} />
                        Comandas Abertas
                    </h2>
                    <div className="comanda-form">
                        <div className="comanda-inputs">
                            <input
                                type="number"
                                placeholder="Número"
                                value={numeroMesa}
                                onChange={(e) => setNumeroMesa(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Nome"
                                value={nomeCliente}
                                onChange={(e) => setNomeCliente(e.target.value)}
                            />
                            <button 
                                className="btn btn-primary" 
                                onClick={criarComanda} 
                                disabled={loadingAcao}
                            >
                                <FiPlus size={16} />
                                Adicionar
                            </button>
                        </div>
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

                <div className="card comanda-detalhes">
                    {!mostrarProdutos ? (
                        <div className="empty-state">
                            <FiClipboard size={48} />
                            <h3>Selecione uma comanda</h3>
                            <p className="text-muted">ou crie uma nova para começar</p>
                        </div>
                    ) : (
                        <>
                            <div className="comanda-header">
                                <h2>Mesa {comandaAtual?.numero_mesa}</h2>
                                <button 
                                    className="btn btn-danger" 
                                    onClick={fecharComanda} 
                                    disabled={loadingAcao}
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
                                        disabled={loadingAcao}
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
                                <p className="text-muted produtos-vazio">
                                    Nenhum produto encontrado
                                </p>
                            )}

                            <h3>Itens da Comanda</h3>
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
                                                <th>Obs</th>
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
                                                            <span className="status-badge" style={{ color: statusConfig.cor }}>
                                                                <StatusIcon size={14} />
                                                                {statusConfig.label}
                                                            </span>
                                                        </td>
                                                        <td>{item.observacao || '-'}</td>
                                                        <td>
                                                            <div className="acoes-comanda">
                                                                {statusAtual === 'pronto' && (
                                                                    <button 
                                                                        className="btn-icon btn-success" 
                                                                        onClick={() => marcarEntregue(item.id)}
                                                                        disabled={loadingAcao}
                                                                        title="Marcar como entregue"
                                                                    >
                                                                        <FiCheckCircle size={14} />
                                                                    </button>
                                                                )}
                                                                <button 
                                                                    className="btn-icon btn-delete" 
                                                                    onClick={() => removerItem(item.id)}
                                                                    disabled={loadingAcao}
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
                            <div className="comanda-total-footer">
                                <h3>Total: R$ {totalComanda.toFixed(2)}</h3>
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
                                <FiShoppingBag size={18} />
                                {produtoSelecionado.nome}
                            </h3>
                            <button className="modal-close" onClick={fecharModal}>
                                <FiX size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <p className="produto-preco-modal">
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
                            <button className="btn btn-primary" onClick={confirmarAdicionarItem} disabled={loadingAcao}>
                                <FiPlus size={16} />
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
                            <button className="btn btn-danger" onClick={confirmarRemocao} disabled={loadingAcao}>
                                <FiTrash2 size={16} />
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
                            <p className="text-muted">Esta ação não pode ser desfeita.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setModalFecharComanda(false)}>
                                Cancelar
                            </button>
                            <button className="btn btn-danger" onClick={confirmarFecharComanda} disabled={loadingAcao}>
                                <FiX size={16} />
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