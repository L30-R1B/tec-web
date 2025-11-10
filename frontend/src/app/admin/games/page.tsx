'use client';

import { useEffect, useState } from 'react';
import Button from "@/app/components/button";
import { useRouter } from 'next/navigation';

const API_BASE = 'http://localhost:3333';

interface Game {
    id_jogo: number;
    id_sala: number;
    data_hora: string;
    preco_cartela: number | any;
    sala_nome?: string;
}

interface Room {
    id_sala: number;
    nome: string;
}

export default function GamesAdminPage() {
    const [games, setGames] = useState<Game[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingGame, setEditingGame] = useState<Game | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [gameToDelete, setGameToDelete] = useState<Game | null>(null);
    const [formData, setFormData] = useState({
        id_sala: '',
        data_hora: '',
        preco_cartela: ''
    });
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem('bingoToken');
        setToken(storedToken);

        const checkAdminAndLoadData = async () => {
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

                // Carregar jogos e salas
                await Promise.all([
                    loadGames(storedToken),
                    loadRooms(storedToken)
                ]);
            } catch (error) {
                console.error('Erro:', error);
                setError('Erro ao carregar dados.');
            } finally {
                setLoading(false);
            }
        };

        checkAdminAndLoadData();
    }, []);

    const loadGames = async (authToken: string) => {
        try {
            const response = await fetch(`${API_BASE}/games`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (response.ok) {
                const gamesData = await response.json();
                console.log('Dados recebidos da API:', gamesData); // Para debug
                
                // Enriquecer dados dos jogos com nome da sala
                const gamesWithRoomNames = await Promise.all(
                    gamesData.map(async (game: Game) => {
                        try {
                            const roomResponse = await fetch(`${API_BASE}/rooms/${game.id_sala}`, {
                                headers: {
                                    'Authorization': `Bearer ${authToken}`
                                }
                            });
                            if (roomResponse.ok) {
                                const roomData = await roomResponse.json();
                                return { 
                                    ...game, 
                                    sala_nome: roomData.nome,
                                    // Converter preco_cartela para número se for objeto Decimal
                                    preco_cartela: convertDecimalToNumber(game.preco_cartela)
                                };
                            }
                        } catch (error) {
                            console.error('Erro ao carregar dados da sala:', error);
                        }
                        return {
                            ...game,
                            // Converter preco_cartela para número se for objeto Decimal
                            preco_cartela: convertDecimalToNumber(game.preco_cartela)
                        };
                    })
                );
                setGames(gamesWithRoomNames);
            } else {
                setError('Erro ao carregar jogos.');
            }
        } catch (error) {
            setError('Erro ao carregar jogos.');
        }
    };

    // Função auxiliar para converter Decimal para número
    const convertDecimalToNumber = (value: any): number => {
        if (value === null || value === undefined) return 0;
        
        // Se for um objeto Decimal do Prisma
        if (typeof value === 'object' && value !== null) {
            // Tenta acessar propriedades comuns do Decimal
            if (typeof value.toNumber === 'function') {
                return value.toNumber();
            }
            if (value.toString) {
                return parseFloat(value.toString());
            }
        }
        
        // Se já for número ou string convertível
        return Number(value) || 0;
    };

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

    const handleDeleteClick = (game: Game) => {
        setGameToDelete(game);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!gameToDelete || !token) return;

        try {
            const response = await fetch(`${API_BASE}/games/${gameToDelete.id_jogo}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setGames(games.filter(game => game.id_jogo !== gameToDelete.id_jogo));
                setShowDeleteModal(false);
                setGameToDelete(null);
            } else {
                alert('Erro ao excluir jogo.');
            }
        } catch (error) {
            alert('Erro ao excluir jogo.');
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setGameToDelete(null);
    };

    const handleEditGame = (game: Game) => {
        setEditingGame(game);
        
        // Converter a data ISO para o formato do input datetime-local
        const dataHoraLocal = new Date(game.data_hora);
        const offset = dataHoraLocal.getTimezoneOffset() * 60000;
        const localISOTime = new Date(dataHoraLocal.getTime() - offset).toISOString().slice(0, 16);
        
        // Converter preco_cartela para número antes de exibir
        const precoNumerico = convertDecimalToNumber(game.preco_cartela);
        
        setFormData({
            id_sala: game.id_sala.toString(),
            data_hora: localISOTime,
            preco_cartela: precoNumerico.toString()
        });
        setShowForm(true);
    };

    const handleCreateGame = () => {
        setEditingGame(null);
        setFormData({
            id_sala: '',
            data_hora: '',
            preco_cartela: ''
        });
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        try {
            const url = editingGame ? `${API_BASE}/games/${editingGame.id_jogo}` : `${API_BASE}/games`;
            const method = editingGame ? 'PATCH' : 'POST';

            // Converter para formato ISO-8601 que o Prisma espera
            const dataHoraISO = new Date(formData.data_hora).toISOString();

            const body = {
                id_sala: Number(formData.id_sala),
                data_hora: dataHoraISO, // Agora no formato ISO-8601
                preco_cartela: Number(formData.preco_cartela)
            };

            console.log('Enviando dados:', body); // Para debug

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                setShowForm(false);
                await loadGames(token);
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Erro ao salvar jogo.');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao salvar jogo.');
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
                            <a className="nav-links">Gerenciar Jogos</a>
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
                <h1 className="title">Gerenciar Jogos</h1>

                <Button variant="primary" onClick={handleCreateGame} style={{ marginBottom: '20px' }}>
                    Criar Jogo
                </Button>

                {/* Modal para Criar/Editar Jogo */}
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
                                {editingGame ? 'Editar Jogo' : 'Criar Novo Jogo'}
                            </h2>
                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ 
                                        color: 'white', 
                                        display: 'block', 
                                        marginBottom: '8px',
                                        fontWeight: 'bold'
                                    }}>
                                        Sala:
                                    </label>
                                    <select
                                        value={formData.id_sala}
                                        onChange={(e) => setFormData({ ...formData, id_sala: e.target.value })}
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
                                    >
                                        <option value="">Selecione uma sala</option>
                                        {rooms.map(room => (
                                            <option key={room.id_sala} value={room.id_sala}>
                                                {room.nome}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ 
                                        color: 'white', 
                                        display: 'block', 
                                        marginBottom: '8px',
                                        fontWeight: 'bold'
                                    }}>
                                        Data e Hora:
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={formData.data_hora}
                                        onChange={(e) => setFormData({ ...formData, data_hora: e.target.value })}
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
                                    />
                                </div>
                                <div style={{ marginBottom: '25px' }}>
                                    <label style={{ 
                                        color: 'white', 
                                        display: 'block', 
                                        marginBottom: '8px',
                                        fontWeight: 'bold'
                                    }}>
                                        Preço da Cartela (R$):
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.preco_cartela}
                                        onChange={(e) => setFormData({ ...formData, preco_cartela: e.target.value })}
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
                                        placeholder="0.00"
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
                                        {editingGame ? 'Atualizar' : 'Criar'} Jogo
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
                {showDeleteModal && gameToDelete && (
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
                                Tem certeza que deseja excluir o jogo?<br />
                                <strong>ID: {gameToDelete.id_jogo}</strong>
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
                    backgroundColor: '#1a5f1a',
                    borderRadius: '12px',
                    padding: '20px',
                    marginTop: '20px',
                    overflowX: 'auto'
                }}>
                    <table style={{ 
                        width: '100%', 
                        borderCollapse: 'collapse',
                        color: 'white'
                    }}>
                        <thead>
                            <tr>
                                <th style={{ 
                                    border: '1px solid #2d7a2d', 
                                    padding: '12px',
                                    textAlign: 'left',
                                    backgroundColor: '#2d5016'
                                }}>
                                    ID
                                </th>
                                <th style={{ 
                                    border: '1px solid #2d7a2d', 
                                    padding: '12px',
                                    textAlign: 'left',
                                    backgroundColor: '#2d5016'
                                }}>
                                    Sala
                                </th>
                                <th style={{ 
                                    border: '1px solid #2d7a2d', 
                                    padding: '12px',
                                    textAlign: 'left',
                                    backgroundColor: '#2d5016'
                                }}>
                                    Data e Hora
                                </th>
                                <th style={{ 
                                    border: '1px solid #2d7a2d', 
                                    padding: '12px',
                                    textAlign: 'left',
                                    backgroundColor: '#2d5016'
                                }}>
                                    Preço Cartela (R$)
                                </th>
                                <th style={{ 
                                    border: '1px solid #2d7a2d', 
                                    padding: '12px',
                                    textAlign: 'left',
                                    backgroundColor: '#2d5016'
                                }}>
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {games.map(game => (
                                <tr key={game.id_jogo} style={{ 
                                    backgroundColor: game.id_jogo % 2 === 0 ? '#1a5f1a' : '#2d5016'
                                }}>
                                    <td style={{ 
                                        border: '1px solid #2d7a2d', 
                                        padding: '12px'
                                    }}>
                                        {game.id_jogo}
                                    </td>
                                    <td style={{ 
                                        border: '1px solid #2d7a2d', 
                                        padding: '12px'
                                    }}>
                                        {game.sala_nome || `Sala ${game.id_sala}`}
                                    </td>
                                    <td style={{ 
                                        border: '1px solid #2d7a2d', 
                                        padding: '12px'
                                    }}>
                                        {new Date(game.data_hora).toLocaleString('pt-BR')}
                                    </td>
                                    <td style={{ 
                                        border: '1px solid #2d7a2d', 
                                        padding: '12px'
                                    }}>
                                        R$ {convertDecimalToNumber(game.preco_cartela).toFixed(2)}
                                    </td>
                                    <td style={{ 
                                        border: '1px solid #2d7a2d', 
                                        padding: '12px'
                                    }}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <Button 
                                                variant="primary" 
                                                onClick={() => handleEditGame(game)}
                                                style={{ 
                                                    backgroundColor: '#4a752c',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '8px 12px',
                                                    borderRadius: '6px',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                Editar
                                            </Button>
                                            <Button 
                                                variant="secondary" 
                                                onClick={() => handleDeleteClick(game)}
                                                style={{ 
                                                    backgroundColor: 'transparent',
                                                    color: '#ff6b6b',
                                                    border: '1px solid #ff6b6b',
                                                    padding: '8px 12px',
                                                    borderRadius: '6px',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                Excluir
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {games.length === 0 && !loading && (
                    <div style={{ 
                        textAlign: 'center', 
                        color: '#666', 
                        marginTop: '50px',
                        fontSize: '18px'
                    }}>
                        Nenhum jogo cadastrado.
                    </div>
                )}
            </main>
        </div>
    );
}