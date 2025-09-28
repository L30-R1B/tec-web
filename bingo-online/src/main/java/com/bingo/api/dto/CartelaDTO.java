package com.bingo.api.dto;

import java.util.List;

public class CartelaDTO {
    private Long idCartela;
    private UsuarioDTO usuario;
    private JogoDTO jogo;
    private List<Integer> numeros;
    
    // Construtores
    public CartelaDTO() {}
    
    // Getters e Setters
    public Long getIdCartela() { return idCartela; }
    public void setIdCartela(Long idCartela) { this.idCartela = idCartela; }
    
    public UsuarioDTO getUsuario() { return usuario; }
    public void setUsuario(UsuarioDTO usuario) { this.usuario = usuario; }
    
    public JogoDTO getJogo() { return jogo; }
    public void setJogo(JogoDTO jogo) { this.jogo = jogo; }
    
    public List<Integer> getNumeros() { return numeros; }
    public void setNumeros(List<Integer> numeros) { this.numeros = numeros; }
}