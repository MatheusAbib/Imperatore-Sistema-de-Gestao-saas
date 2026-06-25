import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FiSearch, FiCoffee, FiList, FiGrid, FiTag, FiDollarSign, FiX } from 'react-icons/fi';

function Cardapio() {
    const [produtos, setProdutos] = useState([]);
    const [busca, setBusca] = useState('');
    const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [visualizacao, setVisualizacao] = useState('grid');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        carregarProdutos();
    }, []);

    const carregarProdutos = async () => {
        setLoading(true);
        try {
            const response = await api.get('/produtos');
            setProdutos(response.data);
            const cats = [...new Set(response.data.map(p => p.categoria).filter(c => c))];
            setCategorias(cats);
        } catch (error) {
            console.error('Erro ao carregar produtos', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLimparBusca = () => {
        setBusca('');
    };

    const produtosFiltrados = produtos.filter(p => {
        const matchNome = p.nome.toLowerCase().includes(busca.toLowerCase());
        const matchCategoria = categoriaSelecionada ? p.categoria === categoriaSelecionada : true;
        return matchNome && matchCategoria;
    });

    const getIcon = (produto) => {
        if (produto.categoria === 'Lanche') return <FiCoffee size={28} />;
        if (produto.categoria === 'Bebida') return <FiDollarSign size={28} />;
        if (produto.categoria === 'Sobremesa') return <FiTag size={28} />;
        return <FiList size={28} />;
    };

    if (loading) {
        return (
            <div className="skeleton-container">
                <div className="page-header">
                    <div>
                        <h1>Cardápio</h1>
                        <p className="text-muted">Consulte produtos e preços do estabelecimento</p>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                        <div className="skeleton-card" style={{ width: 40, height: 40, minHeight: 40 }}></div>
                        <div className="skeleton-card" style={{ width: 40, height: 40, minHeight: 40 }}></div>
                    </div>
                </div>
                <div className="skeleton-card" style={{ height: 50, minHeight: 50 }}></div>
                <div className="skeleton-card" style={{ height: 50, minHeight: 50 }}></div>
                <div className="card">
                    <div className="skeleton-container">
                        <div className="skeleton-card" style={{ height: 30, minHeight: 30, maxWidth: 150 }}></div>
                        <div className="cardapio-grid">
                            <div className="skeleton-card" style={{ height: 120, minHeight: 120 }}></div>
                            <div className="skeleton-card" style={{ height: 120, minHeight: 120 }}></div>
                            <div className="skeleton-card" style={{ height: 120, minHeight: 120 }}></div>
                            <div className="skeleton-card" style={{ height: 120, minHeight: 120 }}></div>
                            <div className="skeleton-card" style={{ height: 120, minHeight: 120 }}></div>
                            <div className="skeleton-card" style={{ height: 120, minHeight: 120 }}></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1>Cardápio</h1>
                    <p className="text-muted">Consulte produtos e preços do estabelecimento</p>
                </div>
                <div className="view-toggle">
                    <button 
                        className={visualizacao === 'grid' ? 'btn btn-primary' : 'btn btn-secondary'}
                        onClick={() => setVisualizacao('grid')}
                    >
                        <FiGrid size={18} />
                    </button>
                    <button 
                        className={visualizacao === 'list' ? 'btn btn-primary' : 'btn btn-secondary'}
                        onClick={() => setVisualizacao('list')}
                    >
                        <FiList size={18} />
                    </button>
                </div>
            </div>

            <div className="search-box">
                <FiSearch size={20} className="search-icon" />
                <input
                    type="text"
                    placeholder="Buscar produto..."
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

            {categorias.length > 0 && (
                <div className="filter-group">
                    <button
                        className={categoriaSelecionada === '' ? 'btn btn-primary' : 'btn btn-secondary'}
                        onClick={() => setCategoriaSelecionada('')}
                    >
                        Todos
                    </button>
                    {categorias.map(cat => (
                        <button
                            key={cat}
                            className={categoriaSelecionada === cat ? 'btn btn-primary' : 'btn btn-secondary'}
                            onClick={() => setCategoriaSelecionada(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            )}

            <div className="card">
                <div className="cardapio-header">
                    <span className="produtos-count">{produtosFiltrados.length} produtos encontrados</span>
                </div>

                {visualizacao === 'grid' ? (
                    <div className="cardapio-grid">
                        {produtosFiltrados.map(produto => (
                            <div key={produto.id} className="cardapio-item">
                                <h3>{produto.nome}</h3>
                                {produto.categoria && (
                                    <span className="badge">{produto.categoria}</span>
                                )}
                                <p className="cardapio-preco">
                                    R$ {parseFloat(produto.preco_venda).toFixed(2)}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="cardapio-list">
                        {produtosFiltrados.map(produto => (
                            <div key={produto.id} className="cardapio-list-item">
                                <div className="cardapio-list-info">
                                    <span className="cardapio-list-icon">{getIcon(produto)}</span>
                                    <div>
                                        <h4>{produto.nome}</h4>
                                        {produto.categoria && (
                                            <span className="badge">{produto.categoria}</span>
                                        )}
                                    </div>
                                </div>
                                <p className="cardapio-list-preco">
                                    R$ {parseFloat(produto.preco_venda).toFixed(2)}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {produtosFiltrados.length === 0 && (
                    <div className="empty-state">
                        <FiSearch size={48} />
                        <h3>Nenhum produto encontrado</h3>
                        <p className="text-muted">Tente ajustar sua busca ou categoria</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Cardapio;