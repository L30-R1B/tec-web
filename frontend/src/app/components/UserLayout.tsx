// app/components/UserLayout.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Button from "./button";
import RechargeCredits from "./RechargeCredits";

interface UserLayoutProps {
  children: React.ReactNode;
}

const API_BASE = typeof window !== 'undefined' ? (window.location.hostname === 'localhost' ? 'http://localhost:3333' : 'http://100.124.95.109:3333') : 'http://localhost:3333';

export default function UserLayout({ children }: UserLayoutProps) {
  const [user, setUser] = useState<any>(null);
  const [userBalance, setUserBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('bingoToken');
    if (!token) {
      router.push('/login');
      return;
    }

    const loadUserProfile = async () => {
      try {
        const response = await fetch(`${API_BASE}/auth/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setUserBalance(parseFloat(userData.creditos) || 0);
        } else {
          throw new Error('Falha ao carregar perfil');
        }
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        localStorage.removeItem('bingoToken');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [router]);

  const handleRecharge = async (amount: number) => {
    const token = localStorage.getItem('bingoToken');
    try {
      const response = await fetch(`${API_BASE}/users/me/recharge`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount })
      });

      if (response.ok) {
        const data = await response.json();
        setUserBalance(parseFloat(data.creditos));
        alert(`Créditos recarregados com sucesso! R$ ${amount.toFixed(2)} adicionados à sua conta.`);
      } else {
        alert('Erro ao recarregar créditos.');
      }
    } catch (error) {
      console.error('Erro na recarga:', error);
      alert('Erro ao recarregar créditos.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('bingoToken');
    router.push('/login');
  };

  const isActiveRoute = (route: string) => {
    return pathname === route;
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <header>
        <nav className="navbar">
          <div className="navbar-content">
            <div className="navbar-brand">
              <img
                src="/bingo-logo.png"
                alt="Bingo Online"
                className="navbar-logo"
              />
              <h1 className="navbar-title">Bingo Online</h1>
            </div>

            <div className="navbar-links">
              <a 
                href="/rooms" 
                className={`nav-link ${isActiveRoute('/rooms') ? 'active' : ''}`}
              >
                Salas
              </a>
              <a 
                href="/profile" 
                className={`nav-link ${isActiveRoute('/profile') ? 'active' : ''}`}
              >
                Meu Perfil
              </a>
              <a 
                href="/como-jogar" 
                className={`nav-link ${isActiveRoute('/como-jogar') ? 'active' : ''}`}
              >
                Como Jogar
              </a>
            </div>

            <div className="navbar-user">
              <div className="user-info">
                <span className="user-name">Olá, {user?.nome}!</span>
                <span className="user-balance">Saldo: R$ {userBalance.toFixed(2)}</span>
              </div>
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

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}