package com.bingo.api.dto;

public class SalaDTO {
    private Long idSala;
    private String nome;
    private String descricao;
    
    // Construtores
    public SalaDTO() {}
    
    public SalaDTO(Long idSala, String nome, String descricao) {
        this.idSala = idSala;
        this.nome = nome;
        this.descricao = descricao;
    }
    
    // Getters e Setters
    public Long getIdSala() { return idSala; }
    public void setIdSala(Long idSala) { this.idSala = idSala; }
    
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
}