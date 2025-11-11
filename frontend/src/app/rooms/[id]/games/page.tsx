// app/rooms/[id]/games/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import UserLayout from '@/app/components/UserLayout';
import Button from '@/app/components/button';

const API_BASE = typeof window !== 'undefined' ? (window.location.hostname === 'localhost' ? 'http://localhost:3333' : 'http://100.124.95.109:3333') : 'http://localhost:3333';

interface Prize {
  id_premio: number;
  descricao: string;
  valor: any;
  id_jogo: number;
}

interface PrizeInfo {
  descricao: string;
  valor: number;
}
interface Game {
  id_jogo: number;
  id_sala: number;
  data_hora: string;
  preco_cartela: number;
  status: string;
  // Campos que podem vir da API
  players_count?: number;
  jogadores_inscritos?: number;
  nome_sala?: string;
  premios?: PrizeInfo[];
}

interface Room {
  id_sala: number;
  nome: string;
  descricao: string;
}

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
  } catch { return 0; }
};

export default function RoomGamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const router = useRouter();
  const roomId = params.id;

  useEffect(() => {
    const loadRoomGames = async () => {
      const token = localStorage.getItem('bingoToken');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        setError(null);
        
        // Carregar dados da sala
        const roomResponse = await fetch(`${API_BASE}/rooms/${roomId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (roomResponse.ok) {
          const roomData = await roomResponse.json();
          setRoom(roomData);
        } else {
          console.warn('Não foi possível carregar dados da sala');
        }

        // Carregar todos os jogos e filtrar pela sala atual
        const allGamesResponse = await fetch(`${API_BASE}/games`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        let gamesData = [];
        if (allGamesResponse.ok) {
          const allGames = await allGamesResponse.json();
          // Filtra os jogos para exibir apenas os que pertencem a esta sala
          gamesData = Array.isArray(allGames) 
            ? allGames.filter((game: any) => game.id_sala === Number(roomId))
            : [];
        } else {
          throw new Error('Falha ao carregar a lista de jogos.');
        }

        // Carregar todos os prêmios
        let allPrizes: Prize[] = [];
        try {
          const prizesResponse = await fetch(`${API_BASE}/prizes`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (prizesResponse.ok) {
            allPrizes = await prizesResponse.json();
          }
        } catch (prizeError) {
          console.warn("Não foi possível carregar os prêmios (talvez não seja admin). A página funcionará sem eles.");
        }

        console.log('Jogos recebidos:', gamesData); // Para debug

        const formattedGames = Array.isArray(gamesData) ? gamesData.map((game: any) => ({
          id_jogo: game.id_jogo || game.id,
          id_sala: game.id_sala || Number(roomId),
          data_hora: game.data_hora || new Date().toISOString(),
          preco_cartela: formatDecimal(game.preco_cartela),
          status: game.status || 'agendado',
          players_count: game.players_count || game.jogadores_inscritos || 0,
          nome_sala: game.nome_sala || room?.nome,
          premios: allPrizes
            .filter(p => p.id_jogo === game.id_jogo)
            .map(p => ({
              descricao: p.descricao,
              valor: formatDecimal(p.valor)
            }))
        })) : [];

        setGames(formattedGames);
      } catch (error) {
        console.error('Erro ao carregar jogos:', error);
        setError('Erro ao carregar jogos. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    if (roomId) {
      loadRoomGames();
    }
  }, [roomId, router]);

  const enterGame = (gameId: number) => {
    router.push(`/games/${gameId}`);
  };

  const buyCards = (gameId: number) => {
    router.push(`/cart?gameId=${gameId}`);
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'agendado': 'Agendado',
      'em_andamento': 'Em Andamento',
      'concluido': 'Concluído',
      'concluído': 'Concluído',
      'cancelado': 'Cancelado'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      'agendado': '#ffd700', // Amarelo
      'em_andamento': '#4CAF50', // Verde
      'concluido': '#666', // Cinza
      'concluído': '#666', // Cinza
      'cancelado': '#f44336' // Vermelho
    };
    return colorMap[status] || '#666';
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="loading" style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          fontSize: '1.2rem', 
          color: '#1B6F09' 
        }}>
          Carregando jogos...
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="games-container" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="games-header" style={{ marginBottom: '2rem' }}>
          <Button
            variant="secondary"
            onClick={() => router.push('/rooms')}
            className="back-button"
            style={{ marginBottom: '1rem' }}
          >
            ← Voltar para Salas
          </Button>
          <h1 className="title" style={{ 
            color: '#1B6F09', 
            fontSize: '2.5rem',
            marginBottom: '0.5rem'
          }}>
            {room?.nome || 'Sala'}
          </h1>
          {room?.descricao && (
            <p className="room-description" style={{ 
              color: '#666', 
              fontSize: '1.1rem',
              margin: 0
            }}>
              {room.descricao}
            </p>
          )}
        </div>

        {error && (
          <div style={{ 
            color: 'red', 
            textAlign: 'center', 
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: '#ffe6e6',
            borderRadius: '8px',
            border: '1px solid #ffcccc'
          }}>
            {error}
          </div>
        )}

        <div className="games-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', 
          gap: '2rem'
        }}>
          {games.map((game) => (
            <div 
              key={game.id_jogo} 
              className="game-card"
              style={{
                background: 'linear-gradient(135deg, #1B6F09 0%, #4d7c0f 100%)',
                borderRadius: '16px',
                padding: '2rem',
                color: 'white',
                boxShadow: '0 8px 32px rgba(27, 111, 9, 0.3)',
                border: '2px solid #E2F67E',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '280px',
                transition: 'all 0.3s ease'
              }}
            >
              <div className="game-header" style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{ 
                  color: '#E2F67E', 
                  fontSize: '1.5rem',
                  margin: 0,
                  fontFamily: 'var(--font-baloo-bhaijaan)'
                }}>
                  Jogo #{game.id_jogo}
                </h3>
                <span style={{
                  background: getStatusColor(game.status),
                  color: 'white',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}>
                  {getStatusText(game.status)}
                </span>
              </div>

              <div className="game-info" style={{ marginBottom: '1.5rem' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '0.75rem'
                }}>
                  <span style={{ color: '#E2F67E', fontWeight: '600' }}>Data e Hora:</span>
                  <span style={{ color: 'white', textAlign: 'right' }}>
                    {new Date(game.data_hora).toLocaleString('pt-BR')}
                  </span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '0.75rem'
                }}>
                  <span style={{ color: '#E2F67E', fontWeight: '600' }}>Preço da Cartela:</span>
                  <span style={{ color: 'white' }}>R$ {game.preco_cartela.toFixed(2)}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between'
                }}>
                  <span style={{ color: '#E2F67E', fontWeight: '600' }}>Jogadores:</span>
                  <span style={{ color: 'white' }}>{game.players_count}</span>
                </div>
                {game.premios && game.premios.length > 0 && (
                  <div style={{ 
                    marginTop: '1.25rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid rgba(226, 246, 126, 0.3)'
                  }}>
                    <span style={{ color: '#E2F67E', fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>Prêmios:</span>
                    <ul style={{ margin: 0, paddingLeft: '20px', listStyle: 'disc' }}>
                      {game.premios.map((premio, index) => (
                        <li key={index} style={{ marginBottom: '0.25rem' }}>
                          <span style={{ color: 'white' }}>
                            {premio.descricao} - <strong>R$ {premio.valor.toFixed(2)}</strong>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="game-actions" style={{ textAlign: 'center' }}>
                {game.status === 'agendado' && (
                  <Button
                    variant="primary"
                    onClick={() => buyCards(game.id_jogo)}
                    style={{ width: '100%' }}
                  >
                    Comprar Cartelas
                  </Button>
                )}
                {game.status === 'em_andamento' && (
                  <Button
                    variant="primary"
                    onClick={() => enterGame(game.id_jogo)}
                    style={{ width: '100%' }}
                  >
                    Entrar no Jogo
                  </Button>
                )}
                {(game.status === 'concluído' || game.status === 'concluido') && (
                  <span style={{ 
                    color: '#E2F67E', 
                    fontStyle: 'italic',
                    display: 'block',
                    padding: '1rem'
                  }}>
                    Jogo Finalizado
                  </span>
                )}
                {game.status === 'cancelado' && (
                  <span style={{ 
                    color: '#ff6b6b', 
                    fontStyle: 'italic',
                    display: 'block',
                    padding: '1rem'
                  }}>
                    Jogo Cancelado
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {games.length === 0 && !loading && !error && (
          <div style={{ 
            textAlign: 'center', 
            color: '#666', 
            marginTop: '3rem',
            padding: '3rem',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '2px dashed #E2F67E'
          }}>
            <h3 style={{ color: '#1B6F09', marginBottom: '1rem' }}>
              Nenhum jogo agendado para esta sala
            </h3>
            <p>Volte mais tarde para conferir novos jogos!</p>
          </div>
        )}
      </div>
    </UserLayout>
  );
}