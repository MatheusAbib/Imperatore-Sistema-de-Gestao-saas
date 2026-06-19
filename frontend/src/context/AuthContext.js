import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const usuarioSalvo = localStorage.getItem('usuario');
        
        if (token && usuarioSalvo) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUsuario(JSON.parse(usuarioSalvo));
        }
        setLoading(false);
    }, []);

    const login = async (email, senha) => {
        setLoading(true);
        try {
            const response = await api.post('/auth/login', { email, senha });
            const { token, usuario } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('usuario', JSON.stringify(usuario));
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUsuario(usuario);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.mensagem || 'Erro ao fazer login' };
        } finally {
            setLoading(false);
        }
    };

    const registrar = async (nome, email, senha, perfil) => {
        setLoading(true);
        try {
            const response = await api.post('/auth/registrar', { nome, email, senha, perfil });
            const { token, usuario } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('usuario', JSON.stringify(usuario));
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUsuario(usuario);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.mensagem || 'Erro ao registrar' };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        delete api.defaults.headers.common['Authorization'];
        setUsuario(null);
    };

    const pode = (permissao) => {
        if (!usuario) return false;
        
        const permissoes = {
            dono: ['ver_tudo', 'gerenciar_usuarios', 'ver_margens', 'editar_produtos', 'editar_ingredientes', 'ver_relatorios', 'exportar'],
            gerente: ['editar_produtos', 'editar_ingredientes', 'ver_relatorios', 'exportar'],
            atendente: []
        };
        
        return permissoes[usuario.perfil]?.includes(permissao) || false;
    };

    return (
        <AuthContext.Provider value={{ usuario, loading, login, registrar, logout, pode }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}