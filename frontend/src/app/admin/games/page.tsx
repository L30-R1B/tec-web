'use client';

import { useEffect, useState } from 'react';
import Button from "@/app/components/button";
import { useRouter } from 'next/navigation';

export default function UsersAdminPage() {
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem('bingoToken');
        setToken(storedToken);
        
        if (!storedToken) {
            window.location.href = '/login';
            return;
        }
    }, []);

    const handleBackToDashboard = () => {
        router.push('/admin');
    };

    return (
        <div className="page-container">
            <header>
                <nav className="navbar">
                    <div className="navbar-content" style={{ width: "100%" }}>
                        <img
                            src="/bingo-logo.png"
                            alt="logo"
                            className="navbar-logo"
                        />

                        <div className="navbar-links">
                            <a className="nav-links">Gerenciar Usuários</a>
                        </div>

                        <div style={{ marginLeft: "auto", paddingRight: "40px", display: 'flex', gap: '10px' }}>
                            <Button variant="primary" onClick={handleBackToDashboard}>
                                Voltar ao Painel
                            </Button>
                            <Button variant="primary" onClick={() => {
                                localStorage.removeItem('bingoToken');
                                window.location.href = '/login';
                            }}>
                                Sair
                            </Button>
                        </div>
                    </div>
                </nav>
            </header>

            <main style={{ padding: '40px 20px', textAlign: 'center' }}>
                <h1 className="title">Gerenciar Usuários</h1>
                <p style={{ fontSize: '18px', color: '#666', marginTop: '20px' }}>
                    Funcionalidade em desenvolvimento...
                </p>
            </main>
        </div>
    );
}