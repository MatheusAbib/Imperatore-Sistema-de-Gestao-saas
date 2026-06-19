import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiLock, FiLogIn, FiEye, FiEyeOff, FiMessageCircle, FiMail as FiMailIcon } from 'react-icons/fi';

function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [erro, setErro] = useState('');
    const { login, loading } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro('');

        const result = await login(email, senha);
        if (!result.success) {
            setErro(result.error);
        }
    };

    return (
        <div className="login-page">
            <div className="login-header-full">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img src="/crown.png" alt="Imperatore" style={{ width: 28, height: 28 }} />
                    <span style={{ fontWeight: 600, fontSize: 18, color: 'var(--text-primary)' }}>Imperatore</span>
                </div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
         
                </div>
            </div>

            <div className="login-center">
                <div className="login-wrapper">
             

                    <div className="login-card">
                               <div className="login-brand">
                        <img src="/crown.png" alt="Imperatore" className="login-brand-icon" />
                        <h1>Imperatore</h1>
                        <span>Sistema de Gestão</span>
                    </div>
                        <div className="login-card-header">
                            <p>Faça login para acessar o sistema</p>
                        </div>

                        {erro && (
                            <div className="login-error">
                                <span className="login-error-icon">!</span>
                                {erro}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="login-field">
                                <label>E-mail</label>
                                <div className="login-input-wrapper">
                                    <FiMail className="login-input-icon" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Digite seu e-mail"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="login-field">
                                <label>Senha</label>
                                <div className="login-input-wrapper">
                                    <FiLock className="login-input-icon" />
                                    <input
                                        type={mostrarSenha ? 'text' : 'password'}
                                        value={senha}
                                        onChange={(e) => setSenha(e.target.value)}
                                        placeholder="Digite sua senha"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="login-password-toggle"
                                        onClick={() => setMostrarSenha(!mostrarSenha)}
                                    >
                                        {mostrarSenha ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className="login-submit" disabled={loading}>
                                <FiLogIn size={18} />
                                {loading ? 'Carregando...' : 'Entrar'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="login-footer-full">
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    <strong>Imperatore</strong> - Sistema de Gestão para Restaurantes, Bares e Cafés
                </span>
                <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
                    <a href="mailto:matheus.abib.ma@gmail.com" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                        matheus.abib.ma@gmail.com
                    </a>
                    <a href="https://wa.me/5511975072008" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                        (11) 97507-2008
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Login;