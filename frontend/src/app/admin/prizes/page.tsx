'use client';

import { useEffect, useState } from 'react';
import Button from "@/app/components/button";
import { useRouter } from 'next/navigation'; // Corrigido

const API_BASE = 'http://localhost:3333';

interface Prize {
  id_premio: number;
  descricao: string;
  valor: any;
  id_jogo: number; // Corrigido
  id_usuario: number;
  jogo_data?: string;
  usuario_nome?: string;
}

interface Game {
  id_jogo: number;
  data_hora: string;
}

interface User {
  id_usuario: number;
  nome: string;
}

// SOLUÇÃO CORRIGIDA para formatDecimal (não mexer)
// Funciona com valores inteiros E quebrados
const formatDecimal = (val: any): string => {
  try {
    // Caso 1: Valor já é um número (ex: 10.50, salvo corretamente)
    if (typeof val === 'number') {
      return val.toFixed(2);
    }
    
    // Caso 2: Valor é uma string (ex: "10.50")
    if (typeof val === 'string') {
      return (parseFloat(val) || 0).toFixed(2);
    }
    
    // Caso 3: Valor é o OBJETO CUSTOMIZADO da API (Decimal.js)
    // Ex: {"s":1, "e":0, "d":[10]} = 10.00 (valor inteiro)
    // Ex: {"s":1, "e":1, "d":[105]} = 10.50 (valor com centavos)
    // Ex: {"s":1, "e":1, "d":[35, 5000000]} = 35.50 (valor com array de 2)
    if (typeof val === 'object' && val !== null && Array.isArray(val.d)) {
      const sign = val.s || 1; // sinal: 1 ou -1
      const exponent = val.e !== undefined ? val.e : 0; // expoente
      
      // Concatenar todos os dígitos do array
      let allDigits = '';
      for (let i = 0; i < val.d.length; i++) {
        if (i === 0) {
          allDigits += val.d[i].toString();
        } else {
          // Dígitos subsequentes precisam de padding de 7 dígitos
          allDigits += val.d[i].toString().padStart(7, '0');
        }
      }
      
      // O expoente indica a posição do ponto decimal
      // e=0 significa que há 1 dígito antes do ponto (ex: 1.0, 9.5)
      // e=1 significa que há 2 dígitos antes do ponto (ex: 10.0, 35.5)
      const decimalPosition = exponent + 1;
      
      // Inserir o ponto decimal na posição correta
      let numStr: string;
      if (decimalPosition <= 0) {
        // Número menor que 1 (ex: 0.05)
        numStr = '0.' + '0'.repeat(-decimalPosition) + allDigits;
      } else if (decimalPosition >= allDigits.length) {
        // Número inteiro (sem casas decimais na representação)
        numStr = allDigits + '0'.repeat(decimalPosition - allDigits.length);
      } else {
        // Número com casas decimais
        numStr = allDigits.slice(0, decimalPosition) + '.' + allDigits.slice(decimalPosition);
      }
      
      const total = parseFloat(numStr) * sign;
      return total.toFixed(2);
    }
    
    // Fallback: Tenta usar toString() (para outros tipos de Decimal.js)
    if (typeof val === 'object' && val !== null && typeof val.toString === 'function') {
       const str = val.toString();
       if (str !== '[object Object]') {
         return (parseFloat(str) || 0).toFixed(2);
       }
    }

    // Fallback final
    console.warn("Formato de decimal desconhecido:", val);
    return '0.00';
  } catch (error) {
    console.error('Erro na conversão:', error);
    return '0.00';
  }
};

export default function PrizesAdminPage() {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingPrize, setEditingPrize] = useState<Prize | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [prizeToDelete, setPrizeToDelete] = useState<Prize | null>(null);
  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    id_jogo: '',
    id_usuario: ''
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

        await Promise.all([
          loadPrizes(storedToken),
          loadGames(storedToken),
          loadUsers(storedToken)
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

  const loadPrizes = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE}/prizes`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        const prizesData = await response.json();
        const prizesWithDetails = await Promise.all(
          prizesData.map(async (prize: Prize) => {
            try {
              const [gameResponse, userResponse] = await Promise.all([
                fetch(`${API_BASE}/games/${prize.id_jogo}`, {
                  headers: { 'Authorization': `Bearer ${authToken}` }
                }),
                fetch(`${API_BASE}/users/${prize.id_usuario}`, {
                  headers: { 'Authorization': `Bearer ${authToken}` }
                })
              ]);

              const gameData = gameResponse.ok ? await gameResponse.json() : null;
              const userData = userResponse.ok ? await userResponse.json() : null;

              return {
                ...prize,
                jogo_data: gameData?.data_hora,
                usuario_nome: userData?.nome
              };
            } catch (error) {
              console.error('Erro ao carregar detalhes:', error);
              return prize;
            }
          })
        );
        setPrizes(prizesWithDetails);
      } else {
        setError('Erro ao carregar prêmios.');
      }
    } catch (error) {
      setError('Erro ao carregar prêmios.');
    }
  };

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
        setGames(gamesData);
      } else {
        setError('Erro ao carregar jogos.');
      }
    } catch (error) {
      setError('Erro ao carregar jogos.');
    }
  };

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
        setUsers(usersData);
      } else {
        setError('Erro ao carregar usuários.');
      }
    } catch (error) {
      setError('Erro ao carregar usuários.');
    }
  };

  const handleDeleteClick = (prize: Prize) => {
    setPrizeToDelete(prize);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!prizeToDelete || !token) return;

    try {
      const response = await fetch(`${API_BASE}/prizes/${prizeToDelete.id_premio}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setPrizes(prizes.filter(prize => prize.id_premio !== prizeToDelete.id_premio));
        setShowDeleteModal(false);
        setPrizeToDelete(null);
      } else {
        alert('Erro ao excluir prêmio.');
      }
    } catch (error) {
      alert('Erro ao excluir prêmio.');
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setPrizeToDelete(null);
  };

  const handleEditPrize = (prize: Prize) => {
    setEditingPrize(prize);
    
    // Usa a função corrigida
    const valorFormatado = formatDecimal(prize.valor); // Corrigido
    
    setFormData({
      descricao: prize.descricao,
      valor: valorFormatado,
      id_jogo: prize.id_jogo.toString(),
      id_usuario: prize.id_usuario.toString()
    });
    setShowForm(true);
  };

  const handleCreatePrize = () => {
    setEditingPrize(null);
    setFormData({
      descricao: '',
      valor: '',
      id_jogo: '',
      id_usuario: ''
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const url = editingPrize ? `${API_BASE}/prizes/${editingPrize.id_premio}` : `${API_BASE}/prizes`;
      const method = editingPrize ? 'PATCH' : 'POST';

      // Envia o valor como número, e id_usuario como nulo se não for selecionado
      const body: any = {
        descricao: formData.descricao,
        valor: parseFloat(formData.valor) || 0,
        id_jogo: Number(formData.id_jogo)
      };

      body.id_usuario = formData.id_usuario ? Number(formData.id_usuario) : null;

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
        await loadPrizes(token);
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Erro ao salvar prêmio.');
      }
    } catch (error) {
      alert('Erro ao salvar prêmio.');
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
            <img src="/bingo-logo.png" alt="logo" className="navbar-logo" />
            <div className="navbar-links">
              <a className="nav-links">Gerenciar Prêmios</a>
            </div>
            <div style={{ marginLeft: "auto", paddingRight: "40px", display: 'flex', gap: '10px' }}>
              <Button variant="primary" onClick={handleBackToDashboard}>Voltar ao Painel</Button>
              <Button variant="primary" onClick={() => {
                localStorage.removeItem('bingoToken');
                window.location.href = '/login';
              }}>Sair</Button>
            </div>
          </div>
        </nav>
      </header>

      <main style={{ padding: '20px' }}>
        <h1 className="title">Gerenciar Prêmios</h1>

        <Button variant="primary" onClick={handleCreatePrize} style={{ marginBottom: '20px' }}>
          Criar Prêmio
        </Button>

        {showForm && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex',
            justifyContent: 'center', alignItems: 'center', zIndex: 1000
          }}>
            <div style={{
              backgroundColor: '#2d5016', padding: '30px', borderRadius: '12px',
              width: '90%', maxWidth: '500px', border: '2px solid #4a752c',
              boxShadow: '0 8px 25px rgba(0,0,0,0.5)'
            }}>
              <h2 style={{ color: 'white', marginBottom: '20px', textAlign: 'center', fontSize: '1.5em' }}>
                {editingPrize ? 'Editar Prêmio' : 'Criar Novo Prêmio'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ color: 'white', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Descrição:
                  </label>
                  <input
                    type="text"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    required
                    style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '2px solid #4a752c', backgroundColor: '#1a3d0f', color: 'white', fontSize: '16px' }}
                    placeholder="Digite a descrição do prêmio"
                  />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ color: 'white', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Valor (R$):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.valor}
                    onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                    required
                    style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '2px solid #4a752c', backgroundColor: '#1a3d0f', color: 'white', fontSize: '16px' }}
                    placeholder="0.00"
                  />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ color: 'white', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Jogo:
                  </label>
                  <select
                    value={formData.id_jogo}
                    onChange={(e) => setFormData({ ...formData, id_jogo: e.target.value })}
                    required
                    style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '2px solid #4a752c', backgroundColor: '#1a3d0f', color: 'white', fontSize: '16px' }}
                  >
                    <option value="">Selecione um jogo</option>
                    {games.map(game => (
                      <option key={game.id_jogo} value={game.id_jogo}>
                        Jogo {game.id_jogo} ({new Date(game.data_hora).toLocaleDateString('pt-BR')})
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ marginBottom: '25px' }}>
                  <label style={{ color: 'white', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Usuário:
                  </label>
                  <select
                    value={formData.id_usuario}
                    onChange={(e) => setFormData({ ...formData, id_usuario: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '2px solid #4a752c', backgroundColor: '#1a3d0f', color: 'white', fontSize: '16px' }}
                  >
                    <option value="">Selecione um usuário</option>
                    {users.map(user => (
                      <option key={user.id_usuario} value={user.id_usuario}>
                        {user.nome} (ID: {user.id_usuario})
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                  <Button type="submit" variant="primary" style={{ backgroundColor: '#4a752c', border: 'none', padding: '12px 24px', fontSize: '16px' }}>
                    {editingPrize ? 'Atualizar' : 'Criar'} Prêmio
                  </Button>
                  <Button type="button" variant="secondary" onClick={() => setShowForm(false)} style={{ backgroundColor: 'transparent', border: '2px solid #4a752c', color: 'white', padding: '12px 24px', fontSize: '16px' }}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showDeleteModal && prizeToDelete && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex',
            justifyContent: 'center', alignItems: 'center', zIndex: 1000
          }}>
            <div style={{
              backgroundColor: '#2d5016', padding: '30px', borderRadius: '12px',
              width: '90%', maxWidth: '400px', border: '2px solid #4a752c',
              boxShadow: '0 8px 25px rgba(0,0,0,0.5)', textAlign: 'center'
            }}>
              <h3 style={{ color: 'white', marginBottom: '15px', fontSize: '1.3em' }}>
                Confirmar Exclusão
              </h3>
              <p style={{ color: 'white', marginBottom: '25px', fontSize: '16px', lineHeight: '1.5' }}>
                Tem certeza que deseja excluir o prêmio?<br />
                <strong>"{prizeToDelete.descricao}"</strong>?
              </p>
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                <Button variant="primary" onClick={handleConfirmDelete} style={{ backgroundColor: '#d32f2f', border: 'none', padding: '12px 24px', fontSize: '16px' }}>
                  Confirmar Exclusão
                </Button>
                <Button variant="secondary" onClick={handleCancelDelete} style={{ backgroundColor: 'transparent', border: '2px solid #4a752c', color: 'white', padding: '12px 24px', fontSize: '16px' }}>
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}

        {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>{error}</div>}

        <div style={{ backgroundColor: '#1a5f1a', borderRadius: '12px', padding: '20px', marginTop: '20px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #2d7a2d', padding: '12px', textAlign: 'left', backgroundColor: '#2d5016' }}>ID</th>
                <th style={{ border: '1px solid #2d7a2d', padding: '12px', textAlign: 'left', backgroundColor: '#2d5016' }}>Descrição</th>
                <th style={{ border: '1px solid #2d7a2d', padding: '12px', textAlign: 'left', backgroundColor: '#2d5016' }}>Valor (R$)</th>
                <th style={{ border: '1px solid #2d7a2d', padding: '12px', textAlign: 'left', backgroundColor: '#2d5016' }}>Jogo</th>
                <th style={{ border: '1px solid #2d7a2d', padding: '12px', textAlign: 'left', backgroundColor: '#2d5016' }}>Usuário</th>
                <th style={{ border: '1px solid #2d7a2d', padding: '12px', textAlign: 'left', backgroundColor: '#2d5016' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {prizes.map(prize => (
                <tr key={prize.id_premio} style={{ backgroundColor: prize.id_premio % 2 === 0 ? '#1a5f1a' : '#2d5016' }}>
                  <td style={{ border: '1px solid #2d7a2d', padding: '12px' }}>{prize.id_premio}</td>
                  <td style={{ border: '1px solid #2d7a2d', padding: '12px' }}>{prize.descricao}</td>
                  {/* Usa a função corrigida */}
                  <td style={{ border: '1px solid #2d7a2d', padding: '12px' }}>R$ {formatDecimal(prize.valor)}</td>
                  <td style={{ border: '1px solid #2d7a2d', padding: '12px' }}>{prize.jogo_data ? `Jogo ${prize.id_jogo} (${new Date(prize.jogo_data).toLocaleDateString('pt-BR')})` : `Jogo ${prize.id_jogo}`}</td>
                  <td style={{ border: '1px solid #2d7a2d', padding: '12px' }}>{prize.usuario_nome || `Usuário ${prize.id_usuario}`}</td>
                  <td style={{ border: '1px solid #2d7a2d', padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button variant="primary" onClick={() => handleEditPrize(prize)} style={{ backgroundColor: '#4a752c', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', fontSize: '14px' }}>
                        Editar
                      </Button>
                      <Button variant="secondary" onClick={() => handleDeleteClick(prize)} style={{ backgroundColor: 'transparent', color: '#ff6b6b', border: '1px solid #ff6b6b', padding: '8px 12px', borderRadius: '6px', fontSize: '14px' }}>
                        Excluir
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {prizes.length === 0 && !loading && (
          <div style={{ textAlign: 'center', color: '#666', marginTop: '50px', fontSize: '18px' }}>
            Nenhum prêmio cadastrado.
          </div>
        )}
      </main>
    </div>
  );
}