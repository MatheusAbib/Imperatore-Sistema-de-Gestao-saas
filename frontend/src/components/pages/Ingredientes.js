import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiPackage, FiSearch, FiX, FiAlertCircle } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Ingredientes() {
    const [ingredientes, setIngredientes] = useState([]);
    const [nome, setNome] = useState('');
    const [unidade, setUnidade] = useState('un');
    const [custoMedio, setCustoMedio] = useState('');
    const [fatorConversao, setFatorConversao] = useState('1');
    const [unidadeUso, setUnidadeUso] = useState('');
    const [editandoId, setEditandoId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [busca, setBusca] = useState('');
    const [modalEdicao, setModalEdicao] = useState(false);
    const [modalConfirmacao, setModalConfirmacao] = useState(null);

    const unidades = [
        { valor: 'un', label: 'Unidade (un)' },
        { valor: 'kg', label: 'Quilograma (kg)' },
        { valor: 'g', label: 'Grama (g)' },
        { valor: 'l', label: 'Litro (l)' },
        { valor: 'ml', label: 'Mililitro (ml)' },
        { valor: 'cx', label: 'Caixa (cx)' },
        { valor: 'pct', label: 'Pacote (pct)' },
        { valor: 'lata', label: 'Lata' },
        { valor: 'garrafa', label: 'Garrafa' },
        { valor: 'porcao', label: 'Porção' }
    ];

useEffect(() => {
    carregarIngredientes();

    const handleReload = () => {
        carregarIngredientes();
    };

    window.addEventListener('reloadData', handleReload);
    return () => window.removeEventListener('reloadData', handleReload);
}, []);

    const carregarIngredientes = async () => {
        setLoading(true);
        try {
            const response = await api.get('/ingredientes');
            setIngredientes(response.data);
        } catch (error) {
            console.error('Erro ao carregar ingredientes', error);
            toast.error('Erro ao carregar ingredientes');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nome || !unidade) {
            toast.warning('Preencha nome e unidade');
            return;
        }

        if (parseFloat(fatorConversao) <= 0) {
            toast.warning('O fator de conversão deve ser maior que 0');
            return;
        }

        setLoading(true);
        try {
            const dados = {
                nome,
                unidade,
                custo_medio: parseFloat(custoMedio) || 0,
                fator_conversao: parseFloat(fatorConversao) || 1,
                unidade_uso: unidadeUso || unidade
            };

            if (editandoId) {
                await api.put(`/ingredientes/${editandoId}`, dados);
                toast.success('Ingrediente atualizado com sucesso');
            } else {
                await api.post('/ingredientes', dados);
                toast.success('Ingrediente criado com sucesso');
            }
            setNome('');
            setUnidade('un');
            setCustoMedio('');
            setFatorConversao('1');
            setUnidadeUso('');
            setEditandoId(null);
            setModalEdicao(false);
            carregarIngredientes();
        } catch (error) {
            console.error('Erro ao salvar', error);
            toast.error('Erro ao salvar ingrediente');
        } finally {
            setLoading(false);
        }
    };

    const abrirModalEdicao = (ingrediente = null) => {
        if (ingrediente) {
            setNome(ingrediente.nome);
            setUnidade(ingrediente.unidade);
            setCustoMedio(ingrediente.custo_medio);
            setFatorConversao(ingrediente.fator_conversao || '1');
            setUnidadeUso(ingrediente.unidade_uso || ingrediente.unidade);
            setEditandoId(ingrediente.id);
        } else {
            setNome('');
            setUnidade('un');
            setCustoMedio('');
            setFatorConversao('1');
            setUnidadeUso('');
            setEditandoId(null);
        }
        setModalEdicao(true);
    };

    const fecharModalEdicao = () => {
        setModalEdicao(false);
        setNome('');
        setUnidade('un');
        setCustoMedio('');
        setFatorConversao('1');
        setUnidadeUso('');
        setEditandoId(null);
    };

    const handleDelete = async (id) => {
        const ing = ingredientes.find(i => i.id === id);
        setModalConfirmacao({ id, nome: ing?.nome });
    };

    const confirmarExclusao = async () => {
        if (!modalConfirmacao) return;
        try {
            await api.delete(`/ingredientes/${modalConfirmacao.id}`);
            carregarIngredientes();
            toast.success('Ingrediente excluído com sucesso');
        } catch (error) {
            console.error('Erro ao deletar', error);
            toast.error('Erro ao excluir ingrediente');
        } finally {
            setModalConfirmacao(null);
        }
    };

    const ingredientesFiltrados = ingredientes.filter(ingrediente =>
        ingrediente.nome.toLowerCase().includes(busca.toLowerCase())
    );

    const getCustoUso = (ingrediente) => {
        const custo = parseFloat(ingrediente.custo_medio) || 0;
        const fator = parseFloat(ingrediente.fator_conversao) || 1;
        return (custo / fator).toFixed(2).replace('.', ',');
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} theme="dark" />

            <div className="page-header">
                <div>
                    <h1>Ingredientes</h1>
                    <p className="text-muted">Gerencie os ingredientes do seu estoque</p>
                </div>
                <button 
                    className="btn btn-primary" 
                    onClick={() => abrirModalEdicao()}
                >
                    <FiPlus size={18} style={{ marginRight: 6 }} />
                    Novo Ingrediente
                </button>
            </div>

<div className="card">
    {loading ? (
        <div className="skeleton-container">
            <div className="skeleton-card" style={{ height: 50, minHeight: 50 }}></div>
            <div className="skeleton-table"></div>
        </div>
    ) : (
        <>
            <div className="search-box">
                <FiSearch size={20} className="search-icon" />
                <input
                    type="text"
                    placeholder="Buscar ingrediente por nome..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                />
                {busca && (
                    <button className="search-clear" onClick={() => setBusca('')} title="Limpar busca">
                        <FiX size={18} />
                    </button>
                )}
            </div>
            <div className="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Ingrediente</th>
                            <th>Unidade</th>
                            <th>Custo de Compra</th>
                            <th>Custo Unitário</th>
                            <th className="text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ingredientesFiltrados.map((ing) => (
                            <tr key={ing.id}>
                                <td>
                                    <div className="produto-info">
                                        <span className="produto-icon"><FiPackage size={18} /></span>
                                        {ing.nome}
                                    </div>
                                </td>
                                <td>{ing.unidade}</td>
                                <td>R$ {parseFloat(ing.custo_medio).toFixed(2)}</td>
                                <td>
                                    <span style={{ fontWeight: 'bold'}}>
                                        R$ {getCustoUso(ing)} / {ing.unidade_uso || ing.unidade}
                                    </span>
                                </td>
                                <td>
                                    <div className="acoes">
                                        <button className="btn-icon btn-edit" onClick={() => abrirModalEdicao(ing)} title="Editar">
                                            <FiEdit2 size={16} />
                                        </button>
                                        <button className="btn-icon btn-delete" onClick={() => handleDelete(ing.id)} title="Excluir">
                                            <FiTrash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {ingredientesFiltrados.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center text-muted">
                                    <FiPackage size={32} />
                                    <p>Nenhum ingrediente encontrado</p>
                                    <span>Cadastre seu primeiro ingrediente</span>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )}
</div>
            {modalEdicao && (
                <div className="modal-overlay" onClick={fecharModalEdicao}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editandoId ? 'Editar Ingrediente' : 'Novo Ingrediente'}</h3>
                            <button className="modal-close" onClick={fecharModalEdicao}>
                                <FiX size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Nome</label>
                                    <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required placeholder="Ex: Pão Francês"/>
                                </div>
                                <div className="form-group">
                                    <label>Unidade (como você compra)</label>
                                    <select value={unidade} onChange={(e) => setUnidade(e.target.value)} required>
                                        {unidades.map(u => (
                                            <option key={u.valor} value={u.valor}>{u.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Custo da compra (R$)</label>
                                    <input type="number" step="0.01" value={custoMedio} onChange={(e) => setCustoMedio(e.target.value)} placeholder="Ex: 30.00" />
                                </div>
                                <div className="form-group" style={{ border: '1px solid var(--border-color)', borderRadius: 8, padding: 16, backgroundColor: 'var(--bg-hover)' }}>
                                    <label style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                                        Conversão para uso na receita
                                    </label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 8 }}>
                                        <div>
                                            <label style={{ fontSize: 13 }}>1 {unidade} equivale a</label>
                                            <input 
                                                type="number" 
                                                step="0.01" 
                                                value={fatorConversao} 
                                                onChange={(e) => setFatorConversao(e.target.value)} 
                                                placeholder="Ex: 5"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: 13 }}>Unidade de uso</label>
                                            <select 
                                                value={unidadeUso} 
                                                onChange={(e) => setUnidadeUso(e.target.value)}
                                                style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border-color)' }}
                                            >
                                                {unidades.map(u => (
                                                    <option key={u.valor} value={u.valor}>{u.label}</option>
                                                ))}
                                            </select>
                                            <small style={{ color: 'var(--text-muted)' }}>Como você usa na receita</small>
                                        </div>
                                    </div>
                                    {custoMedio && fatorConversao && parseFloat(fatorConversao) > 0 && (
                                        <div style={{ marginTop: 12, color: 'var(--green)', fontWeight: 'bold' }}>
                                            Custo por unidade de uso: R$ {(parseFloat(custoMedio) / parseFloat(fatorConversao)).toFixed(2).replace('.', ',')}
                                        </div>
                                    )}
                                    {custoMedio && fatorConversao && parseFloat(fatorConversao) <= 0 && (
                                        <div style={{ marginTop: 12, color: 'var(--red)' }}>
                                            Fator de conversão deve ser maior que 0
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? 'Salvando...' : (editandoId ? 'Atualizar' : 'Cadastrar')}
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={fecharModalEdicao}>
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
                            <p>Tem certeza que deseja excluir o ingrediente <strong>"{modalConfirmacao.nome}"</strong>?</p>
                            <p className="text-muted">Esta ação não pode ser desfeita.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setModalConfirmacao(null)}>Cancelar</button>
                            <button className="btn btn-danger" onClick={confirmarExclusao}><FiTrash2 size={16} /> Excluir</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Ingredientes;