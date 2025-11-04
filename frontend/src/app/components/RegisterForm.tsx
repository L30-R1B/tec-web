"use client";
import React, { useState } from "react";

const API_BASE = 'http://100.124.95.109:3333';

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome: name,
          email: email,
          senha: password,
          is_admin: false // Removido a opção do usuário escolher ser admin
        })
      });

      if (response.ok) {
        setSuccess("Conta criada com sucesso! Redirecionando para login...");
        // Limpar formulário
        setName("");
        setEmail("");
        setPassword("");
        // Redirecionar para login após 2 segundos
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erro ao criar conta.');
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name" className="form-label">
          Nome Completo
        </label>
        <input
          type="text"
          id="name"
          className="form-input"
          placeholder="Seu nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={loading}
        />
      </div>

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
          placeholder="Crie uma senha segura"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          minLength={6}
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

      {success && (
        <div className="success-message" style={{ 
          color: 'green', 
          textAlign: 'center', 
          marginBottom: '15px',
          padding: '10px',
          backgroundColor: '#e6ffe6',
          borderRadius: '5px'
        }}>
          {success}
        </div>
      )}

      <button 
        type="submit" 
        className="login-button"
        disabled={loading}
        style={{ 
          opacity: loading ? 0.7 : 1,
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Criando conta...' : 'Criar Conta'}
      </button>
    </form>
  );
}