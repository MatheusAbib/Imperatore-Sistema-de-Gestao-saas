import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/pages/Login';
import Dashboard from './components/pages/Dashboard';
import { startKeepAlive } from './services/keepAlive';
import './assets/css/global.css';

function AppContent() {
    const { usuario } = useAuth();

    useEffect(() => {
        const intervalId = startKeepAlive(30);
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, []);

    if (!usuario) {
        return <Login />;
    }

    return <Dashboard />;
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;