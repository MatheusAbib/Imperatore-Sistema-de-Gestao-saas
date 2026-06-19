import React, { useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiMail, FiLock, FiSave, FiEye, FiEyeOff } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Configuracoes() {
    const { usuario, logout } = useAuth();
    const [nome, setNome] = useState(usuario?.nome || '');
    const [email, setEmail] = useState(usuario?.email || '');
    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
    const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
    const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

    const handleAtualizarPerfil = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.put('/auth/perfil', { nome, email });
            const usuarioAtualizado = { ...usuario, nome, email };
            localStorage.setItem('usuario', JSON.stringify(usuarioAtualizado));
            toast.success('Perfil atualizado com sucesso!');
            setTimeout(() => window.location.reload(), 1500);
        } catch (error) {
            toast.error(error.response?.data?.mensagem || 'Erro ao atualizar perfil');
        } finally {
            setLoading(false);
        }
    };

    const handleAlterarSenha = async (e) => {
        e.preventDefault();

        if (novaSenha !== confirmarSenha) {
            toast.error('As senhas não coincidem');
            return;
        }

        if (novaSenha.length < 6) {
            toast.error('A nova senha deve ter pelo menos 6 caracteres');
            return;
        }

        setLoading(true);
        try {
            await api.put('/auth/senha', { senha_atual: senhaAtual, nova_senha: novaSenha });
            setSenhaAtual('');
            setNovaSenha('');
            setConfirmarSenha('');
            toast.success('Senha alterada com sucesso! Faça login novamente.');
            setTimeout(() => logout(), 2000);
        } catch (error) {
            toast.error(error.response?.data?.mensagem || 'Erro ao alterar senha');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} theme="dark" />

            <div className="page-header">
                <div>
                    <h1>Configurações</h1>
                    <p className="text-muted">Gerencie seus dados pessoais</p>
                </div>
            </div>

            <div className="card">
                <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <FiUser size={20} color="var(--primary)" />
                    Perfil
                </h2>
                <form onSubmit={handleAtualizarPerfil}>
                    <div className="form-group">
                        <label>Nome</label>
                        <div style={{ position: 'relative' }}>
                            <FiUser size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                                style={{ paddingLeft: 38 }}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <div style={{ position: 'relative' }}>
                            <FiMail size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{ paddingLeft: 38 }}
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiSave size={18} />
                        {loading ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </form>
            </div>

            <div className="card">
                <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <FiLock size={20} color="var(--primary)" />
                    Alterar Senha
                </h2>
                <form onSubmit={handleAlterarSenha}>
                    <div className="form-group">
                        <label>Senha Atual</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={mostrarSenhaAtual ? 'text' : 'password'}
                                value={senhaAtual}
                                onChange={(e) => setSenhaAtual(e.target.value)}
                                placeholder="Digite sua senha atual"
                                required
                                style={{ paddingRight: 40 }}
                            />
                            <button
                                type="button"
                                onClick={() => setMostrarSenhaAtual(!mostrarSenhaAtual)}
                                style={{
                                    position: 'absolute',
                                    right: 10,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--text-muted)',
                                    padding: 4
                                }}
                            >
                                {mostrarSenhaAtual ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                            </button>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Nova Senha</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={mostrarNovaSenha ? 'text' : 'password'}
                                value={novaSenha}
                                onChange={(e) => setNovaSenha(e.target.value)}
                                placeholder="Digite a nova senha"
                                required
                                style={{ paddingRight: 40 }}
                            />
                            <button
                                type="button"
                                onClick={() => setMostrarNovaSenha(!mostrarNovaSenha)}
                                style={{
                                    position: 'absolute',
                                    right: 10,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--text-muted)',
                                    padding: 4
                                }}
                            >
                                {mostrarNovaSenha ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                            </button>
                        </div>
                        <small style={{ color: 'var(--text-muted)' }}>Mínimo de 6 caracteres</small>
                    </div>
                    <div className="form-group">
                        <label>Confirmar Nova Senha</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={mostrarConfirmarSenha ? 'text' : 'password'}
                                value={confirmarSenha}
                                onChange={(e) => setConfirmarSenha(e.target.value)}
                                placeholder="Confirme a nova senha"
                                required
                                style={{ paddingRight: 40 }}
                            />
                            <button
                                type="button"
                                onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                                style={{
                                    position: 'absolute',
                                    right: 10,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--text-muted)',
                                    padding: 4
                                }}
                            >
                                {mostrarConfirmarSenha ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiLock size={18} />
                        {loading ? 'Alterando...' : 'Alterar Senha'}
                    </button>
                </form>
            </div>
        </>
    );
}

export default Configuracoes;