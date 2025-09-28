package com.bingo.api.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "CARTELA")
public class Cartela {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCartela;
    
    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;
    
    @ManyToOne
    @JoinColumn(name = "id_jogo", nullable = false)
    private Jogo jogo;
    
    @OneToMany(mappedBy = "cartela", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<NumeroCartela> numeros = new ArrayList<>();
    
    // Construtores
    public Cartela() {}
    
    public Cartela(Usuario usuario, Jogo jogo) {
        this.usuario = usuario;
        this.jogo = jogo;
    }
    
    // Getters e Setters
    public Long getIdCartela() { return idCartela; }
    public void setIdCartela(Long idCartela) { this.idCartela = idCartela; }
    
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    
    public Jogo getJogo() { return jogo; }
    public void setJogo(Jogo jogo) { this.jogo = jogo; }
    
    public List<NumeroCartela> getNumeros() { return numeros; }
    public void setNumeros(List<NumeroCartela> numeros) { this.numeros = numeros; }
}