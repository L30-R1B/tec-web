package com.bingo.api.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "NUMEROS_CARTELA")
public class NumeroCartela {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idNumeroCartela;
    
    @Column(nullable = false)
    private Integer numero;
    
    @ManyToOne
    @JoinColumn(name = "id_cartela", nullable = false)
    private Cartela cartela;
    
    // Construtores
    public NumeroCartela() {}
    
    public NumeroCartela(Integer numero, Cartela cartela) {
        this.numero = numero;
        this.cartela = cartela;
    }
    
    // Getters e Setters
    public Long getIdNumeroCartela() { return idNumeroCartela; }
    public void setIdNumeroCartela(Long idNumeroCartela) { this.idNumeroCartela = idNumeroCartela; }
    
    public Integer getNumero() { return numero; }
    public void setNumero(Integer numero) { this.numero = numero; }
    
    public Cartela getCartela() { return cartela; }
    public void setCartela(Cartela cartela) { this.cartela = cartela; }
}