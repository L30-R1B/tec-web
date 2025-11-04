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

export default function RoomsAdminPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
    const [formData, setFormData] = useState({
        nome: '',
        descricao: ''
    });
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Acessar localStorage apenas no cliente
        const storedToken = localStorage.getItem('bingoToken');
        setToken(storedToken);

        const checkAdminAndLoadRooms = async () => {
            if (!storedToken) {
                window.location.href = '/login';
                return;
            }

            try {
                // Verificar se é admin
                const profileResponse = await fetch(`${API_BASE}/auth/profile`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${storedToken}`
                    }
                });

                if (profileResponse.ok) {
                    const userData = await profileResponse.json();
                    if (!userData.is_admin) {
                        window.location.href = '/rooms';
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

        checkAdminAndLoadRooms();
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

    const handleDeleteClick = (room: Room) => {
        setRoomToDelete(room);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!roomToDelete || !token) return;

        try {
            const response = await fetch(`${API_BASE}/rooms/${roomToDelete.id_sala}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setRooms(rooms.filter(room => room.id_sala !== roomToDelete.id_sala));
                setShowDeleteModal(false);
                setRoomToDelete(null);
            } else {
                alert('Erro ao excluir sala.');
            }
        } catch (error) {
            alert('Erro ao excluir sala.');
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setRoomToDelete(null);
    };

    const handleEditRoom = (room: Room) => {
        setEditingRoom(room);
        setFormData({
            nome: room.nome,
            descricao: room.descricao || ''
        });
        setShowForm(true);
    };

    const handleCreateRoom = () => {
        setEditingRoom(null);
        setFormData({
            nome: '',
            descricao: ''
        });
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        try {
            const url = editingRoom ? `${API_BASE}/rooms/${editingRoom.id_sala}` : `${API_BASE}/rooms`;
            const method = editingRoom ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setShowForm(false);
                await loadRooms(token);
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Erro ao salvar sala.');
            }
        } catch (error) {
            alert('Erro ao salvar sala.');
        }
    };

    const handleBackToDashboard = () => {
        router.push('/admin');
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
                            <a className="nav-links">Gerenciar Salas</a>
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

            <main style={{ padding: '20px' }}>
                <h1 className="title">Gerenciar Salas</h1>

                <Button variant="primary" onClick={handleCreateRoom} style={{ marginBottom: '20px' }}>
                    Criar Sala
                </Button>

                {/* Modal para Criar/Editar Sala */}
                {showForm && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }}>
                        <div style={{
                            backgroundColor: '#2d5016',
                            padding: '30px',
                            borderRadius: '12px',
                            width: '90%',
                            maxWidth: '500px',
                            border: '2px solid #4a752c',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.5)'
                        }}>
                            <h2 style={{ 
                                color: 'white', 
                                marginBottom: '20px',
                                textAlign: 'center',
                                fontSize: '1.5em'
                            }}>
                                {editingRoom ? 'Editar Sala' : 'Criar Nova Sala'}
                            </h2>
                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ 
                                        color: 'white', 
                                        display: 'block', 
                                        marginBottom: '8px',
                                        fontWeight: 'bold'
                                    }}>
                                        Nome da Sala:
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.nome}
                                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                        required
                                        style={{ 
                                            width: '100%', 
                                            padding: '12px',
                                            borderRadius: '6px',
                                            border: '2px solid #4a752c',
                                            backgroundColor: '#1a3d0f',
                                            color: 'white',
                                            fontSize: '16px'
                                        }}
                                        placeholder="Digite o nome da sala"
                                    />
                                </div>
                                <div style={{ marginBottom: '25px' }}>
                                    <label style={{ 
                                        color: 'white', 
                                        display: 'block', 
                                        marginBottom: '8px',
                                        fontWeight: 'bold'
                                    }}>
                                        Descrição:
                                    </label>
                                    <textarea
                                        value={formData.descricao}
                                        onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                                        style={{ 
                                            width: '100%', 
                                            padding: '12px',
                                            borderRadius: '6px',
                                            border: '2px solid #4a752c',
                                            backgroundColor: '#1a3d0f',
                                            color: 'white',
                                            fontSize: '16px',
                                            minHeight: '100px',
                                            resize: 'vertical'
                                        }}
                                        placeholder="Digite a descrição da sala (opcional)"
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                                    <Button 
                                        type="submit" 
                                        variant="primary"
                                        style={{ 
                                            backgroundColor: '#4a752c',
                                            border: 'none',
                                            padding: '12px 24px',
                                            fontSize: '16px'
                                        }}
                                    >
                                        {editingRoom ? 'Atualizar' : 'Criar'} Sala
                                    </Button>
                                    <Button 
                                        type="button" 
                                        variant="secondary" 
                                        onClick={() => setShowForm(false)}
                                        style={{ 
                                            backgroundColor: 'transparent',
                                            border: '2px solid #4a752c',
                                            color: 'white',
                                            padding: '12px 24px',
                                            fontSize: '16px'
                                        }}
                                    >
                                        Cancelar
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal de Confirmação de Exclusão */}
                {showDeleteModal && roomToDelete && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }}>
                        <div style={{
                            backgroundColor: '#2d5016',
                            padding: '30px',
                            borderRadius: '12px',
                            width: '90%',
                            maxWidth: '400px',
                            border: '2px solid #4a752c',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.5)',
                            textAlign: 'center'
                        }}>
                            <h3 style={{ 
                                color: 'white', 
                                marginBottom: '15px',
                                fontSize: '1.3em'
                            }}>
                                Confirmar Exclusão
                            </h3>
                            <p style={{ 
                                color: 'white', 
                                marginBottom: '25px',
                                fontSize: '16px',
                                lineHeight: '1.5'
                            }}>
                                Tem certeza que deseja excluir a sala<br />
                                <strong>"{roomToDelete.nome}"</strong>?
                            </p>
                            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                                <Button 
                                    variant="primary"
                                    onClick={handleConfirmDelete}
                                    style={{ 
                                        backgroundColor: '#d32f2f',
                                        border: 'none',
                                        padding: '12px 24px',
                                        fontSize: '16px'
                                    }}
                                >
                                    Confirmar Exclusão
                                </Button>
                                <Button 
                                    variant="secondary" 
                                    onClick={handleCancelDelete}
                                    style={{ 
                                        backgroundColor: 'transparent',
                                        border: '2px solid #4a752c',
                                        color: 'white',
                                        padding: '12px 24px',
                                        fontSize: '16px'
                                    }}
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>{error}</div>}

                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                    gap: '25px',
                    marginTop: '20px'
                }}>
                    {rooms.map(room => (
                        <div key={room.id_sala} style={{
                            backgroundColor: '#1a5f1a',
                            padding: '25px',
                            borderRadius: '12px',
                            color: 'white',
                            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '15px',
                            border: '2px solid #2d7a2d',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.3)';
                        }}
                        >
                            <h3 style={{ 
                                margin: 0, 
                                fontSize: '1.3em',
                                textAlign: 'center',
                                fontWeight: 'bold'
                            }}>
                                {room.nome}
                            </h3>
                            {room.descricao && (
                                <p style={{ 
                                    margin: 0, 
                                    opacity: 0.9, 
                                    textAlign: 'center',
                                    lineHeight: '1.4'
                                }}>
                                    {room.descricao}
                                </p>
                            )}
                            <div style={{ 
                                display: 'flex', 
                                gap: '12px', 
                                marginTop: 'auto',
                                justifyContent: 'center'
                            }}>
                                <Button 
                                    variant="primary" 
                                    onClick={() => handleEditRoom(room)}
                                    style={{ 
                                        backgroundColor: '#4a752c',
                                        color: 'white',
                                        border: 'none',
                                        padding: '10px 16px',
                                        borderRadius: '6px',
                                        fontSize: '14px'
                                    }}
                                >
                                    Editar
                                </Button>
                                <Button 
                                    variant="secondary" 
                                    onClick={() => handleDeleteClick(room)}
                                    style={{ 
                                        backgroundColor: 'transparent',
                                        color: '#ff6b6b',
                                        border: '1px solid #ff6b6b',
                                        padding: '10px 16px',
                                        borderRadius: '6px',
                                        fontSize: '14px'
                                    }}
                                >
                                    Excluir
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
                        fontSize: '18px'
                    }}>
                        Nenhuma sala cadastrada. Clique em "Criar Sala" para adicionar a primeira.
                    </div>
                )}
            </main>
        </div>
    );
}