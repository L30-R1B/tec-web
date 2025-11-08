'use client';
import CustomCards from '@/app/components/CustomCards';
import { useState } from 'react';
import Button from "@/app/components/button";
import { useRouter } from 'next/navigation';
import RechargeCredits from '@/app/components/RechargeCredits';

interface Card {
    id: number;
    numbers: number[][];
    price: number;
    type: string;
    description: string;
}

interface SelectedCard {
    card: Card;
    quantity: number;
}

const mockCards: Card[] = [
    {
        id: 1,
        type: "Cartela Simples",
        description: "Cartela tradicional com 25 números",
        price: 15.50,
        numbers: [
            [1, 2, 3, 4, 5],
            [6, 7, 8, 9, 10],
            [11, 12, 0, 13, 14],
            [15, 16, 17, 18, 19],
            [20, 21, 22, 23, 24]
        ]
    },
    {
        id: 2,
        type: "Cartela Dupla",
        description: "Duas em uma! Mais chance de vencer",
        price: 25.00,
        numbers: [
            [1, 2, 3, 4, 5, 26, 27, 28, 29, 30],
            [6, 7, 8, 9, 10, 31, 32, 33, 34, 35],
            [11, 12, 0, 13, 14, 36, 37, 0, 38, 39],
            [15, 16, 17, 18, 19, 40, 41, 42, 43, 44],
            [20, 21, 22, 23, 24, 45, 46, 47, 48, 49]
        ]
    },
    {
        id: 3,
        type: "Cartela Premium",
        description: "Com os números que alcançam mais vitórias!",
        price: 20.00,
        numbers: [
            [7, 14, 21, 28, 35],
            [42, 49, 56, 63, 70],
            [77, 0, 84, 91, 98],
            [105, 112, 119, 126, 133],
            [140, 147, 154, 161, 168]
        ]
    },
    {
        id: 4,
        type: "Cartela Rápida",
        description: "Jogos rápidos - Só 16 números!",
        price: 13.50,
        numbers: [
            [1, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 10, 0, 11],
            [12, 13, 14, 15]
        ]
    }
];


export default function CartPage() {
    const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([]);
    const [loading, setLoading] = useState(false);
    const [userBalance, setUserBalance] = useState(50.00);
    const router = useRouter();

    const addCard = (card: Card) => {
        setSelectedCards(prev => {
            const existing = prev.find(item => item.card.id === card.id);
            if (existing) {
                return prev.map(item =>
                    item.card.id === card.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prev, { card, quantity: 1 }];
            }
        });
    };

    const handleRecharge = (amount: number) => {
        setUserBalance(prev => prev + amount);
        alert(`Créditos recarregados com sucesso! R$ ${amount.toFixed(2)} adicionados à sua conta.`);
    };

    const addCustomCard = (customCard: Card) => {
        addCard(customCard);
    };

    const removeCard = (cardId: number) => {
        setSelectedCards(prev => {
            const existing = prev.find(item => item.card.id === cardId);
            if (existing && existing.quantity > 1) {
                return prev.map(item =>
                    item.card.id === cardId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                );
            } else {
                return prev.filter(item => item.card.id !== cardId);
            }
        });
    };

    const removeAllCards = (cardId: number) => {
        setSelectedCards(prev => prev.filter(item => item.card.id !== cardId));
    };

    const calculateTotal = () => {
        return selectedCards.reduce((total, item) => {
            return total + (item.card.price * item.quantity);
        }, 0);
    };

    const checkout = () => {
        const total = calculateTotal();

        if (total > userBalance) {
            alert('Saldo insuficiente! Recarregue seus créditos para continuar.');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setUserBalance(prev => prev - total);
            alert('Compra realizada com sucesso!');
            router.push('/cart');
        }, 1500);
    };
    const backToRooms = () => {
        router.push('/rooms');
    };

    const handleLogout = () => {
        localStorage.removeItem('bingoToken');
        window.location.href = '/login';
    };

    return (
        <div className="page-container">
            <header>
                <nav className="navbar">
                    <div className="navbar-with-back">

                        <Button
                            variant="secondary"
                            onClick={backToRooms}
                            className="back-button-with-icon"
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>←</span>
                                <span>Voltar a escolha de salas</span>
                            </div>
                        </Button>

                        <div className="navbar-logo-container">
                            <img
                                src="/bingo-logo.png"
                                alt="logo"
                                className="navbar-logo-centered"
                            />
                        </div>
                        <div className="navbar-user-actions">
                            <span className="user-balance">Saldo: R$ {userBalance.toFixed(2)}</span>
                            <RechargeCredits
                                onRecharge={handleRecharge}
                                currentBalance={userBalance}
                            />
                            <Button variant="primary" onClick={handleLogout}>
                                Sair
                            </Button>
                        </div>
                    </div>
                </nav>
            </header>

            <main className="purchase-cards-container">
                <div className="available-cards">
                    <h1 className="title">Escolha sua cartela e parta para o jogo!</h1>
                    <CustomCards onAddCustomCard={addCustomCard} />

                    <div className="cards-grid">
                        {mockCards.map(card => (
                            <div key={card.id} className="card-item">
                                <div className="card-header">
                                    <h3 className="card-type">{card.type}</h3>
                                    <span className="card-price">R$ {card.price.toFixed(2)}</span>
                                </div>
                                <p className="card-description">{card.description}</p>

                                <div className="card-numbers">
                                    {card.numbers.map((row, index) => (
                                        <div key={index} className="card-row">
                                            {row.map((number, numIndex) => (
                                                <div
                                                    key={numIndex}
                                                    className={`card-number ${number === 0 ? 'free-number' : ''}`}
                                                >
                                                    {number === 0 ? '★' : number}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    variant="primary"
                                    onClick={() => addCard(card)}
                                    className="btn-add-card"
                                >
                                    Adicionar ao carrinho
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="purchase-summary">
                    <div className="summary-header">
                        <h2 className="summary-title">Resumo da Compra</h2>
                    </div>

                    <div className="summary-content">
                        {selectedCards.length === 0 ? (
                            <p className="empty-cart">Nenhuma cartela selecionada</p>
                        ) : (
                            <div className="cards-list">
                                {selectedCards.map(item => (
                                    <div key={item.card.id} className="cart-item">
                                        <div className="item-info">
                                            <span className="item-type">{item.card.type}</span>
                                            <span className="item-price">R$ {item.card.price.toFixed(2)}</span>
                                        </div>
                                        <div className="item-controls">
                                            <div className="quantity-controls">
                                                <button
                                                    onClick={() => removeCard(item.card.id)}
                                                    className="btn-quantity"
                                                >
                                                    -
                                                </button>
                                                <span className="quantity">{item.quantity}</span>
                                                <button
                                                    onClick={() => addCard(item.card)}
                                                    className="btn-quantity"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeAllCards(item.card.id)}
                                                className="btn-remove"
                                            >
                                                Remover
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="summary-total">
                            <div className="total-line">
                                <span>Subtotal:</span>
                                <span>R$ {calculateTotal().toFixed(2)}</span>
                            </div>
                            <div className="total-line total-final">
                                <strong>Total:</strong>
                                <strong>R$ {calculateTotal().toFixed(2)}</strong>
                            </div>
                        </div>

                        <Button
                            variant="primary"
                            onClick={checkout}
                            disabled={selectedCards.length === 0 || loading}
                            className="btn-checkout"
                        >
                            {loading ? 'Processando...' : 'Finalizar Compra'}
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}