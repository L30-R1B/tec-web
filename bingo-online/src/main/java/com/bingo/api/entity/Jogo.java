package com.bingo.api.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "JOGO")
public class Jogo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idJogo;
    
    @Column(nullable = false, columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime dataHora = LocalDateTime.now();
    
    @ManyToOne
    @JoinColumn(name = "id_sala", nullable = false)
    private Sala sala;
    
    @ManyToOne
    @JoinColumn(name = "id_usuario_vencedor")
    private Usuario usuarioVencedor;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precoCartela = BigDecimal.ONE;
    
    @Column(nullable = false, length = 20)
    private String status = "AGUARDANDO"; // AGUARDANDO, EM_ANDAMENTO, FINALIZADO
    
    // Construtores
    public Jogo() {}
    
    public Jogo(Sala sala, BigDecimal precoCartela) {
        this.sala = sala;
        this.precoCartela = precoCartela;
    }
    
    // Getters e Setters
    public Long getIdJogo() { return idJogo; }
    public void setIdJogo(Long idJogo) { this.idJogo = idJogo; }
    
    public LocalDateTime getDataHora() { return dataHora; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }
    
    public Sala getSala() { return sala; }
    public void setSala(Sala sala) { this.sala = sala; }
    
    public Usuario getUsuarioVencedor() { return usuarioVencedor; }
    public void setUsuarioVencedor(Usuario usuarioVencedor) { this.usuarioVencedor = usuarioVencedor; }
    
    public BigDecimal getPrecoCartela() { return precoCartela; }
    public void setPrecoCartela(BigDecimal precoCartela) { this.precoCartela = precoCartela; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}