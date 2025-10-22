// src/app/room/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/button";
import RoomsCarousel from "@/app/components/RoomsCarousel";
import { useAuth } from "@/contexts/AuthContext";

export default function ChooseRoom() {
    const { user, logout, loading } = useAuth();
    const router = useRouter();
    const [showProfile, setShowProfile] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const handleAdminPanel = () => {
        router.push("/admin");
    };

    if (loading || !user) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                backgroundColor: 'var(--yellow-bg)'
            }}>
                <p style={{ fontSize: '24px', color: 'var(--primary-green)' }}>Carregando...</p>
            </div>
        );
    }

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
                            <a className="nav-links">Como jogar</a>
                            <a className="nav-links">Salas</a>
                            <a 
                                className="nav-links" 
                                onClick={() => setShowProfile(!showProfile)}
                                style={{ cursor: 'pointer' }}
                            >
                                Minha conta
                            </a>
                            {user.is_admin && (
                                <a 
                                    className="nav-links"
                                    onClick={handleAdminPanel}
                                    style={{ 
                                        cursor: 'pointer',
                                        color: '#dc2626',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Painel Admin
                                </a>
                            )}
                        </div>

                        <div style={{ marginLeft: "auto", paddingRight: "40px" }}>
                            <Button variant="primary" onClick={handleLogout}>
                                Sair
                            </Button>
                        </div>
                    </div>
                </nav>
            </header>

            {showProfile && (
                <div style={{
                    maxWidth: '1200px',
                    margin: '20px auto',
                    padding: '24px',
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{ 
                        color: 'var(--primary-green)', 
                        marginBottom: '16px',
                        fontSize: '28px'
                    }}>
                        Meu Perfil
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <p><strong>Nome:</strong> {user.nome}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Saldo:</strong> R$ {user.saldo.toFixed(2)}</p>
                        <p><strong>Tipo:</strong> {user.is_admin ? 'Administrador' : 'Usuário'}</p>
                    </div>
                </div>
            )}

            <main>
                <div className="choose-room-container">
                    <h1 className="title">
                        Olá, {user.nome}! Escolha sua sala e parta para a diversão!
                    </h1>
                    <RoomsCarousel />
                </div>
            </main>
        </div>
    );
}