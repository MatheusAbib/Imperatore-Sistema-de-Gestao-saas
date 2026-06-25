import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FiUsers, FiUser, FiSearch, FiServer, FiAlertCircle, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UsuariosAdmin() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [busca, setBusca] = useState('');
    const [modalEdicao, setModalEdicao] = useState(null);
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [perfil, setPerfil] = useState('atendente');
    const [alterarSenha, setAlterarSenha] = useState(false);
    const [senha, setSenha] = useState('');
    const [modalConfirmacao, setModalConfirmacao] = useState(null);

    const perfis = [
        { valor: 'atendente', label: 'Atendente' },
        { valor: 'cozinha', label: 'Cozinha' },
        { valor: 'gerente', label: 'Gerente' },
        { valor: 'dono', label: 'Dono' }
    ];

    useEffect(() => {
        carregarUsuarios();
    }, []);

    const carregarUsuarios = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/usuarios/todos');
            setUsuarios(response.data);
        } catch (error) {
            console.error('Erro ao carregar usuarios', error);
            toast.error('Erro ao carregar usuários');
        } finally {
            setLoading(false);
        }
    };

    const handleEditar = (user) => {
        setModalEdicao(user);
        setNome(user.nome);
        setEmail(user.email);
        setPerfil(user.perfil);
        setAlterarSenha(false);
        setSenha('');
    };

    const handleSubmitEdicao = async (e) => {
        e.preventDefault();
        if (!nome || !email) {
            toast.warning('Preencha nome e email');
            return;
        }

        setLoading(true);
        try {
            const dados = { nome, email, perfil };
            if (alterarSenha && senha) {
                dados.senha = senha;
            }
            await api.put(`/admin/usuarios/${modalEdicao.id}`, dados);
            toast.success('Usuário atualizado com sucesso');
            setModalEdicao(null);
            carregarUsuarios();
        } catch (error) {
            console.error('Erro ao atualizar usuario', error);
            toast.error('Erro ao atualizar usuário');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const user = usuarios.find(u => u.id === id);
        setModalConfirmacao({ id, nome: user?.nome, estabelecimento: user?.estabelecimento_nome });
    };

    const confirmarExclusao = async () => {
        if (!modalConfirmacao) return;
        try {
            await api.delete(`/admin/usuarios/${modalConfirmacao.id}`);
            toast.success('Usuário excluído com sucesso');
            carregarUsuarios();
        } catch (error) {
            console.error('Erro ao deletar usuario', error);
            toast.error('Erro ao excluir usuário');
        } finally {
            setModalConfirmacao(null);
        }
    };

    const getPerfilCor = (perfil) => {
        if (perfil === 'dono') return '#28a745';
        if (perfil === 'gerente') return '#007bff';
        if (perfil === 'cozinha') return '#fd7e14';
        return '#6c757d';
    };

    const handleLimparBusca = () => {
        setBusca('');
    };

    const usuariosFiltrados = usuarios.filter(u =>
        u.nome.toLowerCase().includes(busca.toLowerCase()) ||
        u.email.toLowerCase().includes(busca.toLowerCase()) ||
        (u.estabelecimento_nome && u.estabelecimento_nome.toLowerCase().includes(busca.toLowerCase()))
    );


    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} theme="dark" />

            <div className="page-header">
                <div>
                    <h1>Usuários do Sistema</h1>
                    <p className="text-muted">Visualize todos os usuários organizados por estabelecimento</p>
                </div>
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
                    placeholder="Buscar por nome, email ou estabelecimento..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                />
                {busca && (
                    <button className="search-clear" onClick={handleLimparBusca} title="Limpar busca">
                        <FiX size={18} />
                    </button>
                )}
            </div>
            <div className="table-responsive">
                <table>

                        <thead>
                            <tr>
                                <th>Usuário</th>
                                <th>Email</th>
                                <th>Perfil</th>
                                <th>Estabelecimento</th>
                                <th className="text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuariosFiltrados.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        <div className="produto-info">
                                            <span className="produto-icon"><FiUser size={18} /></span>
                                            {user.nome}
                                        </div>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span style={{ 
                                            color: getPerfilCor(user.perfil), 
                                            fontWeight: 'bold',
                                            backgroundColor: getPerfilCor(user.perfil) + '22',
                                            padding: '4px 12px',
                                            borderRadius: 12,
                                            fontSize: 12
                                        }}>
                                            {user.perfil}
                                        </span>
                                    </td>
                                    <td>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <FiServer size={14} color="var(--text-muted)" />
                                            {user.estabelecimento_nome || 'Sem estabelecimento'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="acoes">
                                            <button 
                                                className="btn-icon btn-edit" 
                                                onClick={() => handleEditar(user)}
                                                title="Editar"
                                            >
                                                <FiEdit2 size={16} />
                                            </button>
                                            <button 
                                                className="btn-icon btn-delete" 
                                                onClick={() => handleDelete(user.id)}
                                                title="Excluir"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {usuariosFiltrados.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center text-muted">
                                        <FiUsers size={32} />
                                        <p>Nenhum usuário encontrado</p>
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
                <div className="modal-overlay" onClick={() => setModalEdicao(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Editar Usuário</h3>
                            <button className="modal-close" onClick={() => setModalEdicao(null)}>
                                <FiX size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmitEdicao}>
                                <div className="form-group">
                                    <label>Nome</label>
                                    <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>Perfil</label>
                                    <select value={perfil} onChange={(e) => setPerfil(e.target.value)}>
                                        {perfis.map(p => (
                                            <option key={p.valor} value={p.valor}>{p.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                        <input
                                            type="checkbox"
                                            checked={alterarSenha}
                                            onChange={(e) => {
                                                setAlterarSenha(e.target.checked);
                                                if (!e.target.checked) setSenha('');
                                            }}
                                            style={{ width: 'auto' }}
                                        />
                                        <label style={{ margin: 0 }}>Alterar senha</label>
                                    </div>
                                    {alterarSenha && (
                                        <input
                                            type="password"
                                            value={senha}
                                            onChange={(e) => setSenha(e.target.value)}
                                            placeholder="Digite a nova senha"
                                            required={alterarSenha}
                                        />
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? 'Salvando...' : 'Atualizar'}
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={() => setModalEdicao(null)}>
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
                            <p>Tem certeza que deseja excluir o usuário <strong>"{modalConfirmacao.nome}"</strong> do estabelecimento <strong>"{modalConfirmacao.estabelecimento}"</strong>?</p>
                            <p className="text-muted" style={{ fontSize: 12 }}>Esta ação não pode ser desfeita.</p>
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

export default UsuariosAdmin;