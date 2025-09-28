package com.bingo.api.dto;

import java.math.BigDecimal;

public class UsuarioDTO {
    private Long idUsuario;
    private String nome;
    private String email;
    private BigDecimal creditos;
    private Boolean isAdmin;
    
    // Construtores
    public UsuarioDTO() {}
    
    public UsuarioDTO(Long idUsuario, String nome, String email, BigDecimal creditos, Boolean isAdmin) {
        this.idUsuario = idUsuario;
        this.nome = nome;
        this.email = email;
        this.creditos = creditos;
        this.isAdmin = isAdmin;
    }
    
    // Getters e Setters
    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }
    
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public BigDecimal getCreditos() { return creditos; }
    public void setCreditos(BigDecimal creditos) { this.creditos = creditos; }
    
    public Boolean getIsAdmin() { return isAdmin; }
    public void setIsAdmin(Boolean isAdmin) { this.isAdmin = isAdmin; }
}