package com.bingo.api.dto;

public class WebSocketMessage {
    private String tipo;
    private Object data;
    
    // Construtores
    public WebSocketMessage() {}
    
    public WebSocketMessage(String tipo, Object data) {
        this.tipo = tipo;
        this.data = data;
    }
    
    // Getters e Setters
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    
    public Object getData() { return data; }
    public void setData(Object data) { this.data = data; }
}