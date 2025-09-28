package com.bingo.api.controller;

import com.bingo.api.dto.AuthRequest;
import com.bingo.api.dto.AuthResponse;
import com.bingo.api.entity.Usuario;
import com.bingo.api.security.JwtUtil;
import com.bingo.api.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UsuarioService usuarioService;
    
    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("OK");
    }
    
    @PostMapping("/registrar")
    public ResponseEntity<AuthResponse> registrar(@Valid @RequestBody AuthRequest request) {
        Usuario usuario = usuarioService.criarUsuario(
            request.getNome(), 
            request.getEmail(), 
            request.getSenha()
        );
        
        String jwt = jwtUtil.generateToken(usuario.getEmail());
        AuthResponse response = new AuthResponse(jwt, usuarioService.toDTO(usuario));
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getSenha())
        );
        
        Usuario usuario = usuarioService.buscarPorEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        String jwt = jwtUtil.generateToken(usuario.getEmail());
        AuthResponse response = new AuthResponse(jwt, usuarioService.toDTO(usuario));
        
        return ResponseEntity.ok(response);
    }
}
