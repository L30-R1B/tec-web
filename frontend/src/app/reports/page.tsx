'use client'
import { useState } from 'react';
import Button from "@/app/components/button";
import { useRouter } from 'next/navigation';
import styles from './reports.module.css';

interface Statistic {
    id: string;
    label: string;
    value: number | string;
    change?: string;
}

interface NumberDistribution {
    range: string;
    count: number;
    percentage: number;
}

interface GameSession {
    id: string;
    date: string;
    time: string;
    players: number;
    winner: string;
    prize: number;
    numbersCalled: number;
    duration: string;
}

export default function ReportsPage() {
    const router = useRouter();
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportFormat, setExportFormat] = useState<'pdf' | 'csv' | 'json'>('pdf');


    const [statistics] = useState<Statistic[]>([
        { id: '1', label: 'Partidas Jogadas', value: 42, change: '+12%' },
        { id: '2', label: 'Total de Jogadores', value: 156, change: '+5%' },
        { id: '3', label: 'Prêmios Distribuídos', value: 'R$ 8.450', change: '+18%' },
        { id: '4', label: 'Média por Partida', value: 'R$ 201', change: '+3%' },
        { id: '5', label: 'Taxa de Vitória', value: '4.7%', change: '-0.2%' },
        { id: '6', label: 'Números Sorteados', value: '1.764', change: '+8%' },
    ]);

    const [numberDistribution] = useState<NumberDistribution[]>([
        { range: '1-15 (B)', count: 42, percentage: 17.5 },
        { range: '16-30 (I)', count: 38, percentage: 15.8 },
        { range: '31-45 (N)', count: 36, percentage: 15.0 },
        { range: '46-60 (G)', count: 39, percentage: 16.3 },
        { range: '61-75 (O)', count: 45, percentage: 18.8 },
    ]);

    const [mostFrequentNumbers] = useState<{ number: number; count: number }[]>([
        { number: 7, count: 28 },
        { number: 15, count: 26 },
        { number: 32, count: 25 },
        { number: 48, count: 24 },
        { number: 67, count: 23 },
    ]);


    const [leastFrequentNumbers] = useState<{ number: number; count: number }[]>([
        { number: 1, count: 12 },
        { number: 20, count: 13 },
        { number: 35, count: 14 },
        { number: 59, count: 15 },
        { number: 74, count: 16 },
    ]);


    const [gameSessions] = useState<GameSession[]>([
        { id: '1', date: '25/03/2024', time: '20:00', players: 45, winner: 'João Silva', prize: 300.00, numbersCalled: 43, duration: '15 min' },
        { id: '2', date: '24/03/2024', time: '15:00', players: 32, winner: 'Maria Santos', prize: 150.00, numbersCalled: 38, duration: '12 min' },
        { id: '3', date: '23/03/2024', time: '21:30', players: 58, winner: 'Carlos Lima', prize: 500.00, numbersCalled: 41, duration: '18 min' },
        { id: '4', date: '22/03/2024', time: '19:00', players: 28, winner: 'Ana Costa', prize: 120.00, numbersCalled: 35, duration: '10 min' },
    ]);

    const handleLogout = () => {
        localStorage.removeItem('bingoToken');
        window.location.href = '/login';
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(amount);
    };

    const handleExport = () => {
        console.log(`Exportando relatório no formato: ${exportFormat}`);

        setShowExportModal(false);
        alert(`Relatório exportado como ${exportFormat.toUpperCase()}!`);
    };

    return (
        <div className="page-container">

            <header>
                <nav className='navbar'>
                    <div className={styles.navbarReportsPage}>
                        <div className={styles.navbarLinksLeftReports}>
                            <a className="nav-links" onClick={() => router.push('/user')}>Minha Conta</a>
                            <a className="nav-links" onClick={() => router.push('/rooms')}>Salas</a>
                        </div>

                        <div className={styles.navbarLogoCenterReports}>
                            <img
                                src="/bingo-logo.png"
                                alt="logo"
                                className={styles.navbarLogoReports}
                            />
                        </div>

                        <div className={styles.navbarLinksRightReports}>
                            <a className="nav-links" style={{ fontWeight: 'bold', color: 'var(--primary-green)' }}>Relatórios</a>
                            <a className="nav-links" onClick={() => router.push('/how-to-play')}>Como Jogar</a>
                        </div>

                        <div className={styles.navbarLogoutReports}>
                            <Button variant="primary" onClick={handleLogout}>
                                Sair
                            </Button>
                        </div>
                    </div>
                </nav>
            </header>


            <main className={styles.reportsMainContent}>
                <div className={styles.reportsContainer}>

                    <div className={styles.reportsHeader}>
                        <h1> Relatórios e Estatísticas</h1>
                        <p>Análise detalhada das partidas e desempenho do jogo</p>
                    </div>


                    <div className={styles.reportsGrid}>
                        <div className={styles.reportCard}>
                            <div className={styles.reportCardHeader}>
                                <h2 className={styles.reportCardTitle}> Estatísticas Gerais</h2>
                            </div>
                            <div className={styles.reportCardContent}>
                                <div className={styles.statsGrid}>
                                    {statistics.map(stat => (
                                        <div key={stat.id} className={styles.statItem}>
                                            <div className={styles.statValue}>{stat.value}</div>
                                            <div className={styles.statLabel}>{stat.label}</div>
                                            {stat.change && (
                                                <span style={{
                                                    color: stat.change.startsWith('+') ? '#15803d' : '#dc2626',
                                                    fontSize: '12px',
                                                    marginTop: '4px'
                                                }}>
                                                    {stat.change}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className={styles.reportCard}>
                            <div className={styles.reportCardHeader}>
                                <h2 className={styles.reportCardTitle}>Distribuição de Números</h2>
                            </div>
                            <div className={styles.reportCardContent}>
                                <div className={styles.distributionChart}>
                                    {numberDistribution.map(item => (
                                        <div key={item.range} className={styles.chartBar}>
                                            <div className={styles.chartLabel}>{item.range}</div>
                                            <div className={styles.chartBarInner}>
                                                <div
                                                    className={styles.chartBarFill}
                                                    style={{ width: `${item.percentage}%` }}
                                                />
                                            </div>
                                            <div className={styles.chartCount}>{item.count}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>


                        <div className={styles.reportCard}>
                            <div className={styles.reportCardHeader}>
                                <h2 className={styles.reportCardTitle}>Números Frequentes</h2>
                            </div>
                            <div className={styles.reportCardContent}>
                                <h3>Mais Sorteados:</h3>
                                <table className={styles.numbersTable}>
                                    <thead>
                                        <tr>
                                            <th>Número</th>
                                            <th>Quantidade</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mostFrequentNumbers.map(item => (
                                            <tr key={item.number} className={styles.highlight}>
                                                <td>BINGO-{item.number}</td>
                                                <td>{item.count} vezes</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <h3 style={{ marginTop: '20px' }}>Menos Sorteados:</h3>
                                <table className={styles.numbersTable}>
                                    <thead>
                                        <tr>
                                            <th>Número</th>
                                            <th>Quantidade</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leastFrequentNumbers.map(item => (
                                            <tr key={item.number}>
                                                <td>BINGO-{item.number}</td>
                                                <td>{item.count} vezes</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>


                        <div className={styles.reportCard}>
                            <div className={styles.reportCardHeader}>
                                <h2 className={styles.reportCardTitle}>Histórico Recente</h2>
                            </div>
                            <div className={styles.reportCardContent}>
                                <div className={styles.timeline}>
                                    {gameSessions.map(session => (
                                        <div key={session.id} className={styles.timelineItem}>
                                            <div className={styles.timelineDot} />
                                            <div className={styles.timelineContent}>
                                                <div className={styles.timelineTime}>
                                                    {session.date} • {session.time} • {session.duration}
                                                </div>
                                                <div className={styles.timelineEvent}>
                                                    <strong>{session.winner}</strong> venceu {formatCurrency(session.prize)}
                                                </div>
                                                <div style={{ fontSize: '14px', color: 'var(--secondary-green)' }}>
                                                    {session.players} jogadores • {session.numbersCalled} números
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.reportsActions}>
                        <button
                            className={`${styles.exportButton} ${styles.exportButtonSecondary}`}
                            onClick={() => router.push('/user')}
                        >
                            ← Voltar para Minha Conta
                        </button>
                    </div>
                </div>
            </main>



        </div>
    );
}