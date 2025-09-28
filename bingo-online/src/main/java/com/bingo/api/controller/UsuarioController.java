package com.bingo.api.controller;

import com.bingo.api.dto.UsuarioDTO;
import com.bingo.api.entity.Usuario;
import com.bingo.api.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    
    @Autowired
    private UsuarioService usuarioService;
    
    @GetMapping("/me")
    public ResponseEntity<UsuarioDTO> getUsuarioAtual(@AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(usuarioService.toDTO(usuario));
    }
}