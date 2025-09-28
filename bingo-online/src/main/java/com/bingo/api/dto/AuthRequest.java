package com.bingo.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class AuthRequest {

    @NotBlank
    private String nome;

    @Email
    @NotBlank
    private String email;
    
    @NotBlank
    private String senha;
    
    // Construtores
    public AuthRequest() {}
    
    public AuthRequest(String email, String senha) {
        this.email = email;
        this.senha = senha;
    }
    
    // Getters e Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
}