'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './game.module.css';

interface BingoCard {
  id: string;
  name: string;
  numbers: number[][];
  markedNumbers: number[];
  price: number;
}

interface GameUser {
  name: string;
  avatarInitials: string;
  balance: number;
}

export default function GamePage() {
  const router = useRouter();
  
  // Estado do usuário
  const [user] = useState<GameUser>({
    name: "João Silva",
    avatarInitials: "JS",
    balance: 250.50
  });
  
  // Estado dos números sorteados
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([7, 15, 32, 48, 61]);
  const [lastNumber, setLastNumber] = useState<number>(61);
  
  // Estado das cartelas
  const [bingoCards, setBingoCards] = useState<BingoCard[]>([
    {
      id: "1",
      name: "Cartela Premium",
      numbers: [
        [7, 12, 0, 41, 55],
        [19, 24, 0, 46, 62],
        [28, 35, 0, 52, 68],
        [33, 40, 0, 57, 73],
        [44, 51, 0, 64, 75]
      ],
      markedNumbers: [7, 15, 32, 48, 61],
      price: 25.00
    },
    {
      id: "2",
      name: "Cartela Rápida",
      numbers: [
        [3, 16, 0, 42, 61],
        [8, 22, 0, 47, 67],
        [13, 30, 0, 53, 71],
        [27, 38, 0, 58, 74],
        [35, 45, 0, 63, 70]
      ],
      markedNumbers: [7, 61],
      price: 15.00
    },
    {
      id: "3",
      name: "Cartela Social",
      numbers: [
        [5, 18, 0, 39, 65],
        [11, 25, 0, 44, 69],
        [17, 32, 0, 50, 72],
        [23, 37, 0, 56, 63],
        [29, 43, 0, 60, 74]
      ],
      markedNumbers: [32, 48],
      price: 10.00
    }
  ]);
  
  // Estado do modal de vitória
  const [showWinModal, setShowWinModal] = useState(false);
  const [winningCard, setWinningCard] = useState<string>('');
  const [winningPrize, setWinningPrize] = useState<number>(0);
  
  // Estado do jogo
  const [isPlaying, setIsPlaying] = useState(true);
  const [gameTime, setGameTime] = useState<number>(0); 
  
  // Simular sorteio de números (apenas frontend por enquanto)
  useEffect(() => {
    if (!isPlaying) return;
    
    const gameTimer = setInterval(() => {
      setGameTime(prev => prev + 1);
    }, 1000);
    
    const numberTimer = setInterval(() => {
      if (drawnNumbers.length >= 75) {
        clearInterval(numberTimer);
        return;
      }
      
      // Gerar número aleatório que ainda não foi sorteado
      let newNumber: number;
      do {
        newNumber = Math.floor(Math.random() * 75) + 1;
      } while (drawnNumbers.includes(newNumber));
      
      setDrawnNumbers(prev => [...prev, newNumber]);
      setLastNumber(newNumber);
      
      // Marcar automaticamente nas cartelas
      setBingoCards(prev => prev.map(card => ({
        ...card,
        markedNumbers: card.markedNumbers.includes(newNumber) 
          ? card.markedNumbers 
          : [...card.markedNumbers, newNumber]
      })));
      
    }, 5000); // Sorteia um número a cada 5 segundos
    
    return () => {
      clearInterval(gameTimer);
      clearInterval(numberTimer);
    };
  }, [isPlaying, drawnNumbers.length]);
  
  // Função para formatar tempo (mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Função para verificar se um número está marcado em uma cartela
  const isNumberMarked = (card: BingoCard, number: number) => {
    return card.markedNumbers.includes(number);
  };
  

  const handleBingoClick = () => {
    // Simular vitória aleatória
    const randomCard = bingoCards[Math.floor(Math.random() * bingoCards.length)];
    setWinningCard(randomCard.name);
    setWinningPrize(randomCard.price * 10); 
    setShowWinModal(true);
    setIsPlaying(false);
  };
  

  const handleExitClick = () => {
    if (confirm('Tem certeza que deseja sair do jogo? Seu progresso será perdido.')) {
      router.push('/user');
    }
  };
  
  
  const handleContinuePlaying = () => {
    setShowWinModal(false);
    setIsPlaying(true);
    setDrawnNumbers([]);
    setLastNumber(0);
    setGameTime(0);
  
    setBingoCards(prev => prev.map(card => ({
      ...card,
      markedNumbers: []
    })));
  };
  

  const handleBackToMenu = () => {
    setShowWinModal(false);
    router.push('/user');
  };
  
  const handleNumberClick = (cardId: string, number: number) => {
    if (number === 0) return; 
    
    setBingoCards(prev => prev.map(card => {
      if (card.id !== cardId) return card;
      
      const isMarked = card.markedNumbers.includes(number);
      
      return {
        ...card,
        markedNumbers: isMarked
          ? card.markedNumbers.filter(n => n !== number)
          : [...card.markedNumbers, number]
      };
    }));
  };
  
  const getColumnLetter = (index: number) => {
    const letters = ['B', 'I', 'N', 'G', 'O'];
    return letters[index];
  };
  

  const renderBingoCard = (card: BingoCard) => (
    <div key={card.id} className={styles.bingoCard}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{card.name}</h3>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.bingoGrid}>
        
          <div className={styles.gridHeader}>
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={`header-${index}`} className={styles.letterCell}>
                {getColumnLetter(index)}
              </div>
            ))}
          </div>
          
          {card.numbers.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className={styles.gridRow}>
              {row.map((number, colIndex) => {
                const isFreeSpace = rowIndex === 2 && colIndex === 2;
                const isMarked = isNumberMarked(card, number);
                
                return (
                  <div
                    key={`cell-${rowIndex}-${colIndex}`}
                    className={`${styles.numberCell} ${
                      isFreeSpace ? styles.free : ''
                    } ${isMarked ? styles.marked : ''}`}
                    onClick={() => handleNumberClick(card.id, number)}
                  >
                    {isFreeSpace ? 'FREE' : number > 0 ? number : ''}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
  return (
    <div className={styles.gameContainer}>
      
      <header className={styles.navbarGame}>
        <div className={styles.gameInfo}>
          <h1 className={styles.gameTitle}>BINGO ONLINE</h1>
          <p className={styles.gameSubtitle}>
            Jogo em andamento • Tempo: {formatTime(gameTime)} • Números sorteados: {drawnNumbers.length}/75
          </p>
        </div>
        
        <div className={styles.userInfoGame}>
          <div className={styles.userAvatarGame}>
            {user.avatarInitials}
          </div>
          <div>
            <div className={styles.userNameGame}>{user.name}</div>
            <div style={{ color: 'var(--secondary-green)', fontSize: '14px' }}>
              Saldo: R$ {user.balance.toFixed(2)}
            </div>
          </div>
        </div>
      </header>
      
    
      <main className={styles.gameContent}>

        <section className={styles.drawnNumbersSection}>
          <h2 className={styles.sectionTitle}>Números Sorteados</h2>
          <div className={styles.drawnNumbersGrid}>
            {drawnNumbers.map((number, index) => (
              <div
                key={number}
                className={`${styles.drawnNumber} ${
                  index === drawnNumbers.length - 1 ? styles.latest : ''
                }`}
              >
                {number}
              </div>
            ))}
            
            {drawnNumbers.length === 0 && (
              <div style={{ color: 'var(--secondary-green)', fontStyle: 'italic' }}>
                Aguardando primeiro sorteio...
              </div>
            )}
          </div>
          
          {lastNumber > 0 && (
            <div style={{ 
              textAlign: 'center', 
              marginTop: '15px',
              fontSize: '18px',
              color: 'var(--primary-green)',
              fontWeight: 'bold'
            }}>
              Último número: <span style={{ color: 'var(--secondary-green)' }}>{lastNumber}</span>
            </div>
          )}
        </section>
        
        <section className={styles.cardsSection}>
          <h2 className={styles.sectionTitle}> Suas Cartelas</h2>
          
          <div className={styles.cardsContainer}>
            <div className={styles.cardsGrid}>
              {bingoCards.map(renderBingoCard)}
            </div>
          </div>
      
          <div style={{ 
            textAlign: 'center',
            marginBottom: '20px',
            color: 'var(--secondary-green)'
          }}>
            <div style={{ fontSize: '16px' }}>
              Total de números marcados: {bingoCards.reduce((acc, card) => acc + card.markedNumbers.length, 0)}
            </div>
          </div>
        </section>
        

        <section className={styles.actionsSection}>
          <div className={styles.actionsGrid}>
            <button 
              className={`${styles.actionButton} ${styles.bingoButton}`}
              onClick={handleBingoClick}
              disabled={!isPlaying}
            >
              <span className={styles.buttonIcon}>🎉</span>
              <span>BINGO!</span>
            </button>
            
            <button 
              className={`${styles.actionButton} ${styles.exitButton}`}
              onClick={handleExitClick}
            >
              <span className={styles.buttonIcon}></span>
              <span>SAIR DO JOGO</span>
            </button>
          </div>
          
          <div style={{ 
            textAlign: 'center', 
            marginTop: '20px',
            color: 'var(--secondary-green)',
            fontSize: '14px'
          }}>
            <p>Clique nos números para marcar/desmarcar manualmente.</p>
            <p>Quando completar uma linha, coluna ou diagonal, clique em "BINGO!"</p>
          </div>
        </section>
      </main>

      {showWinModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.winModal}>
            <h2 className={styles.winTitle}>
              🎉 BINGO! 🎉
            </h2>
            
            <div className={styles.winMessage}>
              Parabéns! Você completou uma linha na cartela:<br />
              <strong style={{ color: 'var(--primary-green)' }}>{winningCard}</strong>
            </div>
            
            <div className={styles.prizeAmount}>
              🏆 Prêmio: R$ {winningPrize.toFixed(2)} 🏆
            </div>
            
            <div className={styles.winMessage}>
              Seu novo saldo será: <br />
              <strong style={{ color: 'var(--primary-green)' }}>
                R$ {(user.balance + winningPrize).toFixed(2)}
              </strong>
            </div>
            
            <div className={styles.modalButtons}>
              <button
                className={styles.actionButton}
                style={{
                  background: 'linear-gradient(135deg, var(--primary-green) 0%, var(--secondary-green) 100%)',
                  color: 'white',
                  height: '50px',
                  fontSize: '18px'
                }}
                onClick={handleContinuePlaying}
              >
                Jogar Novamente
              </button>
              
              <button
                className={styles.actionButton}
                style={{
                  background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
                  color: 'white',
                  height: '50px',
                  fontSize: '18px'
                }}
                onClick={handleBackToMenu}
              >
                Voltar ao Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}