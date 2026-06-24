import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FiPlus, FiEdit2, FiTrash2, FiUsers, FiUser, FiSearch, FiX, FiAlertCircle } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Usuarios() {
    const { usuario } = useAuth();
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalEdicao, setModalEdicao] = useState(false);
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [perfil, setPerfil] = useState('atendente');
    const [modalConfirmacao, setModalConfirmacao] = useState(null);

    const perfis = [
        { valor: 'atendente', label: 'Atendente', cor: '#6c757d' },
        { valor: 'cozinha', label: 'Cozinha', cor: '#fd7e14' },
        { valor: 'gerente', label: 'Gerente', cor: '#007bff' },
        { valor: 'dono', label: 'Dono', cor: '#28a745' }
    ];

    useEffect(() => {
        if (usuario?.perfil === 'dono' || usuario?.perfil === 'gerente') {
            carregarUsuarios();
        }
    }, [usuario]);

    const carregarUsuarios = async () => {
        setLoading(true);
        try {
            const response = await api.get('/auth/usuarios');
            setUsuarios(response.data);
        } catch (error) {
            console.error('Erro ao carregar usuarios', error);
            toast.error('Erro ao carregar usuários');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nome || !email || !senha) {
            toast.warning('Preencha todos os campos');
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/funcionarios', { nome, email, senha, perfil });
            setNome('');
            setEmail('');
            setSenha('');
            setPerfil('atendente');
            setModalEdicao(false);
            carregarUsuarios();
            toast.success('Usuário criado com sucesso!');
        } catch (error) {
            console.error('Erro ao criar usuario', error);
            toast.error('Erro ao criar usuário');
        } finally {
            setLoading(false);
        }
    };

    const abrirModal = () => {
        setNome('');
        setEmail('');
        setSenha('');
        setPerfil('atendente');
        setModalEdicao(true);
    };

    const fecharModal = () => {
        setModalEdicao(false);
        setNome('');
        setEmail('');
        setSenha('');
        setPerfil('atendente');
    };

    const handleMudarPerfil = async (id, novoPerfil) => {
        try {
            await api.put(`/auth/usuarios/${id}/perfil`, { perfil: novoPerfil });
            carregarUsuarios();
            toast.success('Perfil atualizado!');
        } catch (error) {
            console.error('Erro ao mudar perfil', error);
            toast.error('Erro ao mudar perfil');
        }
    };

    const handleDelete = async (id) => {
        const user = usuarios.find(u => u.id === id);
        setModalConfirmacao({ id, nome: user?.nome });
    };

    const confirmarExclusao = async () => {
        if (!modalConfirmacao) return;
        try {
            await api.delete(`/auth/usuarios/${modalConfirmacao.id}`);
            carregarUsuarios();
            toast.success('Usuário excluído com sucesso');
        } catch (error) {
            console.error('Erro ao excluir usuario', error);
            toast.error('Erro ao excluir usuário');
        } finally {
            setModalConfirmacao(null);
        }
    };

    const getPerfilCor = (perfil) => {
        const p = perfis.find(p => p.valor === perfil);
        return p ? p.cor : '#6c757d';
    };

    const getPerfilLabel = (perfil) => {
        const p = perfis.find(p => p.valor === perfil);
        return p ? p.label : perfil;
    };

    if (usuario?.perfil !== 'dono' && usuario?.perfil !== 'gerente') {
        return (
            <div className="card" style={{ textAlign: 'center', padding: 60 }}>
                <FiAlertCircle size={48} color="var(--red)" />
                <h2>Acesso Negado</h2>
                <p className="text-muted">Apenas dono ou gerente podem gerenciar usuários.</p>
            </div>
        );
    }

    const podeCriar = usuario?.perfil === 'dono';

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} theme="dark" />

            <div className="page-header">
                <div>
                    <h1>Usuários</h1>
                    <p className="text-muted">Gerencie os usuários do estabelecimento</p>
                </div>
                {podeCriar && (
                    <button className="btn btn-primary" onClick={abrirModal}>
                        <FiPlus size={18} style={{ marginRight: 6 }} />
                        Novo Usuário
                    </button>
                )}
            </div>

            <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <FiUsers size={18} color="var(--primary)" />
                    <h3 style={{ margin: 0 }}>Lista de Usuários</h3>
                    <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)' }}>
                        {usuarios.length} registros
                    </span>
                </div>
                {loading ? (
                    <div className="loading-state">Carregando usuários...</div>
                ) : (
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Usuário</th>
                                    <th>Email</th>
                                    <th>Perfil</th>
                                    <th className="text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map((user) => (
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
                                                {getPerfilLabel(user.perfil)}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="acoes">
                                                <select 
                                                    value={user.perfil}
                                                    onChange={(e) => handleMudarPerfil(user.id, e.target.value)}
                                                    className="perfil-select"
                                                    disabled={!podeCriar}
                                                    style={{
                                                        padding: '4px 8px',
                                                        borderRadius: 4,
                                                        border: '1px solid var(--border-color)',
                                                        fontSize: 12,
                                                        background: 'var(--bg-card)',
                                                        cursor: podeCriar ? 'pointer' : 'default'
                                                    }}
                                                >
                                                    {perfis.map(p => (
                                                        <option key={p.valor} value={p.valor}>{p.label}</option>
                                                    ))}
                                                </select>
                                                {podeCriar && (
                                                    <button 
                                                        className="btn-icon btn-delete" 
                                                        onClick={() => handleDelete(user.id)}
                                                        title="Excluir"
                                                    >
                                                        <FiTrash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {usuarios.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center text-muted">
                                            <FiUsers size={32} />
                                            <p>Nenhum usuário cadastrado</p>
                                            <span>Cadastre o primeiro usuário</span>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {modalEdicao && (
                <div className="modal-overlay" onClick={fecharModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Novo Usuário</h3>
                            <button className="modal-close" onClick={fecharModal}>
                                <FiX size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Nome</label>
                                    <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Digite o nome completo" required />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Digite o e-mail" required />
                                </div>
                                <div className="form-group">
                                    <label>Senha</label>
                                    <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Digite a senha" required />
                                </div>
                                <div className="form-group">
                                    <label>Perfil</label>
                                    <select value={perfil} onChange={(e) => setPerfil(e.target.value)}>
                                        {perfis.map(p => (
                                            <option key={p.valor} value={p.valor}>{p.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? 'Cadastrando...' : 'Cadastrar'}
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={fecharModal}>
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
                            <p>Tem certeza que deseja excluir o usuário</p>
                            <p><strong>"{modalConfirmacao.nome}"</strong>?</p>
                            <p className="text-muted" style={{ fontSize: 12 }}>Esta ação não pode ser desfeita.</p>
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
        </>
    );
}

export default Usuarios;