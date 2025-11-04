'use client';

import { useEffect, useState } from 'react';
import Button from "@/app/components/button";
import { useRouter } from 'next/navigation';

const API_BASE = 'http://localhost:3333';

interface Room {
    id_sala: number;
    nome: string;
    descricao?: string;
}

export default function RoomsPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        // Acessar localStorage apenas no cliente
        const storedToken = localStorage.getItem('bingoToken');
        setToken(storedToken);

        const checkAuthAndLoadRooms = async () => {
            if (!storedToken) {
                window.location.href = '/login';
                return;
            }

            try {
                // Verificar perfil do usuário
                const profileResponse = await fetch(`${API_BASE}/auth/profile`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${storedToken}`
                    }
                });

                if (profileResponse.ok) {
                    const userData = await profileResponse.json();
                    setUser(userData);
                    
                    // Se for admin, redireciona para o painel admin
                    if (userData.is_admin) {
                        window.location.href = '/admin';
                        return;
                    }
                } else {
                    window.location.href = '/login';
                    return;
                }

                // Carregar salas
                await loadRooms(storedToken);
            } catch (error) {
                console.error('Erro:', error);
                setError('Erro ao carregar dados.');
            } finally {
                setLoading(false);
            }
        };

        checkAuthAndLoadRooms();
    }, []);

    const loadRooms = async (authToken: string) => {
        try {
            const response = await fetch(`${API_BASE}/rooms`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (response.ok) {
                const roomsData = await response.json();
                setRooms(roomsData);
            } else {
                setError('Erro ao carregar salas.');
            }
        } catch (error) {
            setError('Erro ao carregar salas.');
        }
    };

    const handleEnterRoom = (roomId: number) => {
        // Aqui você pode implementar a lógica para entrar na sala
        // Por enquanto, vamos apenas mostrar um alerta
        alert(`Entrando na sala ${roomId} - Funcionalidade em desenvolvimento`);
    };

    const handleLogout = () => {
        localStorage.removeItem('bingoToken');
        window.location.href = '/login';
    };

    if (loading) {
        return <div>Carregando...</div>;
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
                            <a className="nav-links">Salas de Bingo</a>
                        </div>

                        <div style={{ 
                            marginLeft: "auto", 
                            paddingRight: "40px", 
                            display: 'flex', 
                            alignItems: 'center',
                            gap: '15px'
                        }}>
                            {user && (
                                <span style={{ color: 'white' }}>
                                    Olá, {user.nome}!
                                </span>
                            )}
                            <Button variant="primary" onClick={handleLogout}>
                                Sair
                            </Button>
                        </div>
                    </div>
                </nav>
            </header>

            <main style={{ padding: '20px' }}>
                <h1 className="title" style={{ textAlign: 'center', marginBottom: '30px' }}>
                    Salas de Bingo Disponíveis
                </h1>

                {error && (
                    <div style={{ 
                        color: 'red', 
                        textAlign: 'center', 
                        marginBottom: '20px',
                        padding: '10px',
                        backgroundColor: '#ffe6e6',
                        borderRadius: '5px'
                    }}>
                        {error}
                    </div>
                )}

                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                    gap: '25px',
                    marginTop: '20px'
                }}>
                    {rooms.map(room => (
                        <div key={room.id_sala} style={{
                            backgroundColor: '#1a5f1a',
                            padding: '30px',
                            borderRadius: '12px',
                            color: 'white',
                            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                            border: '2px solid #2d7a2d',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            cursor: 'pointer',
                            textAlign: 'center'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.3)';
                        }}
                        onClick={() => handleEnterRoom(room.id_sala)}
                        >
                            <div style={{
                                backgroundColor: '#2d7a2d',
                                borderRadius: '50%',
                                width: '80px',
                                height: '80px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto',
                                fontSize: '2em'
                            }}>
                                🏠
                            </div>
                            
                            <h3 style={{ 
                                margin: 0, 
                                fontSize: '1.4em',
                                fontWeight: 'bold'
                            }}>
                                {room.nome}
                            </h3>
                            
                            {room.descricao && (
                                <p style={{ 
                                    margin: 0, 
                                    opacity: 0.9, 
                                    lineHeight: '1.5',
                                    fontSize: '1em'
                                }}>
                                    {room.descricao}
                                </p>
                            )}
                            
                            <div style={{ 
                                display: 'flex', 
                                gap: '12px', 
                                marginTop: '10px',
                                justifyContent: 'center'
                            }}>
                                <Button 
                                    variant="primary" 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEnterRoom(room.id_sala);
                                    }}
                                    style={{ 
                                        backgroundColor: '#4a752c',
                                        color: 'white',
                                        border: 'none',
                                        padding: '12px 24px',
                                        borderRadius: '6px',
                                        fontSize: '16px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Entrar na Sala
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {rooms.length === 0 && !loading && (
                    <div style={{ 
                        textAlign: 'center', 
                        color: '#666', 
                        marginTop: '50px',
                        fontSize: '18px',
                        padding: '40px'
                    }}>
                        Nenhuma sala disponível no momento.
                    </div>
                )}

                {/* Informações adicionais para o usuário */}
                <div style={{
                    marginTop: '40px',
                    padding: '20px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    <h3 style={{ color: '#1a5f1a', marginBottom: '15px' }}>
                        Como Jogar?
                    </h3>
                    <p style={{ color: '#666', lineHeight: '1.6' }}>
                        Escolha uma sala acima para começar a jogar Bingo! 
                        Cada sala oferece uma experiência única de jogo com diferentes configurações e prêmios.
                    </p>
                </div>
            </main>
        </div>
    );
}