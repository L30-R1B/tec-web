package com.bingo.api.controller;

import com.bingo.api.dto.AuthRequest;
import com.bingo.api.dto.AuthResponse;
import com.bingo.api.dto.UsuarioDTO;
import com.bingo.api.entity.Usuario;
import com.bingo.api.security.JwtUtil;
import com.bingo.api.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
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
        Usuario usuario = usuarioService.registrarNovoUsuario(
            request.getNome(),
            request.getEmail(),
            request.getSenha(),
            false // Não é admin
        );
        String jwt = jwtUtil.generateToken(usuario.getUsername());
        AuthResponse response = new AuthResponse(jwt, usuarioService.toDTO(usuario));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register/admin")
    public ResponseEntity<UsuarioDTO> registrarAdmin(@Valid @RequestBody AuthRequest request, @RequestHeader("X-Admin-Secret") String secret) {
        if (!"senha-super-secreta-admin".equals(secret)) {
            return ResponseEntity.status(403).build(); // Forbidden
        }
        Usuario admin = usuarioService.registrarNovoUsuario(
            request.getNome(),
            request.getEmail(),
            request.getSenha(),
            true // É admin
        );
        return ResponseEntity.ok(usuarioService.toDTO(admin));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getSenha())
        );
        Usuario usuario = (Usuario) authentication.getPrincipal();
        String jwt = jwtUtil.generateToken(usuario.getUsername());
        AuthResponse response = new AuthResponse(jwt, usuarioService.toDTO(usuario));
        return ResponseEntity.ok(response);
    }
}