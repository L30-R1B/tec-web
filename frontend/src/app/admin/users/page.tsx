'use client';

import { useEffect, useState } from 'react';
import Button from "@/app/components/button";
import { useRouter } from 'next/navigation';

const API_BASE = 'http://localhost:3333';

interface User {
    id_usuario: number;
    nome: string;
    email: string;
    is_admin: boolean;
    creditos: number;
}

export default function UsersAdminPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        is_admin: false
    });
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem('bingoToken');
        setToken(storedToken);

        const checkAdminAndLoadUsers = async () => {
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

                // Carregar usuários
                await loadUsers(storedToken);
            } catch (error) {
                console.error('Erro:', error);
                setError('Erro ao carregar dados.');
            } finally {
                setLoading(false);
            }
        };

        checkAdminAndLoadUsers();
    }, []);

    const loadUsers = async (authToken: string) => {
        try {
            const response = await fetch(`${API_BASE}/users`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (response.ok) {
                const usersData = await response.json();
                // Garantir que creditos seja um número
                const processedUsers = usersData.map((user: any) => ({
                    ...user,
                    creditos: Number(user.creditos) || 0
                }));
                setUsers(processedUsers);
            } else {
                setError('Erro ao carregar usuários.');
            }
        } catch (error) {
            setError('Erro ao carregar usuários.');
        }
    };

    const handleDeleteClick = (user: User) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!userToDelete || !token) return;

        try {
            const response = await fetch(`${API_BASE}/users/${userToDelete.id_usuario}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setUsers(users.filter(user => user.id_usuario !== userToDelete.id_usuario));
                setShowDeleteModal(false);
                setUserToDelete(null);
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Erro ao excluir usuário.');
            }
        } catch (error) {
            alert('Erro ao excluir usuário.');
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setUserToDelete(null);
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setFormData({
            nome: user.nome,
            email: user.email,
            senha: '', // Senha em branco, pois não queremos alterar a menos que seja explicitado
            is_admin: user.is_admin
        });
        setShowForm(true);
    };

    const handleCreateUser = () => {
        setEditingUser(null);
        setFormData({
            nome: '',
            email: '',
            senha: '',
            is_admin: false
        });
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        try {
            let url, method, body;

            if (editingUser) {
                // Edição de usuário existente - usar PATCH /users/:id
                url = `${API_BASE}/users/${editingUser.id_usuario}`;
                method = 'PATCH';
                body = {
                    nome: formData.nome,
                    email: formData.email,
                    is_admin: formData.is_admin
                };
                
                // Incluir senha apenas se foi preenchida
                if (formData.senha) {
                    body.senha = formData.senha;
                }
            } else {
                // Criação de novo usuário - usar POST /users
                url = `${API_BASE}/users`;
                method = 'POST';
                body = {
                    nome: formData.nome,
                    email: formData.email,
                    senha: formData.senha,
                    is_admin: formData.is_admin
                };
            }

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
                await loadUsers(token);
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Erro ao salvar usuário.');
            }
        } catch (error) {
            alert('Erro ao salvar usuário.');
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

            <main style={{ padding: '20px' }}>
                <h1 className="title">Gerenciar Usuários</h1>

                <Button variant="primary" onClick={handleCreateUser} style={{ marginBottom: '20px' }}>
                    Criar Usuário
                </Button>

                {/* Modal para Criar/Editar Usuário */}
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
                                {editingUser ? 'Editar Usuário' : 'Criar Novo Usuário'}
                            </h2>
                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ 
                                        color: 'white', 
                                        display: 'block', 
                                        marginBottom: '8px',
                                        fontWeight: 'bold'
                                    }}>
                                        Nome:
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
                                        placeholder="Digite o nome do usuário"
                                    />
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ 
                                        color: 'white', 
                                        display: 'block', 
                                        marginBottom: '8px',
                                        fontWeight: 'bold'
                                    }}>
                                        E-mail:
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                                        placeholder="Digite o e-mail do usuário"
                                    />
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ 
                                        color: 'white', 
                                        display: 'block', 
                                        marginBottom: '8px',
                                        fontWeight: 'bold'
                                    }}>
                                        Senha:
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.senha}
                                        onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                                        placeholder={editingUser ? "Deixe em branco para não alterar" : "Digite a senha"}
                                        required={!editingUser}
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
                                        display: 'flex', 
                                        alignItems: 'center',
                                        gap: '10px',
                                        fontWeight: 'bold'
                                    }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.is_admin}
                                            onChange={(e) => setFormData({ ...formData, is_admin: e.target.checked })}
                                            style={{ 
                                                width: '18px',
                                                height: '18px'
                                            }}
                                        />
                                        Administrador
                                    </label>
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
                                        {editingUser ? 'Atualizar' : 'Criar'} Usuário
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
                {showDeleteModal && userToDelete && (
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
                                Tem certeza que deseja excluir o usuário<br />
                                <strong>"{userToDelete.nome}"</strong>?
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
                                    Nome
                                </th>
                                <th style={{ 
                                    border: '1px solid #2d7a2d', 
                                    padding: '12px',
                                    textAlign: 'left',
                                    backgroundColor: '#2d5016'
                                }}>
                                    E-mail
                                </th>
                                <th style={{ 
                                    border: '1px solid #2d7a2d', 
                                    padding: '12px',
                                    textAlign: 'left',
                                    backgroundColor: '#2d5016'
                                }}>
                                    Admin
                                </th>
                                <th style={{ 
                                    border: '1px solid #2d7a2d', 
                                    padding: '12px',
                                    textAlign: 'left',
                                    backgroundColor: '#2d5016'
                                }}>
                                    Créditos
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
                            {users.map(user => (
                                <tr key={user.id_usuario} style={{ 
                                    backgroundColor: user.id_usuario % 2 === 0 ? '#1a5f1a' : '#2d5016',
                                    transition: 'background-color 0.2s ease'
                                }}>
                                    <td style={{ 
                                        border: '1px solid #2d7a2d', 
                                        padding: '12px'
                                    }}>
                                        {user.id_usuario}
                                    </td>
                                    <td style={{ 
                                        border: '1px solid #2d7a2d', 
                                        padding: '12px'
                                    }}>
                                        {user.nome}
                                    </td>
                                    <td style={{ 
                                        border: '1px solid #2d7a2d', 
                                        padding: '12px'
                                    }}>
                                        {user.email}
                                    </td>
                                    <td style={{ 
                                        border: '1px solid #2d7a2d', 
                                        padding: '12px'
                                    }}>
                                        {user.is_admin ? (
                                            <span style={{ 
                                                color: '#4CAF50',
                                                fontWeight: 'bold'
                                            }}>
                                                Sim
                                            </span>
                                        ) : (
                                            <span style={{ 
                                                color: '#ff6b6b'
                                            }}>
                                                Não
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ 
                                        border: '1px solid #2d7a2d', 
                                        padding: '12px'
                                    }}>
                                        R$ {Number(user.creditos || 0).toFixed(2)}
                                    </td>
                                    <td style={{ 
                                        border: '1px solid #2d7a2d', 
                                        padding: '12px'
                                    }}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <Button 
                                                variant="primary" 
                                                onClick={() => handleEditUser(user)}
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
                                                onClick={() => handleDeleteClick(user)}
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

                {users.length === 0 && !loading && (
                    <div style={{ 
                        textAlign: 'center', 
                        color: '#666', 
                        marginTop: '50px',
                        fontSize: '18px'
                    }}>
                        Nenhum usuário cadastrado.
                    </div>
                )}
            </main>
        </div>
    );
}
