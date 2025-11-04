"use client";
import React, { useState } from "react";

const API_BASE = 'http://100.124.95.109:3333';

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          senha: password
        })
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.access_token;
        localStorage.setItem('bingoToken', token);

        // Verificar se é admin para redirecionar
        const userResponse = await fetch(`${API_BASE}/auth/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          if (userData.is_admin) {
            window.location.href = '/admin';
          } else {
            window.location.href = '/rooms';
          }
        } else {
          setError('Erro ao carregar perfil do usuário.');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'E-mail ou senha inválidos.');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="email" className="form-label">
          E-mail
        </label>
        <input
          type="email"
          id="email"
          className="form-input"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password" className="form-label">
          Senha
        </label>
        <input
          type="password"
          id="password"
          className="form-input"
          placeholder="Sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      {error && (
        <div className="error-message" style={{ 
          color: 'red', 
          textAlign: 'center', 
          marginBottom: '15px',
          padding: '10px',
          backgroundColor: '#ffe6e6',
          borderRadius: '5px'
        }}>
          {error}
        </div>
      )}

      <div className="forgot-password" style={{ textAlign: 'right', marginBottom: '20px' }}>
        <a href="#" className="login-signup-link" style={{ fontSize: '14px' }}>
          Esqueceu sua senha?
        </a>
      </div>

      <button 
        type="submit" 
        className="login-button"
        disabled={loading}
        style={{ 
          opacity: loading ? 0.7 : 1,
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
}