package com.bingo.api.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "NUMEROS_SORTEADOS")
public class NumeroSorteado {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idNumeroSorteado;
    
    @Column(nullable = false)
    private Integer numero;
    
    @Column(nullable = false)
    private Integer ordemSorteio;
    
    @ManyToOne
    @JoinColumn(name = "id_jogo", nullable = false)
    private Jogo jogo;
    
    // Construtores
    public NumeroSorteado() {}
    
    public NumeroSorteado(Integer numero, Integer ordemSorteio, Jogo jogo) {
        this.numero = numero;
        this.ordemSorteio = ordemSorteio;
        this.jogo = jogo;
    }
    
    // Getters e Setters
    public Long getIdNumeroSorteado() { return idNumeroSorteado; }
    public void setIdNumeroSorteado(Long idNumeroSorteado) { this.idNumeroSorteado = idNumeroSorteado; }
    
    public Integer getNumero() { return numero; }
    public void setNumero(Integer numero) { this.numero = numero; }
    
    public Integer getOrdemSorteio() { return ordemSorteio; }
    public void setOrdemSorteio(Integer ordemSorteio) { this.ordemSorteio = ordemSorteio; }
    
    public Jogo getJogo() { return jogo; }
    public void setJogo(Jogo jogo) { this.jogo = jogo; }
}