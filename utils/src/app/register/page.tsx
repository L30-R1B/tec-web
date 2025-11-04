// src/app/register/page.tsx
"use client";
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (senha !== confirmSenha) {
      setError("As senhas não coincidem");
      return;
    }

    if (senha.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      await register(nome, email, senha, isAdmin);
      router.push("/room");
    } catch (err) {
      setError("Erro ao criar conta. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-sidebar">
        <img src="/bingo.jpg" alt="Bingo" className="login-image" />
      </div>

      <div className="login-form-container">
        <h1 className="login-title">Criar Conta</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div style={{ 
              color: '#dc2626', 
              backgroundColor: '#fee2e2', 
              padding: '10px', 
              borderRadius: '8px',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="nome" className="form-label">
              Nome Completo
            </label>
            <input
              type="text"
              id="nome"
              className="form-input"
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha" className="form-label">
              Senha
            </label>
            <input
              type="password"
              id="senha"
              className="form-input"
              placeholder="Mínimo 6 caracteres"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmSenha" className="form-label">
              Confirmar Senha
            </label>
            <input
              type="password"
              id="confirmSenha"
              className="form-input"
              placeholder="Repita sua senha"
              value={confirmSenha}
              onChange={(e) => setConfirmSenha(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginTop: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span className="form-label" style={{ margin: 0 }}>
                Registrar como Administrador
              </span>
            </label>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Criando conta..." : "Cadastrar"}
          </button>
        </form>

        <p className="login-signup-text" style={{ marginTop: '24px' }}>
          Já tem uma conta?{" "}
          <Link href="/login" className="login-signup-link">
            Faça login!
          </Link>
        </p>
      </div>
    </div>
  );
}