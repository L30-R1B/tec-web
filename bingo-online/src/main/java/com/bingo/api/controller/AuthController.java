package com.bingo.api.controller;

import com.bingo.api.dto.AuthRequest;
import com.bingo.api.dto.AuthResponse;
import com.bingo.api.dto.UsuarioDTO;
import com.bingo.api.entity.Usuario;
import com.bingo.api.security.JwtUtil;
import com.bingo.api.service.UsuarioService;
import jakarta.validation.Valid;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

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
        // 1. Prepara o usuário (sem salvar)
        Usuario usuario = usuarioService.criarUsuario(
            request.getNome(),
            request.getEmail(),
            request.getSenha()
        );

        // 2. Define as propriedades específicas de um usuário comum
        usuario.setCreditos(BigDecimal.ZERO);
        usuario.setIsAdmin(false);

        // 3. Salva o usuário configurado
        usuarioService.save(usuario);

        // 4. Gera o token e a resposta
        String jwt = jwtUtil.generateToken(usuario.getEmail());
        AuthResponse response = new AuthResponse(jwt, usuarioService.toDTO(usuario));

        return ResponseEntity.ok(response);
    }

    // MÉTODO ATUALIZADO
    @PostMapping("/register/admin")
    public ResponseEntity<UsuarioDTO> registrarAdmin(@Valid @RequestBody AuthRequest request, @RequestHeader("X-Admin-Secret") String secret) {
        if (!"senha-super-secreta-admin".equals(secret)) {
            return ResponseEntity.status(403).build();
        }

        // 1. Prepara o usuário (sem salvar)
        Usuario admin = usuarioService.criarUsuario(
            request.getNome(),
            request.getEmail(),
            request.getSenha()
        );

        // 2. Define as propriedades específicas de um admin
        admin.setCreditos(new BigDecimal("9999.99")); // Ex: Admins começam com mais créditos
        admin.setIsAdmin(true);
        
        // 3. Salva o admin configurado
        usuarioService.save(admin);

        return ResponseEntity.ok(usuarioService.toDTO(admin));
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getSenha())
        );

        Usuario usuario = (Usuario) authentication.getPrincipal();

        String jwt = jwtUtil.generateToken(usuario.getEmail());
        AuthResponse response = new AuthResponse(jwt, usuarioService.toDTO(usuario));

        return ResponseEntity.ok(response);
    }
}
