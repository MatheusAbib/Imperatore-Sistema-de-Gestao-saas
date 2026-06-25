import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FiPlus, FiTrash2, FiPackage, FiBox, FiSearch, FiX, FiAlertCircle, FiChevronLeft, FiChevronRight, FiFilter } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Lotes() {
    const [lotes, setLotes] = useState([]);
    const [ingredientes, setIngredientes] = useState([]);
    const [ingredienteId, setIngredienteId] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [dataValidade, setDataValidade] = useState('');
    const [loteNome, setLoteNome] = useState('');
    const [loading, setLoading] = useState(false);
    const [ingredienteSelecionado, setIngredienteSelecionado] = useState(null);
    const [lotesIngrediente, setLotesIngrediente] = useState([]);
    const [unidadeSelecionada, setUnidadeSelecionada] = useState('');
    const [modalConfirmacao, setModalConfirmacao] = useState(null);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [modalNovoLote, setModalNovoLote] = useState(false);
    const [filtroIngrediente, setFiltroIngrediente] = useState('');
    const [dataCompra, setDataCompra] = useState('');
    const [buscaIngrediente, setBuscaIngrediente] = useState('');    
    const [paginaTodos, setPaginaTodos] = useState(1);
    const [paginaIngrediente, setPaginaIngrediente] = useState(1);
    const itensPorPagina = 8;

useEffect(() => {
    carregarLotes();
    carregarIngredientes();

    const handleReload = () => {
        carregarLotes();
        carregarIngredientes();
    };

    window.addEventListener('reloadData', handleReload);
    return () => window.removeEventListener('reloadData', handleReload);
}, []);

    const carregarLotes = async () => {
        setLoading(true);
        try {
            const response = await api.get('/lotes');
            setLotes(response.data);
        } catch (error) {
            console.error('Erro ao carregar lotes', error);
        } finally {
            setLoading(false);
        }
    };

    const carregarIngredientes = async () => {
        setLoading(true);
        try {
            const response = await api.get('/ingredientes');
            setIngredientes(response.data);
        } catch (error) {
            console.error('Erro ao carregar ingredientes', error);
        } finally {
            setLoading(false);
        }
    };

    const carregarLotesPorIngrediente = async (id) => {
        try {
            const response = await api.get(`/lotes/ingrediente/${id}`);
            setLotesIngrediente(response.data);
            setPaginaIngrediente(1);
        } catch (error) {
            console.error('Erro ao carregar lotes do ingrediente', error);
        }
    };

    const handleIngredienteChange = (e) => {
        const id = e.target.value;
        setIngredienteId(id);
        const ingrediente = ingredientes.find(ing => ing.id == id);
        setUnidadeSelecionada(ingrediente ? ingrediente.unidade : '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!ingredienteId || !quantidade || !dataValidade) {
            toast.warning('Preencha todos os campos obrigatórios');
            return;
        }

        setLoading(true);
        try {
            await api.post('/lotes', {
                ingrediente_id: parseInt(ingredienteId),
                quantidade: parseFloat(quantidade),
                data_validade: dataValidade,
                data_compra: dataCompra || null,
                lote: loteNome || null
            });
            setIngredienteId('');
            setQuantidade('');
            setDataValidade('');
            setLoteNome('');
            setUnidadeSelecionada('');
            setDataCompra('');
            setModalNovoLote(false);
            setMostrarForm(false);
            await carregarLotes();
            if (ingredienteSelecionado) {
                await carregarLotesPorIngrediente(ingredienteSelecionado);
            }
            toast.success('Lote registrado com sucesso!');
        } catch (error) {
            console.error('Erro ao registrar lote', error);
            toast.error('Erro ao registrar lote');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const loteEncontrado = [...lotes, ...lotesIngrediente].find(l => l.id === id);
        setModalConfirmacao({
            id,
            nome: loteEncontrado?.ingrediente_nome || 'lote',
            lote: loteEncontrado?.lote || 'N/A'
        });
    };

    const confirmarExclusao = async () => {
        if (!modalConfirmacao) return;
        setLoading(true);
        try {
            await api.delete(`/lotes/${modalConfirmacao.id}`);
            await carregarLotes();
            if (ingredienteSelecionado) {
                await carregarLotesPorIngrediente(ingredienteSelecionado);
            }
            toast.success('Lote excluído com sucesso');
        } catch (error) {
            console.error('Erro ao deletar lote', error);
            toast.error('Erro ao excluir lote');
        } finally {
            setLoading(false);
            setModalConfirmacao(null);
        }
    };

    const getDiasRestantes = (dataValidade) => {
        const hoje = new Date();
        const validade = new Date(dataValidade);
        const diffTime = validade - hoje;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getStatusCor = (dias) => {
        if (dias < 0) return '#dc3545';
        if (dias === 0) return '#ffc107';
        if (dias <= 7) return '#fd7e14';
        return '#28a745';
    };

    const getStatusTexto = (dias) => {
        if (dias < 0) return 'Vencido';
        if (dias === 0) return 'Vence hoje';
        if (dias <= 7) return 'Vence em breve';
        return 'OK';
    };

    const lotesFiltrados = filtroIngrediente 
        ? lotes.filter(l => l.ingrediente_id === parseInt(filtroIngrediente))
        : lotes;

    const lotesPaginados = lotesFiltrados.slice(
        (paginaTodos - 1) * itensPorPagina,
        paginaTodos * itensPorPagina
    );

    const lotesIngredientePaginados = lotesIngrediente.slice(
        (paginaIngrediente - 1) * itensPorPagina,
        paginaIngrediente * itensPorPagina
    );

    const Paginacao = ({ pagina, total, onChange }) => {
        const totalPaginas = Math.ceil(total / itensPorPagina);
        if (totalPaginas <= 1) return null;

        return (
            <div className="paginacao-lotes">
                <button
                    className="btn btn-secondary"
                    onClick={() => onChange(pagina - 1)}
                    disabled={pagina <= 1}
                >
                    <FiChevronLeft size={16} />
                </button>
                <span>Página {pagina} de {totalPaginas}</span>
                <button
                    className="btn btn-secondary"
                    onClick={() => onChange(pagina + 1)}
                    disabled={pagina >= totalPaginas}
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
                    <h1>Lotes</h1>
                    <p className="text-muted">Gerencie o estoque por lotes e validade</p>
                </div>
            </div>

<div className="card">
    <h2 class="lotes-todos-title"><FiBox size={20} /> Controle de Estoque por Lote</h2>
    
    {loading ? (
        <div className="skeleton-container">
            <div className="skeleton-card" style={{ height: 50, minHeight: 50 }}></div>
            <div className="skeleton-card" style={{ height: 300, minHeight: 300 }}></div>
        </div>
    ) : (
        <>
            <div className="search-box">
                <FiSearch size={20} className="search-icon" />
                <input
                    type="text"
                    placeholder="Buscar ingrediente..."
                    value={buscaIngrediente}
                    onChange={(e) => setBuscaIngrediente(e.target.value)}
                />
                {buscaIngrediente && (
                    <button className="search-clear" onClick={() => setBuscaIngrediente('')} title="Limpar busca">
                        <FiX size={18} />
                    </button>
                )}
            </div>
            
            <div className="lotes-container">
                <div className="lotes-ingredientes-list">
                    {ingredientes
                        .filter(ing => ing.nome.toLowerCase().includes(buscaIngrediente.toLowerCase()))
                        .map(ing => {
                            const lotesIng = lotes.filter(l => l.ingrediente_id === ing.id);
                            const totalEstoque = lotesIng.reduce((sum, l) => sum + (parseFloat(l.quantidade) || 0), 0);
                            
                            return (
                                <div
                                    key={ing.id}
                                    className={`lotes-ingrediente-item ${ingredienteSelecionado === ing.id ? 'selected' : ''}`}
                                    onClick={async () => {
                                        setIngredienteSelecionado(ing.id);
                                        await carregarLotesPorIngrediente(ing.id);
                                    }}
                                >
                                    <strong>{ing.nome}</strong>
                                    <br />
                                    <small className="text-muted">
                                        Estoque: {totalEstoque.toFixed(2)} {ing.unidade}
                                    </small>
                                </div>
                            );
                        })
                    }
                </div>

                <div>
                    <div className="lotes-header">
                        <h3>Lotes</h3>
                        {ingredienteSelecionado && (
                            <button 
                                className="btn btn-primary btn-novo-lote"
                                onClick={() => {
                                    const ingrediente = ingredientes.find(ing => ing.id === ingredienteSelecionado);
                                    setIngredienteId(ingredienteSelecionado);
                                    setUnidadeSelecionada(ingrediente?.unidade || '');
                                    setDataCompra('');
                                    setModalNovoLote(true);
                                    setMostrarForm(false);
                                }}
                            >
                                <FiPlus size={16} />
                                Novo Lote
                            </button>
                        )}
                    </div>
                    {lotesIngrediente.length === 0 ? (
                        <p className="text-muted">Selecione um ingrediente para ver os lotes</p>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Lote</th>
                                            <th>Quantidade</th>
                                            <th>Data Compra</th>
                                            <th>Validade</th>
                                            <th>Status</th>
                                            <th className="text-center">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lotesIngredientePaginados.map(lote => {
                                            const dias = getDiasRestantes(lote.data_validade);
                                            return (
                                                <tr key={lote.id}>
                                                    <td>{lote.lote || 'N/A'}</td>
                                                    <td>{lote.quantidade} {unidadeSelecionada}</td>
                                                    <td>{lote.data_compra ? new Date(lote.data_compra).toLocaleDateString('pt-BR') : '-'}</td>
                                                    <td>{new Date(lote.data_validade).toLocaleDateString('pt-BR')}</td>
                                                    <td style={{ color: getStatusCor(dias), fontWeight: 'bold' }}>
                                                        {getStatusTexto(dias)} ({dias} dias)
                                                    </td>
                                                    <td>
                                                        <div className="acoes">
                                                            <button 
                                                                className="btn-icon btn-delete" 
                                                                onClick={() => handleDelete(lote.id)}
                                                                title="Excluir"
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
                            <Paginacao 
                                pagina={paginaIngrediente}
                                total={lotesIngrediente.length}
                                onChange={setPaginaIngrediente}
                            />
                        </>
                    )}
                </div>
            </div>
        </>
    )}
</div>
<div className="card">
    <h2 className="lotes-todos-title">
        <FiBox size={20} />
        Todos os Lotes
    </h2>
    
    {loading ? (
        <div className="skeleton-container">
            <div className="skeleton-card" style={{ height: 50, minHeight: 50 }}></div>
            <div className="skeleton-table"></div>
        </div>
    ) : (
        <>
            <div className="lotes-filtros">
                <div className="lotes-filtro-select">
                    <select 
                        value={filtroIngrediente} 
                        onChange={(e) => {
                            setFiltroIngrediente(e.target.value);
                            setPaginaTodos(1);
                        }}
                    >
                        <option value="">Todos os ingredientes</option>
                        {ingredientes.map(ing => (
                            <option key={ing.id} value={ing.id}>{ing.nome}</option>
                        ))}
                    </select>
                </div>
                <span className="lotes-count">
                    {lotesFiltrados.length} lotes encontrados
                </span>
            </div>

            <div className="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Ingrediente</th>
                            <th>Lote</th>
                            <th>Quantidade</th>
                            <th>Data Compra</th>
                            <th>Validade</th>
                            <th>Status</th>
                            <th className="text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lotesPaginados.map(lote => {
                            const dias = getDiasRestantes(lote.data_validade);
                            return (
                                <tr key={lote.id}>
                                    <td>
                                        <div className="produto-info">
                                            <span className="produto-icon"><FiPackage size={18} /></span>
                                            {lote.ingrediente_nome}
                                        </div>
                                    </td>
                                    <td>{lote.lote || 'N/A'}</td>
                                    <td>{lote.quantidade} {lote.unidade}</td>
                                    <td>{lote.data_compra ? new Date(lote.data_compra).toLocaleDateString('pt-BR') : '-'}</td>
                                    <td>{new Date(lote.data_validade).toLocaleDateString('pt-BR')}</td>
                                    <td style={{ color: getStatusCor(dias), fontWeight: 'bold' }}>
                                        {getStatusTexto(dias)} ({dias} dias)
                                    </td>
                                    <td>
                                        <div className="acoes">
                                            <button 
                                                className="btn-icon btn-delete" 
                                                onClick={() => handleDelete(lote.id)}
                                                title="Excluir"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {lotesFiltrados.length === 0 && (
                            <tr>
                                <td colSpan="7" className="text-center text-muted">
                                    <FiBox size={32} />
                                    <p>Nenhum lote encontrado</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <Paginacao 
                pagina={paginaTodos}
                total={lotesFiltrados.length}
                onChange={setPaginaTodos}
            />
        </>
    )}
</div>
            {modalNovoLote && (
                <div className="modal-overlay" onClick={() => setModalNovoLote(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Registrar Novo Lote</h3>
                            <button className="modal-close" onClick={() => {
                                setModalNovoLote(false);
                                setDataCompra('');
                            }}>
                                <FiX size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Ingrediente *</label>
                                    <select value={ingredienteId} onChange={handleIngredienteChange} required>
                                        <option value="">Selecione um ingrediente</option>
                                        {ingredientes.map(ing => (
                                            <option key={ing.id} value={ing.id}>{ing.nome} ({ing.unidade})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Quantidade *</label>
                                    <div className="quantidade-wrapper">
                                        <input 
                                            type="number" 
                                            step="0.01" 
                                            value={quantidade} 
                                            onChange={(e) => setQuantidade(e.target.value)} 
                                            required 
                                            placeholder="Digite a quantidade"
                                        />
                                        <span className="unidade-badge">
                                            {unidadeSelecionada || '?'}
                                        </span>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Data de Compra (opcional)</label>
                                    <input type="date" value={dataCompra} onChange={(e) => setDataCompra(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Data de Validade *</label>
                                    <input type="date" value={dataValidade} onChange={(e) => setDataValidade(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>Identificador do Lote (opcional)</label>
                                    <input type="text" value={loteNome} onChange={(e) => setLoteNome(e.target.value)} placeholder="Ex: LOTE001, Fornecedor X" />
                                </div>
                                <div className="lote-botoes">
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? 'Registrando...' : 'Registrar Lote'}
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={() => {
                                        setModalNovoLote(false);
                                        setDataCompra('');
                                    }}>
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {modalConfirmacao && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>Confirmar Exclusão</h3>
                            <button className="modal-close" onClick={() => setModalConfirmacao(null)}>
                                <FiX size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <FiAlertCircle size={32} className="modal-icon-warning" />
                            <p>
                                Tem certeza que deseja excluir
                                <br />
                                <strong>"{modalConfirmacao.nome}"</strong>, 
                                lote: <strong>"{modalConfirmacao.lote}"</strong>?
                            </p>
                            <p className="text-muted">Esta ação não pode ser desfeita.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setModalConfirmacao(null)}>
                                Cancelar
                            </button>
                            <button className="btn btn-danger" onClick={confirmarExclusao} disabled={loading}>
                                <FiTrash2 size={16} />
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Lotes;