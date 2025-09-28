package com.bingo.api.service;

import com.bingo.api.dto.WebSocketMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketService {
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    public void enviarMensagemSala(Long salaId, WebSocketMessage message) {
        messagingTemplate.convertAndSend("/topic/sala/" + salaId, message);
    }
}