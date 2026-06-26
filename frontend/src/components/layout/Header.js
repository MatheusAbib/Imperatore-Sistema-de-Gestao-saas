import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { FiServer, FiMenu, FiX } from 'react-icons/fi';

import { 
    FiHome, 
    FiPackage, 
    FiBox, 
    FiClipboard, 
    FiFileText, 
    FiUsers, 
    FiGrid,
    FiCoffee, 
    FiBell, 
    FiUser, 
    FiSettings, 
    FiLogOut,
    FiShoppingBag,
    FiCalendar,
    FiCheckCircle,
    FiTrash2,
    FiBellOff,
    FiAlertCircle,
    FiInfo,
    FiBarChart2,
    FiClock 
} from 'react-icons/fi';

function Header({ setPagina, paginaAtual }) {
    const { usuario, logout } = useAuth();
    const [notificacoes, setNotificacoes] = useState([]);
    const [mostrarNotificacoes, setMostrarNotificacoes] = useState(false);
    const [modalLogout, setModalLogout] = useState(false);
    const [menuAberto, setMenuAberto] = useState(false);

    useEffect(() => {
        if (usuario) {
            carregarNotificacoes();
            const interval = setInterval(carregarNotificacoes, 10000);
            return () => clearInterval(interval);
        }
    }, [usuario]);

    const carregarNotificacoes = async () => {
        try {
            const response = await api.get('/notificacoes');
            const naoLidas = response.data.filter(n => n.lida === 0);
            setNotificacoes(naoLidas);
        } catch (error) {
            console.error('Erro ao carregar notificacoes', error);
        }
    };

    const marcarTodasComoLidas = async () => {
        try {
            await api.put('/notificacoes/lidas');
            setNotificacoes([]);
            setMostrarNotificacoes(false);
        } catch (error) {
            console.error('Erro ao marcar notificacoes como lidas', error);
        }
    };

    const limparTodas = async () => {
        try {
            await api.delete('/notificacoes');
            setNotificacoes([]);
            setMostrarNotificacoes(false);
        } catch (error) {
            console.error('Erro ao limpar notificacoes', error);
        }
    };

const handleNavigate = (pageId) => {
    setPagina(pageId);
    setMenuAberto(false);
    window.dispatchEvent(new CustomEvent('reloadData'));
};

    const confirmarLogout = () => {
        setModalLogout(false);
        logout();
    };

    const notificacoesNaoLidas = notificacoes.length;

    const menus = {
        admin: [
            { id: 'admin', label: 'Painel Admin', icon: FiGrid },
            { id: 'estabelecimentos', label: 'Estabelecimentos', icon: FiServer },
            { id: 'usuarios', label: 'Usuários', icon: FiUsers },
            { id: 'logs', label: 'Logs', icon: FiFileText },
        ],
        dono: [
            { id: 'dashboard', label: 'Painel de Controle', icon: FiGrid },
            { id: 'analise', label: 'Análise de Vendas', icon: FiBarChart2 },
            { id: 'ingredientes', label: 'Ingredientes', icon: FiBox },
            { id: 'produtos', label: 'Produtos', icon: FiPackage },
            { id: 'lotes', label: 'Lotes', icon: FiCalendar },
            { id: 'relatorios', label: 'Relatórios', icon: FiFileText },
            { id: 'usuarios', label: 'Usuários', icon: FiUsers },
            { id: 'logs', label: 'Logs', icon: FiFileText },
        ],
        gerente: [
            { id: 'dashboard', label: 'Painel de Controle', icon: FiGrid },
            { id: 'analise', label: 'Análise de Vendas', icon: FiBarChart2 },
            { id: 'ingredientes', label: 'Ingredientes', icon: FiBox },
            { id: 'produtos', label: 'Produtos', icon: FiPackage },
            { id: 'lotes', label: 'Lotes', icon: FiCalendar },
            { id: 'relatorios', label: 'Relatórios', icon: FiFileText },
            { id: 'cardapio', label: 'Cardápio', icon: FiCoffee },
            { id: 'logs', label: 'Logs', icon: FiFileText },
        ],
        atendente: [
            { id: 'comandas', label: 'Comandas', icon: FiClipboard },
            { id: 'comandas-finalizadas', label: 'Finalizadas', icon: FiClock },
            { id: 'cardapio', label: 'Cardápio', icon: FiCoffee },
        ],
        cozinha: [
            { id: 'cozinha', label: 'Cozinha', icon: FiShoppingBag },
            { id: 'cardapio', label: 'Cardápio', icon: FiCoffee },
        ]
    };

    const itensMenu = menus[usuario?.perfil] || [];

    return (
        <>
            <div className="mobile-header">
                <button className="hamburger-btn" onClick={() => setMenuAberto(!menuAberto)}>
                    {menuAberto ? <FiX size={28} /> : <FiMenu size={28} />}
                </button>
                <div className="mobile-header-center">
                    <img src="/crown.png" alt="Imperatore" />
                    <span>Imperatore</span>
                </div>
                <div className="mobile-header-estabelecimento">
                    {usuario?.estabelecimento_nome && (
                        <span>{usuario.estabelecimento_nome}</span>
                    )}
                </div>
            </div>

            <div className={`mobile-overlay ${menuAberto ? 'open' : ''}`} onClick={() => setMenuAberto(false)} />

            <div className={`sidebar ${menuAberto ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <img 
                                src="/crown.png" 
                                alt="Imperatore" 
                                style={{ width: 24, height: 24 }}
                            />
                            <div>
                                <h1 style={{ margin: 0, fontSize: 20 }}>Imperatore</h1>
                                {usuario?.estabelecimento_nome && (
                                    <span style={{ 
                                        fontSize: 12, 
                                        color: 'var(--gold)', 
                                        opacity: 0.8,
                                        display: 'block',
                                        marginTop: -2
                                    }}>
                                        {usuario?.estabelecimento_nome}
                                    </span>
                                )}
                            </div>
                        </div>
                        {usuario?.perfil !== 'admin' && (
                            <div style={{ position: 'relative' }}>
                                <button 
                                    className="sidebar-bell"
                                    onClick={() => setMostrarNotificacoes(!mostrarNotificacoes)}
                                >
                                    <FiBell size={20} />
                                    {notificacoesNaoLidas > 0 && (
                                        <span className="badge-bell">{notificacoesNaoLidas}</span>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                    <span className="sidebar-perfil">{usuario?.perfil}</span>
                </div>

                <nav className="sidebar-nav">
                    {itensMenu.map((item) => {
                        const Icon = item.icon;
                        const isActive = paginaAtual === item.id;
                        return (
                            <button
                                key={item.id}
                                className={`sidebar-btn ${isActive ? 'active' : ''}`}
                                onClick={() => {
                                    setPagina(item.id);
                                    setMenuAberto(false);
                                }}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="sidebar-footer">
                    <div className="sidebar-usuario">
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 600, fontSize: 14 }}>{usuario?.nome}</span>
                            <span style={{ fontSize: 11, color: 'var(--gold)', opacity: 0.8 }}>
                                {usuario?.estabelecimento_nome || 'Sem estabelecimento'}
                            </span>
                        </div>
                    </div>
                    <button 
                        className="sidebar-btn sidebar-config"
                        onClick={() => {
                            setPagina('configuracoes');
                            setMenuAberto(false);
                        }}
                    >
                        <FiSettings size={20} />
                        <span>Configurações</span>
                    </button>
                    <button 
                        className="sidebar-btn sidebar-sobre"
                        onClick={() => {
                            setPagina('sobre');
                            setMenuAberto(false);
                        }}
                    >
                        <FiInfo size={20} />
                        <span>Sobre o Sistema</span>
                    </button>

                    <button 
                        className="sidebar-btn sidebar-sair"
                        onClick={() => setModalLogout(true)}
                    >
                        <FiLogOut size={20} />
                        <span>Sair</span>
                    </button>
                </div>

                {mostrarNotificacoes && (
                    <div className="notificacoes-dropdown">
                        <div className="notificacoes-header">
                            <span>Notificações</span>
                            {notificacoes.length > 0 && (
                                <div className="notificacoes-actions">
                                    <button onClick={marcarTodasComoLidas} className="notificacoes-btn lido">
                                        <FiCheckCircle size={16} />
                                        Ler todas
                                    </button>
                                    <button onClick={limparTodas} className="notificacoes-btn limpar">
                                        <FiTrash2 size={16} />
                                        Limpar
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="notificacoes-list">
                            {notificacoes.length > 0 ? (
                                notificacoes.map((notif, idx) => (
                                    <div key={idx} className="notificacao-item-dropdown">
                                        <span className="notificacao-text">{notif.mensagem}</span>
                                        <span className="notificacao-tempo">
                                            {new Date(notif.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="notificacoes-vazio">
                                    <FiBellOff size={32} />
                                    <p>Nenhuma notificação</p>
                                    <span>As notificações aparecerão aqui</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {modalLogout && (
                <div className="modal-overlay" onClick={() => setModalLogout(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Confirmar Saída</h3>
                            <button className="modal-close" onClick={() => setModalLogout(false)}>
                                <FiX size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <FiAlertCircle size={32} className="modal-icon-warning" />
                            <p>Tem certeza que deseja sair?</p>
                            <p className="text-muted">Você será desconectado do sistema.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setModalLogout(false)}>
                                Cancelar
                            </button>
                            <button className="btn btn-danger" onClick={confirmarLogout}>
                                <FiLogOut size={16} style={{ marginRight: 6 }} />
                                Sair
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Header;