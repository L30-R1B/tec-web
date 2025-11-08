'use client'
import { useState } from 'react';
import Button from "@/app/components/button";
import { useRouter } from 'next/navigation';
import styles from './user.module.css'; 

interface UserData {
    name: string;
    email: string;
}

interface GameHistory {
    id: string;
    date: string;
    won: boolean;
    amount: number;
    room: string;
}


interface UpcomingGame {
    id: string;
    date: string;
    time: string;
    room: string;
    prize: number;
}

export default function UserPage() {
    const router = useRouter();

    // Estado para controle do modal de exclusão
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [userData] = useState<UserData>({
        name: "João Silva",
        email: "joao.silva@email.com"
    });

    const [gameHistory] = useState<GameHistory[]>([
        { id: "1", date: "20/03/2024", won: true, amount: 150.00, room: "Sala Premium" },
        { id: "2", date: "18/03/2024", won: false, amount: 0, room: "Sala Rápida" },
        { id: "3", date: "15/03/2024", won: true, amount: 75.50, room: "Sala Social" },
        { id: "4", date: "12/03/2024", won: false, amount: 0, room: "Sala Premium" },
        { id: "5", date: "10/03/2024", won: true, amount: 200.00, room: "Sala Especial" }
    ]);


    const [upcomingGames] = useState<UpcomingGame[]>([
        { id: "1", date: "25/03/2024", time: "20:00", room: "Sala Noturna", prize: 300.00 },
        { id: "2", date: "26/03/2024", time: "15:00", room: "Sala da Tarde", prize: 150.00 },
        { id: "3", date: "28/03/2024", time: "21:30", room: "Sala Premium", prize: 500.00 },
        { id: "4", date: "30/03/2024", time: "19:00", room: "Sala Especial", prize: 750.00 }
    ]);

    const handleLogout = () => {
        localStorage.removeItem('bingoToken');
        window.location.href = '/login';
    };

    const handleDeleteAccount = () => {
        console.log('Conta excluída');
        localStorage.removeItem('bingoToken');
        window.location.href = '/';
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(amount);
    };

    return (
        <div className="page-container"> 
            <header>
                <nav className='navbar'> 
                    <div className={styles.navbarUserPage}> 
                        <div className={styles.navbarLinksLeftUser}> 
                            <a className="nav-links">Como jogar</a> 
                            <a className="nav-links">Salas</a> 
                        </div>


                        <div className={styles.navbarLogoCenterUser}> 
                            <img
                                src="/bingo-logo.png"
                                alt="logo"
                                className={styles.navbarLogoUser} 
                            />
                        </div>


                        <div className={styles.navbarLinksRightUser}> 
                            <a className="nav-links">Minha conta</a>
                            <a className="nav-links">Prêmios</a> 
                        </div>

                        <div className={styles.navbarLogoutUser}> 
                            <Button variant="primary" onClick={handleLogout}>
                                Sair
                            </Button>
                        </div>
                    </div>
                </nav>
            </header>

            <main className={styles.userMainContent}> 
                <div className={styles.userContainer}> 

                    <div className={styles.userSidebar}> 
                        <div className={styles.userProfileCard}> 
                            <div className={styles.userAvatar}> 
                                <div className={styles.avatarCircle}> 
                                    {userData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </div>
                            </div>
                            <div className={styles.userInfo}> 
                                <h2>{userData.name}</h2>
                                <p className={styles.userEmail}>{userData.email}</p> 
                            </div>
                            <div className={styles.userActions}> 
                                <button
                                    className={styles.deleteAccountBtn} 
                                    onClick={() => setShowDeleteModal(true)}
                                >
                                    Excluir Conta
                                </button>
                            </div>
                        </div>
                    </div>


                    <div className={styles.userContent}> 
                        <div className={styles.userCard}> 
                            <div className={styles.cardHeader}> 
                                <h2 className={styles.cardTitle}>Histórico de Jogos</h2> 
                            </div>
                            <div className={styles.cardContent}> 
                                {gameHistory.length > 0 ? (
                                    <div className={styles.gamesList}> 
                                        {gameHistory.map(game => (
                                            <div key={game.id} className={styles.gameItem}> 
                                                <div className={styles.gameDate}>{game.date}</div> 
                                                <div className={styles.gameRoom}>{game.room}</div> 
                                                <div className="game-result"> 
                                                    <span className={`${styles.resultBadge} ${game.won ? styles.won : styles.lost}`}> 
                                                        {game.won ? 'Ganhou' : 'Não Ganhou'}
                                                    </span>
                                                </div>
                                                <div className={styles.gameAmount}> 
                                                    {game.won ? formatCurrency(game.amount) : '-'}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className={styles.emptyState}> 
                                        <p>Nenhum jogo encontrado no histórico.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={styles.userCard}> 
                            <div className={styles.cardHeader}> 
                                <h2 className={styles.cardTitle}>Próximos Jogos</h2> 
                            </div>
                            <div className={styles.cardContent}> 
                                {upcomingGames.length > 0 ? (
                                    <div className={styles.upcomingGamesList}> 
                                        {upcomingGames.map(game => (
                                            <div key={game.id} className={styles.upcomingGameItem}> 
                                                <div className={styles.gameDatetime}> 
                                                    <div className={styles.gameDate}>{game.date}</div> 
                                                    <div className={styles.gameTime}>{game.time}</div> 
                                                </div>
                                                <div className={styles.gameDetails}> 
                                                    <div className={styles.gameRoom}>{game.room}</div> 
                                                    <div className={styles.gamePrize}>Prêmio: {formatCurrency(game.prize)}</div> 
                                                </div>
                                                <Button variant="primary">
                                                    Participar
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className={styles.emptyState}> 
                                        <p>Nenhum jogo agendado.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {showDeleteModal && (
                <div className={styles.modalOverlay}> 
                    <div className={styles.modalContent}> 
                        <div className={styles.modalHeader}> 
                            <h3>Excluir Conta</h3>
                            <button
                                className={styles.closeButton} 
                                onClick={() => setShowDeleteModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className={styles.modalBody}> 
                            <p>Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita e todos os seus dados serão perdidos permanentemente.</p>
                        </div>
                        <div className={styles.modalActions}> 
                            <Button
                                variant="secondary"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleDeleteAccount}
                            >
                                Excluir Conta
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}