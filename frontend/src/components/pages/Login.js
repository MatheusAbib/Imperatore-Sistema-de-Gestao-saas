import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiLock, FiLogIn, FiEye, FiEyeOff } from 'react-icons/fi';

function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [erro, setErro] = useState('');
    const [carregandoPagina, setCarregandoPagina] = useState(true);
    const { login, loading } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro('');

        const result = await login(email, senha);
        if (!result.success) {
            setErro(result.error);
        }
    };

    setTimeout(() => {
        setCarregandoPagina(false);
    }, 500);

    if (carregandoPagina) {
        return (
            <div className="login-page">
                <div className="login-center" style={{ minHeight: '100vh' }}>
                    <div className="spinner-login"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="login-page">
            <div className="login-header-full">
                <div className="login-header-brand">
                    <img src="/crown.png" alt="Imperatore" />
                    <span>Imperatore</span>
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
                                        autoComplete="new-password"
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
                                {loading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Carregando...
                                    </>
                                ) : (
                                    <>
                                        <FiLogIn size={18} />
                                        Entrar
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="login-footer-full">
                <span className="login-footer-text">
                    <strong>Imperatore</strong> - Sistema de Gestão para seu Negócio
                </span>
                <div className="login-footer-links">
                    <a href="mailto:matheus.abib.ma@gmail.com">
                        matheus.abib.ma@gmail.com
                    </a>
                    <a href="https://wa.me/5511975072008" target="_blank" rel="noopener noreferrer">
                        (11) 97507-2008
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Login;