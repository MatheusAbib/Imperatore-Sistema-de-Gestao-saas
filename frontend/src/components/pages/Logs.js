import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
    FiSearch, FiX, FiFileText, FiUser, FiServer, FiClock, 
    FiChevronLeft, FiChevronRight, FiTrash2, FiAlertCircle,
    FiPackage, FiBox, FiClipboard, FiShoppingBag, FiUsers, FiSettings
} from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Logs() {
    const { usuario } = useAuth();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [filtros, setFiltros] = useState({
        modulo: '',
        estabelecimento_id: '',
        usuario_id: '',
        data_inicio: '',
        data_fim: ''
    });
    const [estabelecimentos, setEstabelecimentos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [busca, setBusca] = useState('');
    const [modalLimpar, setModalLimpar] = useState(false);
    const [diasParaLimpar, setDiasParaLimpar] = useState(30);

    const isAdmin = usuario?.perfil === 'admin';
    const isDonoOuGerente = usuario?.perfil === 'dono' || usuario?.perfil === 'gerente';

    const modulos = [
        { valor: 'Auth', label: 'Autenticação', icon: FiUser },
        { valor: 'Produtos', label: 'Produtos', icon: FiPackage },
        { valor: 'Ingredientes', label: 'Ingredientes', icon: FiBox },
        { valor: 'Lotes', label: 'Lotes', icon: FiBox },
        { valor: 'Comandas', label: 'Comandas', icon: FiClipboard },
        { valor: 'Pedidos', label: 'Pedidos', icon: FiShoppingBag },
        { valor: 'Admin', label: 'Admin', icon: FiSettings },
        { valor: 'Notificacoes', label: 'Notificações', icon: FiAlertCircle }
    ];

    useEffect(() => {
        carregarLogs();
        if (isAdmin) {
            carregarEstabelecimentos();
        }
        carregarUsuarios();
    }, [pagina, filtros]);

    const carregarLogs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                pagina,
                limite: 20,
                ...filtros
            });
            if (filtros.usuario_id) params.set('usuario_id', filtros.usuario_id);
            if (filtros.estabelecimento_id && isAdmin) params.set('estabelecimento_id', filtros.estabelecimento_id);
            
            const response = await api.get(`/logs?${params}`);
            setLogs(response.data.logs);
            setTotalPaginas(response.data.totalPaginas || 1);
        } catch (error) {
            console.error('Erro ao carregar logs', error);
            toast.error('Erro ao carregar logs');
        } finally {
            setLoading(false);
        }
    };

    const carregarEstabelecimentos = async () => {
        try {
            const response = await api.get('/admin/estabelecimentos');
            setEstabelecimentos(response.data);
        } catch (error) {
            console.error('Erro ao carregar estabelecimentos', error);
        }
    };

    const carregarUsuarios = async () => {
        try {
            let response;
            if (isAdmin) {
                response = await api.get('/admin/usuarios/todos');
            } else {
                response = await api.get('/auth/usuarios');
            }
            setUsuarios(response.data);
        } catch (error) {
            console.error('Erro ao carregar usuarios', error);
        }
    };

    const handleLimparLogs = async () => {
        try {
            await api.delete(`/logs/limpar?dias=${diasParaLimpar}`);
            toast.success(`Logs com mais de ${diasParaLimpar} dias removidos`);
            setModalLimpar(false);
            carregarLogs();
        } catch (error) {
            console.error('Erro ao limpar logs', error);
            toast.error('Erro ao limpar logs');
        }
    };

    const handleLimparBusca = () => {
        setBusca('');
    };

    const getModuloIcon = (modulo) => {
        const encontrado = modulos.find(m => m.valor === modulo);
        if (encontrado) {
            const Icon = encontrado.icon;
            return <Icon size={16} />;
        }
        return <FiFileText size={16} />;
    };

    const getModuloLabel = (modulo) => {
        const encontrado = modulos.find(m => m.valor === modulo);
        return encontrado ? encontrado.label : modulo;
    };

    const logsFiltrados = logs.filter(log =>
        log.descricao.toLowerCase().includes(busca.toLowerCase()) ||
        log.usuario_nome?.toLowerCase().includes(busca.toLowerCase()) ||
        log.acao?.toLowerCase().includes(busca.toLowerCase())
    );

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} theme="dark" />

            <div className="page-header">
                <div>
                    <h1>Logs de Ações</h1>
                    <p className="text-muted">Histórico completo de atividades do sistema</p>
                </div>
                    <button className="btn btn-danger" onClick={() => setModalLimpar(true)}>
                        <FiTrash2 size={18} style={{ marginRight: 6 }} />
                        Limpar Logs Antigos
                    </button>
            </div>

            <div className="card" style={{ marginBottom: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: isAdmin ? '1fr 1fr 1fr 1fr 1fr' : '1fr 1fr 1fr 1fr', gap: 16 }}>
                    <div className="form-group">
                        <label>Módulo</label>
                        <select 
                            value={filtros.modulo} 
                            onChange={(e) => setFiltros({ ...filtros, modulo: e.target.value, pagina: 1 })}
                        >
                            <option value="">Todos</option>
                            {modulos.map(m => (
                                <option key={m.valor} value={m.valor}>{m.label}</option>
                            ))}
                        </select>
                    </div>
                    
                    {isAdmin && (
                        <div className="form-group">
                            <label>Estabelecimento</label>
                            <select 
                                value={filtros.estabelecimento_id} 
                                onChange={(e) => setFiltros({ ...filtros, estabelecimento_id: e.target.value, pagina: 1 })}
                            >
                                <option value="">Todos</option>
                                {estabelecimentos.map(e => (
                                    <option key={e.id} value={e.id}>{e.nome}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Usuário</label>
                        <select 
                            value={filtros.usuario_id} 
                            onChange={(e) => setFiltros({ ...filtros, usuario_id: e.target.value, pagina: 1 })}
                        >
                            <option value="">Todos</option>
                            {usuarios.map(u => (
                                <option key={u.id} value={u.id}>{u.nome}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Data Início</label>
                        <input 
                            type="date" 
                            value={filtros.data_inicio} 
                            onChange={(e) => setFiltros({ ...filtros, data_inicio: e.target.value, pagina: 1 })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Data Fim</label>
                        <input 
                            type="date" 
                            value={filtros.data_fim} 
                            onChange={(e) => setFiltros({ ...filtros, data_fim: e.target.value, pagina: 1 })}
                        />
                    </div>
                </div>
            </div>

            <div className="search-box">
                <FiSearch size={20} className="search-icon" />
                <input
                    type="text"
                    placeholder="Buscar por descrição, usuário ou ação..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                />
                {busca && (
                    <button className="search-clear" onClick={handleLimparBusca} title="Limpar busca">
                        <FiX size={18} />
                    </button>
                )}
            </div>

            <div className="card">
                {loading ? (
                    <div className="loading-state">Carregando logs...</div>
                ) : (
                    <>
                        <div className="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Data/Hora</th>
                                        <th>Usuário</th>
                                        <th>Perfil</th>
                                        <th>Estabelecimento</th>
                                        <th>Módulo</th>
                                        <th>Ação</th>
                                        <th>Descrição</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logsFiltrados.map((log) => (
                                        <tr key={log.id}>
                                            <td style={{ whiteSpace: 'nowrap' }}>
                                                <FiClock size={14} style={{ marginRight: 4, color: 'var(--text-muted)' }} />
                                                {new Date(log.created_at).toLocaleString('pt-BR')}
                                            </td>
                                            <td>{log.usuario_nome}</td>
                                            <td>
                                                <span style={{ 
                                                    color: log.perfil === 'admin' ? '#b85a3a' : 
                                                           log.perfil === 'dono' ? '#28a745' : 
                                                           log.perfil === 'gerente' ? '#007bff' : 
                                                           log.perfil === 'cozinha' ? '#fd7e14' : '#6c757d',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {log.perfil}
                                                </span>
                                            </td>
                                            <td>{log.estabelecimento_nome || '-'}</td>
                                            <td>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                    {getModuloIcon(log.modulo)}
                                                    {getModuloLabel(log.modulo)}
                                                </span>
                                            </td>
                                            <td>
                                                <span style={{ 
                                                    background: log.acao === 'Criou' ? 'var(--green-light)' :
                                                               log.acao === 'Editou' ? 'var(--yellow-light)' :
                                                               log.acao === 'Deletou' ? 'var(--red-light)' :
                                                               log.acao === 'Login' ? 'var(--blue-light)' :
                                                               'var(--bg-hover)',
                                                    padding: '2px 10px',
                                                    borderRadius: 12,
                                                    fontSize: 12,
                                                    fontWeight: 'bold'
                                                }}>
                                                    {log.acao}
                                                </span>
                                            </td>
                                            <td style={{ maxWidth: 300, wordBreak: 'break-word' }}>{log.descricao}</td>
                                        </tr>
                                    ))}
                                    {logsFiltrados.length === 0 && (
                                        <tr>
                                            <td colSpan="7" className="text-center text-muted">
                                                <FiFileText size={32} />
                                                <p>Nenhum log encontrado</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {totalPaginas > 1 && (
                            <div className="pagination">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setPagina(p => Math.max(1, p - 1))}
                                    disabled={pagina <= 1}
                                >
                                    <FiChevronLeft size={16} />
                                </button>
                                <span>Página {pagina} de {totalPaginas}</span>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
                                    disabled={pagina >= totalPaginas}
                                >
                                    <FiChevronRight size={16} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {modalLimpar && (
                <div className="modal-overlay" onClick={() => setModalLimpar(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Limpar Logs Antigos</h3>
                            <button className="modal-close" onClick={() => setModalLimpar(false)}>
                                <FiX size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <FiAlertCircle size={32} className="modal-icon-warning" />
                            <p>Remover logs com mais de:</p>
                            <div className="form-group" style={{ marginTop: 12 }}>
                                <select 
                                    value={diasParaLimpar} 
                                    onChange={(e) => setDiasParaLimpar(parseInt(e.target.value))}
                                    style={{ width: '100%', padding: 10 }}
                                >
                                    <option value={30}>30 dias</option>
                                    <option value={60}>60 dias</option>
                                    <option value={90}>90 dias</option>
                                    <option value={180}>180 dias</option>
                                    <option value={365}>1 ano</option>
                                </select>
                            </div>
                            <p className="text-muted" style={{ fontSize: 12, marginTop: 8 }}>
                                Esta ação não pode ser desfeita.
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setModalLimpar(false)}>
                                Cancelar
                            </button>
                            <button className="btn btn-danger" onClick={handleLimparLogs}>
                                <FiTrash2 size={16} style={{ marginRight: 6 }} />
                                Limpar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Logs;