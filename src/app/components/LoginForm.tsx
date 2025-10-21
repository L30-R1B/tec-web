"use client";
import React from "react";

export default function LoginForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Login realizado com sucesso!");
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="username" className="form-label">
          Usuário
        </label>
        <input
          type="text"
          id="username"
          className="form-input"
          placeholder="Usuário"
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
          placeholder="Senha"
        />
      </div>

      <div className="forgot-password login-signup-link">
        Esqueceu sua senha?
      </div>

      <button type="submit" className="login-button">
        Entrar
      </button>
    </form>
  );
}