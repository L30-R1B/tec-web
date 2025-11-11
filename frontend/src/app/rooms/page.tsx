// app/rooms/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import UserLayout from '../components/UserLayout';
import Button from '../components/button';

const API_BASE = typeof window !== 'undefined' ? (window.location.hostname === 'localhost' ? 'http://localhost:3333' : 'http://100.124.95.109:3333') : 'http://localhost:3333';

interface Room {
  id_sala: number;
  nome: string;
  descricao?: string;
  jogadores_ativos?: number;
  capacidade_maxima?: number;
  status?: string;
  totalPrizes?: number;
}

interface Game {
  id_jogo: number;
  id_sala: number;
  status: string;
  premios?: { valor: any }[];
}

interface Prize {
  id_premio: number;
  valor: any;
  id_jogo: number;
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
    if (typeof val === 'object' && val !== null && typeof val.toString === 'function') {
      const str = val.toString();
      if (str !== '[object Object]') return parseFloat(str) || 0;
    }
    return 0;
  } catch (error) {
    console.error('Erro na conversão de decimal:', error);
    return 0;
  }
};

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadRooms = async () => {
      const token = localStorage.getItem('bingoToken');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        setError(null);
        
        const [roomsResponse, gamesResponse, prizesResponse] = await Promise.all([
          fetch(`${API_BASE}/rooms`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_BASE}/games`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_BASE}/prizes`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (roomsResponse.ok) {
          const roomsData: Room[] = await roomsResponse.json();
          let gamesData: Game[] = gamesResponse.ok ? await gamesResponse.json() : [];

          // "Enriquecer" cada jogo com seus prêmios, buscando os detalhes
          const enrichedGamesData = await Promise.all(
            gamesData.map(async (game) => {
              const gameDetailResponse = await fetch(`${API_BASE}/games/${game.id_jogo}`, { headers: { 'Authorization': `Bearer ${token}` } });
              if (gameDetailResponse.ok) {
                const gameDetail = await gameDetailResponse.json();
                return { ...game, premios: gameDetail.premios || [] };
              }
              return game;
            })
          );

          const prizesByRoom = enrichedGamesData
            .filter(game => game.status === 'agendado' || game.status === 'em_andamento')
            .reduce((acc, game) => {
              const gamePrizesTotal = game.premios?.reduce((sum, prize) => sum + formatDecimal(prize.valor), 0) || 0;
              acc[game.id_sala] = (acc[game.id_sala] || 0) + gamePrizesTotal;
              return acc;
            }, {} as { [key: number]: number });

          const enrichedRooms = roomsData.map(room => ({
            ...room,
            totalPrizes: prizesByRoom[room.id_sala] || 0
          }));

          console.log('Salas enriquecidas:', enrichedRooms);
          setRooms(Array.isArray(enrichedRooms) ? enrichedRooms : []);

        } else {
          const errorText = await roomsResponse.text();
          throw new Error(`Erro ${roomsResponse.status}: ${errorText}`);
        }
      } catch (error) {
        console.error('Erro ao carregar salas:', error);
        setError('Erro ao carregar salas. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, [router]);

  const enterRoom = (roomId: number) => {
    router.push(`/rooms/${roomId}/games`);
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
          Carregando salas...
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="rooms-container" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="rooms-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="title" style={{ 
            color: '#1B6F09', 
            fontSize: '2.5rem',
            marginBottom: '0.5rem'
          }}>
            Salas de Bingo Disponíveis
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            Escolha uma sala para ver os jogos disponíveis
          </p>
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

        <div className="rooms-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
          gap: '2rem',
          marginTop: '2rem'
        }}>
          {rooms.map(room => (
            <div 
              key={room.id_sala} 
              className="room-card"
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
                minHeight: '250px',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onClick={() => enterRoom(room.id_sala)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(27, 111, 9, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(27, 111, 9, 0.3)';
              }}
            >
              <div className="room-header" style={{ marginBottom: '1rem' }}>
                <h3 style={{ 
                  color: '#E2F67E', 
                  fontSize: '1.5rem',
                  margin: '0 0 0.5rem 0',
                  fontFamily: 'var(--font-baloo-bhaijaan)'
                }}>
                  {room.nome}
                </h3>
                {room.status && (
                  <span style={{
                    background: '#E2F67E',
                    color: '#1B6F09',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}>
                    {room.status}
                  </span>
                )}
              </div>

              {room.descricao && (
                <p style={{ 
                  color: '#E2F67E', 
                  margin: '0 0 1.5rem 0',
                  lineHeight: '1.5',
                  opacity: '0.9'
                }}>
                  {room.descricao}
                </p>
              )}

              <div className="room-stats" style={{ marginBottom: '1.5rem' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#E2F67E', fontWeight: '600' }}>Jogadores Ativos:</span>
                  <span style={{ color: 'white', fontWeight: 'bold' }}>
                    {room.jogadores_ativos || 0}/{room.capacidade_maxima || '∞'}
                  </span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '0.5rem'
                }}>
                  <span style={{ color: '#E2F67E', fontWeight: '600' }}>Prêmio Total:</span>
                  <span style={{ color: 'white', fontWeight: 'bold' }}>
                    R$ {(room.totalPrizes || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              <Button
                variant="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  enterRoom(room.id_sala);
                }}
                style={{ 
                  width: '100%',
                  marginTop: 'auto'
                }}
              >
                Ver Jogos da Sala
              </Button>
            </div>
          ))}
        </div>

        {rooms.length === 0 && !loading && !error && (
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
              Nenhuma sala disponível no momento
            </h3>
            <p>Volte mais tarde para conferir novas salas!</p>
          </div>
        )}
      </div>
    </UserLayout>
  );
}