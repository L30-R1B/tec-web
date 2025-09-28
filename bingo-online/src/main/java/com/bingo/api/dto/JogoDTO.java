package com.bingo.api.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class JogoDTO {
    private Long idJogo;
    private LocalDateTime dataHora;
    private SalaDTO sala;
    private UsuarioDTO usuarioVencedor;
    private BigDecimal precoCartela;
    private String status;
    
    // Construtores
    public JogoDTO() {}
    
    // Getters e Setters
    public Long getIdJogo() { return idJogo; }
    public void setIdJogo(Long idJogo) { this.idJogo = idJogo; }
    
    public LocalDateTime getDataHora() { return dataHora; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }
    
    public SalaDTO getSala() { return sala; }
    public void setSala(SalaDTO sala) { this.sala = sala; }
    
    public UsuarioDTO getUsuarioVencedor() { return usuarioVencedor; }
    public void setUsuarioVencedor(UsuarioDTO usuarioVencedor) { this.usuarioVencedor = usuarioVencedor; }
    
    public BigDecimal getPrecoCartela() { return precoCartela; }
    public void setPrecoCartela(BigDecimal precoCartela) { this.precoCartela = precoCartela; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}