'use client';

import { useState } from 'react';
import Button from "./button";

interface RechargeCreditsProps {
    onRecharge: (amount: number) => void;
    currentBalance: number;
}

const rechargeOptions = [
    { value: 10, label: 'R$ 10,00' },
    { value: 20, label: 'R$ 20,00' },
    { value: 50, label: 'R$ 50,00' },
    { value: 100, label: 'R$ 100,00' },
];

export default function RechargeCredits({ onRecharge, currentBalance }: RechargeCreditsProps) {
    const [isRecharging, setIsRecharging] = useState(false);
    const [customAmount, setCustomAmount] = useState('');
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

    const handleRecharge = (amount: number) => {
        onRecharge(amount);
        setIsRecharging(false);
        setSelectedAmount(null);
        setCustomAmount('');
    };

    const handleCustomRecharge = () => {
        const amount = parseFloat(customAmount);
        if (amount && amount > 0) {
            handleRecharge(amount);
        } else {
            alert('Por favor, insira um valor válido!');
        }
    };

    if (!isRecharging) {
        return (
            <span 
                className="recharge-balance"
                onClick={() => setIsRecharging(true)}
                style={{ cursor: 'pointer' }}
            >
                Recarregar créditos
            </span>
        );
    }

    return (
        <div className="recharge-modal">
            <div className="recharge-content">
                <div className="recharge-header">
                    <h3>Recarregar Créditos</h3>
                    <button 
                        className="close-button"
                        onClick={() => setIsRecharging(false)}
                    >
                        ×
                    </button>
                </div>
                
                <div className="current-balance">
                    <span>Saldo Atual: <strong>R$ {currentBalance.toFixed(2)}</strong></span>
                </div>

                <div className="recharge-options">
                    <h4>Valores Sugeridos:</h4>
                    <div className="amount-buttons">
                        {rechargeOptions.map(option => (
                            <button
                                key={option.value}
                                className={`amount-btn ${selectedAmount === option.value ? 'selected' : ''}`}
                                onClick={() => setSelectedAmount(option.value)}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="custom-amount">
                    <h4>Ou digite o melhor para você:</h4>
                    <div className="custom-input-group">
                        <span className="currency-symbol">R$</span>
                        <input
                            type="number"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            placeholder="0,00"
                            min="1"
                            step="0.01"
                        />
                    </div>
                </div>

                <div className="recharge-actions">
                    <Button
                        variant="secondary"
                        onClick={() => setIsRecharging(false)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            if (selectedAmount) {
                                handleRecharge(selectedAmount);
                            } else if (customAmount) {
                                handleCustomRecharge();
                            } else {
                                alert('Selecione um valor ou digite um valor personalizado!');
                            }
                        }}
                    >
                        Confirmar Recarga
                    </Button>
                </div>
            </div>
        </div>
    );
}