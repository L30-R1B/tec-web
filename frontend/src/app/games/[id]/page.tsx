// app/games/[id]/page.tsx
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
  data_hora: string;
  preco_cartela: any;
  status: string;
  numeros_sorteados: number[];
  premios?: PrizeInfo[];
}

const formatDecimal = (val: any): number => {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') return parseFloat(val) || 0;
  if (typeof val === 'object' && val !== null && Array.isArray(val.d)) {
    const sign = val.s || 1; const exponent = val.e !== undefined ? val.e : 0; let allDigits = ''; for (let i = 0; i < val.d.length; i++) { if (i === 0) { allDigits += val.d[i].toString(); } else { allDigits += val.d[i].toString().padStart(7, '0'); } } const decimalPosition = exponent + 1; let numStr: string; if (decimalPosition <= 0) { numStr = '0.' + '0'.repeat(-decimalPosition) + allDigits; } else if (decimalPosition >= allDigits.length) { numStr = allDigits + '0'.repeat(decimalPosition - allDigits.length); } else { numStr = allDigits.slice(0, decimalPosition) + '.' + allDigits.slice(decimalPosition); } return parseFloat(numStr) * sign;
  }
  return 0;
};

export default function GamePage() {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastNumber, setLastNumber] = useState<number | null>(null);
  const params = useParams();
  const router = useRouter();
  const gameId = params.id;

  useEffect(() => {
    const loadGame = async () => {
      const token = localStorage.getItem('bingoToken');
      if (!token) return;

      try {
        const [gameResponse, prizesResponse] = await Promise.all([
          fetch(`${API_BASE}/games/${gameId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${API_BASE}/prizes`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (gameResponse.ok) {
          const gameData = await gameResponse.json();
          const allPrizes: Prize[] = prizesResponse.ok ? await prizesResponse.json() : [];

          const gamePrizes = allPrizes
            .filter(p => p.id_jogo === Number(gameId))
            .map(p => ({
              descricao: p.descricao,
              valor: formatDecimal(p.valor)
            }));

          const enrichedGame = {
            ...gameData,
            preco_cartela: formatDecimal(gameData.preco_cartela),
            premios: gamePrizes
          };

          setGame(enrichedGame);

          // Simular último número sorteado
          if (gameData.numeros_sorteados && gameData.numeros_sorteados.length > 0) {
            setLastNumber(gameData.numeros_sorteados[gameData.numeros_sorteados.length - 1]);
          }
        } else {
          throw new Error('Falha ao carregar o jogo.');
        }
      } catch (error) {
        console.error('Erro ao carregar jogo:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGame();

    // Simular atualização em tempo real
    const interval = setInterval(() => {
      // Aqui você implementaria WebSockets ou polling para atualizações em tempo real
    }, 5000);

    return () => clearInterval(interval);
  }, [gameId]);

  const handleBingo = () => {
    alert('BINGO! Sua cartela está sendo verificada...');
    // Implementar verificação do bingo
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="loading">Carregando jogo...</div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="game-container">
        <div className="game-header">
          <Button
            variant="secondary"
            onClick={() => router.push('/rooms')}
            className="back-button"
          >
            ← Voltar para Salas
          </Button>
          <h1 className="title">Jogo #{gameId}</h1>
          <div className="game-status">
            <span className={`status ${game?.status}`}>{game?.status}</span>
          </div>
        </div>

        <div className="game-content">
          <div className="game-board">
            <div className="last-number">
              <h3>Último Número Sorteado</h3>
              <div className="number-display">
                {lastNumber || '--'}
              </div>
            </div>

            {game?.premios && game.premios.length > 0 && (
              <div className="prizes-section" style={{ marginTop: '2rem' }}>
                <h3>Prêmios do Jogo</h3>
                <ul style={{ 
                  listStyle: 'none', 
                  padding: 0, 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '1rem'
                }}>
                  {game.premios.map((premio, index) => (
                    <li key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
                      <span>{premio.descricao}</span>
                      <strong>R$ {premio.valor.toFixed(2)}</strong>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="drawn-numbers">
              <h3>Números Sorteados</h3>
              <div className="numbers-grid">
                {Array.from({ length: 75 }, (_, i) => i + 1).map(number => (
                  <div
                    key={number}
                    className={`number-ball ${
                      game?.numeros_sorteados?.includes(number) ? 'drawn' : ''
                    }`}
                  >
                    {number}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="player-actions">
            <Button
              variant="primary"
              onClick={handleBingo}
              className="bingo-button"
            >
              BINGO! 🏆
            </Button>

            <div className="player-cards">
              <h3>Minhas Cartelas</h3>
              <div className="cards-list">
                {/* Aqui você listaria as cartelas do usuário para este jogo */}
                <div className="card-preview">
                  <span>Cartela #1</span>
                  <Button variant="secondary" size="small">
                    Ver
                  </Button>
                </div>
                <div className="card-preview">
                  <span>Cartela #2</span>
                  <Button variant="secondary" size="small">
                    Ver
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}