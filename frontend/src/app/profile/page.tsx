// app/profile/page.tsx
'use client';

import { useEffect, useState } from 'react';
import UserLayout from '../components/UserLayout';
import Button from '../components/button';

const API_BASE = typeof window !== 'undefined' ? (window.location.hostname === 'localhost' ? 'http://localhost:3333' : 'http://100.124.95.109:3333') : 'http://localhost:3333';

interface UserProfile {
  id: number;
  nome: string;
  email: string;
  creditos: number;
}

interface GameHistory {
  id_jogo: number;
  data_hora: string;
  quantidade_cartelas: number;
  valor_total: any;
  status: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: ''
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const formatDecimal = (val: any): number => {
    try {
      if (typeof val === 'number') {
        return val;
      }
      if (typeof val === 'string') {
        return parseFloat(val) || 0;
      }
      if (typeof val === 'object' && val !== null && Array.isArray(val.d)) {
        const sign = val.s || 1;
        const exponent = val.e !== undefined ? val.e : 0;
        let allDigits = '';
        for (let i = 0; i < val.d.length; i++) {
          if (i === 0) {
            allDigits += val.d[i].toString();
          } else {
            allDigits += val.d[i].toString().padStart(7, '0');
          }
        }
        const decimalPosition = exponent + 1;
        let numStr: string;
        if (decimalPosition <= 0) {
          numStr = '0.' + '0'.repeat(-decimalPosition) + allDigits;
        } else if (decimalPosition >= allDigits.length) {
          numStr = allDigits + '0'.repeat(decimalPosition - allDigits.length);
        } else {
          numStr = allDigits.slice(0, decimalPosition) + '.' + allDigits.slice(decimalPosition);
        }
        return parseFloat(numStr) * sign;
      }
      return 0;
    } catch (error) {
      console.error('Erro na conversão de decimal:', error);
      return 0;
    }
  };

  useEffect(() => {
    const loadProfileData = async () => {
      const token = localStorage.getItem('bingoToken');
      if (!token) return;

      try {
        // Carregar perfil
        const profileResponse = await fetch(`${API_BASE}/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (profileResponse.ok) {
          const userData = await profileResponse.json();
          setProfile({
            ...userData,
            creditos: formatDecimal(userData.creditos)
          });
          setFormData({
            nome: userData.nome,
            email: userData.email
          });
        }

        // Carregar histórico de jogos (simulado - você precisará criar esta rota na API)
        const historyResponse = await fetch(`${API_BASE}/users/me/games`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (historyResponse.ok) {
          const historyData = await historyResponse.json();
          setGameHistory(historyData);
        }
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, []);

  const handleUpdateProfile = async () => {
    const token = localStorage.getItem('bingoToken');

    if (passwordData.newPassword || passwordData.confirmPassword) {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        alert('As senhas não coincidem!');
        return;
      }
      if (passwordData.newPassword.length > 0 && passwordData.newPassword.length < 6) {
        alert('A nova senha deve ter pelo menos 6 caracteres.');
        return;
      }
    }

    try {
      const body: { nome: string; email: string; senha?: string } = {
        nome: formData.nome,
        email: formData.email,
      };

      if (passwordData.newPassword) {
        body.senha = passwordData.newPassword;
      }

      const response = await fetch(`${API_BASE}/users/me`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setProfile({
          ...updatedUser,
          creditos: formatDecimal(updatedUser.creditos)
        });
        setEditing(false);
        setPasswordData({
          newPassword: '',
          confirmPassword: ''
        });
        alert('Perfil atualizado com sucesso!');
      } else {
        alert('Erro ao atualizar perfil.');
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      alert('Erro ao atualizar perfil.');
    }
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="loading">Carregando perfil...</div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="profile-container">
        <div className="profile-header">
          <h1 className="title">Meu Perfil</h1>
          <p>Gerencie suas informações e acompanhe seu histórico</p>
        </div>

        <div className="profile-content">
          <div className="profile-card">
            <div className="card-header">
              <h2>Informações Pessoais</h2>
              <Button
                variant="secondary"
                onClick={() => setEditing(!editing)}
              >
                {editing ? 'Cancelar' : 'Editar'}
              </Button>
            </div>

            <div className="profile-info">
              <div className="info-group">
                <label>Nome</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="form-input"
                  />
                ) : (
                  <span className="info-value">{profile?.nome}</span>
                )}
              </div>

              <div className="info-group">
                <label>Email</label>
                {editing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                  />
                ) : (
                  <span className="info-value">{profile?.email}</span>
                )}
              </div>

              {editing && (
                <>
                  <div className="info-group">
                    <label>Nova Senha</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="form-input"
                      placeholder="Deixe em branco para não alterar"
                    />
                  </div>

                  <div className="info-group">
                    <label>Confirmar Nova Senha</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="form-input"
                      placeholder="Repita a nova senha"
                    />
                  </div>
                </>
              )}

              {editing && (
                <Button variant="primary" onClick={handleUpdateProfile}>
                  Salvar Alterações
                </Button>
              )}
            </div>
          </div>

          <div className="stats-card">
            <h3>Estatísticas</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">{profile?.creditos.toFixed(2)}</span>
                <span className="stat-label">Créditos</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{gameHistory.length}</span>
                <span className="stat-label">Jogos Participados</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">
                  {gameHistory.filter(game => game.status === 'concluído').length}
                </span>
                <span className="stat-label">Jogos Concluídos</span>
              </div>
            </div>
          </div>

          <div className="history-card">
            <h3>Histórico de Jogos</h3>
            {gameHistory.length === 0 ? (
              <p className="empty-history">Nenhum jogo participado ainda.</p>
            ) : (
              <div className="history-list">
                {gameHistory.map((game) => (
                  <div key={game.id_jogo} className="history-item">
                    <div className="game-info">
                      <span className="game-id">Jogo #{game.id_jogo}</span>
                      <span className="game-date">
                        {new Date(game.data_hora).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className="game-details">
                      <span>{game.quantidade_cartelas} cartelas</span>
                      <span>R$ {formatDecimal(game.valor_total).toFixed(2)}</span>
                      <span className={`status ${game.status}`}>{game.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </UserLayout>
  );
}