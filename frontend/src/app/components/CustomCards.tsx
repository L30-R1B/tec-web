'use client';

import { useState } from 'react';
import Button from "./button";

export interface Card {
    id: number;
    numbers: number[][];
    price: number;
    type: string;
    description: string;
}

interface CustomCardsProps {
    onAddCustomCard: (card: Card) => void;
}

export default function CustomCards({ onAddCustomCard }: CustomCardsProps) {
    const [isBuilding, setIsBuilding] = useState(false);
    const [cardSize, setCardSize] = useState<'4x4' | '5x5'>('5x5');
    const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
    const [cardName, setCardName] = useState('Minha Cartela Personalizada');

    const maxNumbers = cardSize === '4x4' ? 16 : 25;
    const numbersPerRow = cardSize === '4x4' ? 4 : 5;
    const availableNumbers = Array.from({ length: 75 }, (_, i) => i + 1);

    const toggleNumber = (number: number) => {
        setSelectedNumbers(prev => {
            if (prev.includes(number)) {
                return prev.filter(n => n !== number);
            } else if (prev.length < maxNumbers) {
                return [...prev, number];
            }
            return prev;
        });
    };

    const generateRandomCard = () => {
        const shuffled = [...availableNumbers].sort(() => 0.5 - Math.random());
        const randomNumbers = shuffled.slice(0, maxNumbers);
        setSelectedNumbers(randomNumbers);
    };

    const clearSelection = () => {
        setSelectedNumbers([]);
    };

    const createCard = () => {
        if (selectedNumbers.length !== maxNumbers) {
            alert(`Selecione exatamente ${maxNumbers} números!`);
            return;
        }

        const numbersMatrix: number[][] = [];
        for (let i = 0; i < numbersPerRow; i++) {
            const row = selectedNumbers.slice(i * numbersPerRow, (i + 1) * numbersPerRow);
            numbersMatrix.push(row);
        }

        const middleIndex = Math.floor(numbersPerRow / 2);
        if (numbersMatrix[middleIndex] && numbersMatrix[middleIndex][middleIndex] !== undefined) {
            numbersMatrix[middleIndex][middleIndex] = 0;
        }

        const customCard: Card = {
            id: Date.now(),
            type: cardName,
            description: `Cartela personalizada ${cardSize}`,
            price: cardSize === '4x4' ? 20.00 : 30.00,
            numbers: numbersMatrix
        };

        onAddCustomCard(customCard);
        setIsBuilding(false);
        setSelectedNumbers([]);
        setCardName('Minha Cartela Personalizada');
    };

    if (!isBuilding) {
        return (
            <div className="custom-card-cta">
                <Button 
                    variant="outline" 
                    onClick={() => setIsBuilding(true)}
                    className="btn-build-custom"
                >
                    Ou monte sua própria cartela!
                </Button>
            </div>
        );
    }

    return (
        <div className="custom-card-builder">
            <div className="builder-header">
                <h3>Monte Sua Cartela Personalizada</h3>
                <Button variant="secondary" onClick={() => setIsBuilding(false)}>
                    Cancelar
                </Button>
            </div>

            <div className="builder-controls">
                <div className="size-selector">
                    <label>Tamanho da Cartela:</label>
                    <select 
                        value={cardSize} 
                        onChange={(e) => {
                            setCardSize(e.target.value as '4x4' | '5x5');
                            setSelectedNumbers([]);
                        }}
                    >
                        <option value="5x5">5x5 (25 números - R$ 30,00)</option>
                        <option value="4x4">4x4 (16 números - R$ 20,00)</option>
                    </select>
                </div>

                <div className="name-input">
                    <label>Nome da sua cartela:</label>
                    <input 
                        type="text" 
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Dê um nome para sua cartela"
                    />
                </div>

                <div className="action-buttons">
                    <Button variant="secondary" onClick={generateRandomCard}>
                         Preencher Aleatoriamente
                    </Button>
                    <Button variant="secondary" onClick={clearSelection}>
                         Limpar Seleção
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={createCard}
                        disabled={selectedNumbers.length !== maxNumbers}
                    >
                         Criar Cartela ({selectedNumbers.length}/{maxNumbers})
                    </Button>
                </div>
            </div>

            <div className="numbers-grid-builder">
                <h4>Selecione {maxNumbers} números ({cardSize})</h4>
                <div className="available-numbers">
                    {availableNumbers.map(number => (
                        <button
                            key={number}
                            className={`number-btn ${selectedNumbers.includes(number) ? 'selected' : ''}`}
                            onClick={() => toggleNumber(number)}
                            disabled={!selectedNumbers.includes(number) && selectedNumbers.length >= maxNumbers}
                        >
                            {number}
                        </button>
                    ))}
                </div>
            </div>

            {selectedNumbers.length > 0 && (
                <div className="card-preview">
                    <h4>Prévia da sua cartela:</h4>
                    <div className={`preview-grid ${cardSize}`}>
                        {Array.from({ length: numbersPerRow }, (_, rowIndex) => (
                            <div key={rowIndex} className="preview-row">
                                {Array.from({ length: numbersPerRow }, (_, colIndex) => {
                                    const index = rowIndex * numbersPerRow + colIndex;
                                    const number = selectedNumbers[index] || 0;
                                    const isFree = rowIndex === Math.floor(numbersPerRow/2) && 
                                                 colIndex === Math.floor(numbersPerRow/2);
                                    
                                    return (
                                        <div key={colIndex} className={`preview-number ${isFree ? 'free' : ''}`}>
                                            {isFree ? '★' : number || '?'}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}