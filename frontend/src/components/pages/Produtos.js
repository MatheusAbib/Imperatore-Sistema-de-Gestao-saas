import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiPackage, FiTag, FiDollarSign, FiSearch, FiX, FiAlertCircle, FiShoppingBag, FiCoffee } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Produtos() {
    const [produtos, setProdutos] = useState([]);
    const [ingredientes, setIngredientes] = useState([]);
    const [nome, setNome] = useState('');
    const [precoVenda, setPrecoVenda] = useState('');
    const [categoria, setCategoria] = useState('');
    const [editandoId, setEditandoId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [ingredienteId, setIngredienteId] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [busca, setBusca] = useState('');
    const [ingredientesProduto, setIngredientesProduto] = useState([]);
    const [modalConfirmacao, setModalConfirmacao] = useState(null);
    const [modalIngrediente, setModalIngrediente] = useState(null);
    const [categoriasExistentes, setCategoriasExistentes] = useState([]);
    const [modalRemoverIngrediente, setModalRemoverIngrediente] = useState(null);

    useEffect(() => {
        carregarProdutos();
        carregarIngredientes();
        carregarCategorias();
    }, []);

    const carregarProdutos = async () => {
        setLoading(true);
        try {
            const response = await api.get('/produtos');
            setProdutos(response.data);
        } catch (error) {
            console.error('Erro ao carregar produtos', error);
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

    const carregarCategorias = async () => {
        try {
            const response = await api.get('/produtos');
            const categorias = [...new Set(response.data.map(p => p.categoria).filter(c => c))];
            setCategoriasExistentes(categorias);
        } catch (error) {
            console.error('Erro ao carregar categorias', error);
        }
    };

    const carregarIngredientesDoProduto = async (produtoId) => {
        try {
            const response = await api.get(`/produtos/${produtoId}/ingredientes`);
            setIngredientesProduto(response.data);
        } catch (error) {
            console.error('Erro ao carregar ingredientes do produto', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nome || !precoVenda) {
            toast.warning('Preencha nome e preço de venda');
            return;
        }

        setLoading(true);
        try {
            if (editandoId) {
                await api.put(`/produtos/${editandoId}`, {
                    nome,
                    preco_venda: parseFloat(precoVenda),
                    categoria
                });
                toast.success('Produto atualizado com sucesso');
            } else {
                await api.post('/produtos', {
                    nome,
                    preco_venda: parseFloat(precoVenda),
                    categoria
                });
                toast.success('Produto criado com sucesso');
            }
            setNome('');
            setPrecoVenda('');
            setCategoria('');
            setEditandoId(null);
            setMostrarForm(false);
            carregarProdutos();
            carregarCategorias();
        } catch (error) {
            console.error('Erro ao salvar', error);
            toast.error('Erro ao salvar produto');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (produto) => {
        setNome(produto.nome);
        setPrecoVenda(produto.preco_venda);
        setCategoria(produto.categoria || '');
        setEditandoId(produto.id);
        setMostrarForm(true);
    };

    const handleDelete = async (id) => {
        const produto = produtos.find(p => p.id === id);
        setModalConfirmacao({
            id,
            nome: produto?.nome
        });
    };

    const confirmarExclusao = async () => {
        if (!modalConfirmacao) return;
        try {
            await api.delete(`/produtos/${modalConfirmacao.id}`);
            carregarProdutos();
            carregarCategorias();
            toast.success('Produto excluído com sucesso');
        } catch (error) {
            console.error('Erro ao deletar', error);
            toast.error('Erro ao excluir produto');
        } finally {
            setModalConfirmacao(null);
        }
    };

    const abrirModalIngrediente = async (produto) => {
        setModalIngrediente(produto);
        await carregarIngredientesDoProduto(produto.id);
    };

    const fecharModalIngrediente = () => {
        setModalIngrediente(null);
        setIngredienteId('');
        setQuantidade('');
        setIngredientesProduto([]);
    };

    const handleAdicionarIngrediente = async () => {
        if (!ingredienteId || !quantidade) {
            toast.warning('Selecione um ingrediente e informe a quantidade');
            return;
        }

        try {
            await api.post(`/produtos/${modalIngrediente.id}/ingredientes`, {
                ingrediente_id: parseInt(ingredienteId),
                quantidade: parseFloat(quantidade)
            });
            setIngredienteId('');
            setQuantidade('');
            carregarIngredientesDoProduto(modalIngrediente.id);
            carregarProdutos();
            toast.success('Ingrediente adicionado com sucesso');
        } catch (error) {
            console.error('Erro ao adicionar ingrediente', error);
            toast.error('Erro ao adicionar ingrediente');
        }
    };

    const handleLimparBusca = () => {
        setBusca('');
    };

    const handleRemoverIngrediente = (ingredienteId) => {
        const ingrediente = ingredientesProduto.find(ing => ing.id === ingredienteId);
        setModalRemoverIngrediente({
            ingredienteId,
            nome: ingrediente?.nome,
            produtoNome: modalIngrediente?.nome
        });
    };

    const confirmarRemocaoIngrediente = async () => {
        if (!modalRemoverIngrediente) return;
        try {
            await api.delete(`/produtos/${modalIngrediente.id}/ingredientes/${modalRemoverIngrediente.ingredienteId}`);
            carregarIngredientesDoProduto(modalIngrediente.id);
            carregarProdutos();
            toast.success('Ingrediente removido com sucesso');
        } catch (error) {
            console.error('Erro ao remover ingrediente', error);
            toast.error('Erro ao remover ingrediente');
        } finally {
            setModalRemoverIngrediente(null);
        }
    };

    const getMargemClass = (margem) => {
        if (margem >= 60) return 'margem-alta';
        if (margem >= 40) return 'margem-media';
        return 'margem-baixa';
    };

    const produtosFiltrados = produtos.filter(produto =>
        produto.nome.toLowerCase().includes(busca.toLowerCase()) ||
        (produto.categoria && produto.categoria.toLowerCase().includes(busca.toLowerCase()))
    );

    const ingredientesDisponiveis = ingredientes.filter(ing => 
        !ingredientesProduto.some(ip => ip.id === ing.id)
    );

    const getIcon = (produto) => {
        if (produto.categoria === 'Lanche') return <FiShoppingBag size={18} />;
        if (produto.categoria === 'Bebida') return <FiCoffee size={18} />;
        if (produto.categoria === 'Sobremesa') return <FiTag size={18} />;
        return <FiPackage size={18} />;
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} theme="dark" />

            <div className="page-header">
                <div>
                    <h1>Produtos</h1>
                    <p className="text-muted">Gerencie os produtos do seu cardápio</p>
                </div>
                <button 
                    className="btn btn-primary" 
                    onClick={() => { 
                        setMostrarForm(!mostrarForm); 
                        setEditandoId(null); 
                        setNome(''); 
                        setPrecoVenda(''); 
                        setCategoria(''); 
                    }}
                >
                    <FiPlus size={18} style={{ marginRight: 6 }} />
                    {mostrarForm ? 'Cancelar' : 'Novo Produto'}
                </button>
            </div>

            <div className="search-box">
                <FiSearch size={20} className="search-icon" />
                <input
                    type="text"
                    placeholder="Buscar produto por nome ou categoria..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                />
                {busca && (
                    <button 
                        className="search-clear"
                        onClick={handleLimparBusca}
                        title="Limpar busca"
                    >
                        <FiX size={18} />
                    </button>
                )}
            </div>

            {mostrarForm && (
                <div className="card">
                    <h2>{editandoId ? 'Editar Produto' : 'Novo Produto'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Nome</label>
                            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required placeholder="Ex: Risoto de Camarão" />
                        </div>
                        <div className="form-group">
                            <label>Preço de Venda (R$)</label>
                            <input type="number" step="0.01" value={precoVenda} onChange={(e) => setPrecoVenda(e.target.value)} required placeholder="Ex: 20.00" />
                        </div>
                        <div className="form-group">
                            <label>Categoria</label>
                            <input
                                type="text"
                                list="categoriasList"
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value)}
                                placeholder="Digite ou selecione uma categoria"
                            />
                            <datalist id="categoriasList">
                                {categoriasExistentes.map((cat, index) => (
                                    <option key={index} value={cat} />
                                ))}
                            </datalist>
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Salvando...' : (editandoId ? 'Atualizar' : 'Cadastrar')}
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={() => { setMostrarForm(false); setEditandoId(null); setNome(''); setPrecoVenda(''); setCategoria(''); }}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="card">
                {loading ? (
                    <div className="loading-state">Carregando produtos...</div>
                ) : (
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Produto</th>
                                    <th>Categoria</th>
                                    <th>Preço de Venda</th>
                                    <th>Custo de Preparo</th>
                                    <th>Lucro (R$)</th>
                                    <th>Margem de Lucro</th>
                                    <th className="text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {produtosFiltrados.map((produto) => (
                                    <tr key={produto.id}>
                                        <td>
                                            <div className="produto-info">
                                                <span className="produto-icon">{getIcon(produto)}</span>
                                                {produto.nome}
                                            </div>
                                        </td>
                                        <td><span className="badge">{produto.categoria || '-'}</span></td>
                                        <td className="text-strong">R$ {parseFloat(produto.preco_venda).toFixed(2).replace('.', ',')}</td>
                                        <td>R$ {parseFloat(produto.custo).toFixed(2).replace('.', ',')}</td>
                                 
                                        <td className={getMargemClass(parseFloat(produto.margem))}>
                                            R$ {(parseFloat(produto.preco_venda) - parseFloat(produto.custo)).toFixed(2).replace('.', ',')}
                                        </td>
                                        <td className={getMargemClass(parseFloat(produto.margem))}>
                                            {produto.margem}%
                                        </td>
                                        <td>
                                            <div className="acoes">
                                                <button 
                                                    className="btn-icon btn-edit" 
                                                    onClick={() => handleEdit(produto)}
                                                    title="Editar"
                                                >
                                                    <FiEdit2 size={16} />
                                                </button>
                                                <button 
                                                    className="btn-icon btn-delete" 
                                                    onClick={() => handleDelete(produto.id)}
                                                    title="Excluir"
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                                <button 
                                                    className="btn-icon btn-ingrediente" 
                                                    onClick={() => abrirModalIngrediente(produto)}
                                                    title="Gerenciar Ingredientes"
                                                >
                                                    <FiPackage size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {produtosFiltrados.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="text-center text-muted">
                                            <FiPackage size={32} />
                                            <p>Nenhum produto encontrado</p>
                                            <span>Cadastre seu primeiro produto</span>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

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
                            <p>Tem certeza que deseja excluir o produto <strong>"{modalConfirmacao.nome}"</strong>?</p>
                            <p className="text-muted">Esta ação não pode ser desfeita.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setModalConfirmacao(null)}>
                                Cancelar
                            </button>
                            <button className="btn btn-danger" onClick={confirmarExclusao}>
                                <FiTrash2 size={16} />
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {modalIngrediente && (
                <div className="modal-overlay">
                    <div className="modal modal-large">
                        <div className="modal-header">
                            <h3>Ingredientes de {modalIngrediente.nome}</h3>
                            <button className="modal-close" onClick={fecharModalIngrediente}>
                                <FiX size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            {ingredientesProduto.length > 0 ? (
                                <div className="table-responsive">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Ingrediente</th>
                                                <th>Quantidade</th>
                                                <th>Unidade</th>
                                                <th>Custo (R$)</th>
                                                <th className="text-center">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ingredientesProduto.map(ing => (
                                                <tr key={ing.id}>
                                                    <td>{ing.nome}</td>
                                                    <td>{ing.quantidade}</td>
                                                    <td>{ing.unidade}</td>
                                                    <td style={{ fontWeight: 'bold', color: 'var(--green)' }}>
                                                        R$ {((ing.custo_medio / (ing.fator_conversao || 1)) * ing.quantidade).toFixed(2).replace('.', ',')}
                                                    </td>
                                                    <td>
                                                        <button 
                                                            className="btn-icon btn-delete" 
                                                            onClick={() => handleRemoverIngrediente(ing.id)}
                                                            title="Remover"
                                                        >
                                                            <FiTrash2 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-muted">Nenhum ingrediente adicionado</p>
                            )}

                            <div className="add-ingrediente">
                                <h4>Adicionar Ingrediente</h4>
                                <div className="add-ingrediente-form">
                                    <select 
                                        value={ingredienteId} 
                                        onChange={(e) => setIngredienteId(e.target.value)}
                                    >
                                        <option value="">Selecione um ingrediente</option>
                                        {ingredientesDisponiveis.map(ing => (
                                            <option key={ing.id} value={ing.id}>
                                                {ing.nome} (R$ {(parseFloat(ing.custo_medio) / (parseFloat(ing.fator_conversao) || 1)).toFixed(2).replace('.', ',')} / {ing.unidade_uso || ing.unidade})
                                            </option>
                                        ))}
                                    </select>
                                    <input 
                                        type="number" 
                                        step="0.01" 
                                        placeholder="Quantidade" 
                                        value={quantidade} 
                                        onChange={(e) => setQuantidade(e.target.value)} 
                                    />
                                    <button className="btn btn-primary" onClick={handleAdicionarIngrediente}>
                                        <FiPlus size={16} />
                                        Adicionar
                                    </button>
                                </div>
                                {ingredientesDisponiveis.length === 0 && (
                                    <p className="text-muted">Todos os ingredientes já foram adicionados.</p>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={fecharModalIngrediente}>
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {modalRemoverIngrediente && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>Confirmar Remoção</h3>
                            <button className="modal-close" onClick={() => setModalRemoverIngrediente(null)}>
                                <FiX size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <FiAlertCircle size={32} className="modal-icon-warning" />
                            <p>
                                Tem certeza que deseja remover <strong>"{modalRemoverIngrediente.nome}"</strong> 
                                do produto <strong>"{modalRemoverIngrediente.produtoNome}"</strong>?
                            </p>
                            <p className="text-muted">Esta ação não pode ser desfeita.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setModalRemoverIngrediente(null)}>
                                Cancelar
                            </button>
                            <button className="btn btn-danger" onClick={confirmarRemocaoIngrediente}>
                                <FiTrash2 size={16} />
                                Remover
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Produtos;