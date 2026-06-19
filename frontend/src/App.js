import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/pages/Login';
import Dashboard from './components/pages/Dashboard';
import './assets/css/global.css';

function AppContent() {
    const { usuario } = useAuth();

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