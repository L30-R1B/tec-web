'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE = 'http://localhost:3333';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.access_token;
        localStorage.setItem('bingoToken', token);

        // Obter o perfil do usuário para verificar se é admin
        const profileResponse = await fetch(`${API_BASE}/auth/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (profileResponse.ok) {
          const userData = await profileResponse.json();
          if (userData.is_admin) {
            router.push('/admin');
          } else {
            router.push('/rooms');
          }
        } else {
          setError('Erro ao carregar perfil do usuário.');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erro ao fazer login.');
      }
    } catch (error) {
      setError('Erro ao fazer login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div className="form-group">
        <label htmlFor="email" className="form-label">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="form-input"
          placeholder="seu@email.com"
        />
      </div>

      <div className="form-group">
        <label htmlFor="senha" className="form-label">
          Senha
        </label>
        <input
          id="senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          className="form-input"
          placeholder="Sua senha"
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <button 
        type="submit" 
        disabled={loading}
        className="login-button"
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
}