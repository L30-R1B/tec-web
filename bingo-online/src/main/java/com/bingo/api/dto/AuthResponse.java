package com.bingo.api.dto;

public class AuthResponse {
    private String token;
    private String tipo = "Bearer";
    private UsuarioDTO usuario;
    
    // Construtores
    public AuthResponse() {}
    
    public AuthResponse(String token, UsuarioDTO usuario) {
        this.token = token;
        this.usuario = usuario;
    }
    
    // Getters e Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    
    public UsuarioDTO getUsuario() { return usuario; }
    public void setUsuario(UsuarioDTO usuario) { this.usuario = usuario; }
}