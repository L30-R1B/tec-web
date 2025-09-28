package com.bingo.api.service;

import com.bingo.api.dto.UsuarioDTO;
import com.bingo.api.entity.Usuario;
import com.bingo.api.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public Usuario registrarNovoUsuario(String nome, String email, String senha, boolean isAdmin) {
        if (usuarioRepository.existsByEmail(email)) {
            throw new RuntimeException("Erro: Email já está em uso!");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(nome);
        usuario.setEmail(email);
        usuario.setSenha(passwordEncoder.encode(senha));
        usuario.setIsAdmin(isAdmin);

        if (isAdmin) {
            usuario.setCreditos(new BigDecimal("9999.00"));
        } else {
            usuario.setCreditos(BigDecimal.ZERO);
        }

        return usuarioRepository.save(usuario);
    }
    
    @Transactional
    public void save(Usuario usuario) {
        usuarioRepository.save(usuario);
    }

    public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }
    
    public UsuarioDTO toDTO(Usuario usuario) {
        return new UsuarioDTO(
            usuario.getIdUsuario(),
            usuario.getNome(),
            usuario.getEmail(),
            usuario.getCreditos(),
            usuario.getIsAdmin()
        );
    }
    
    @Transactional
    public void debitarCredito(Usuario usuario, BigDecimal valor) {
        if (usuario.getCreditos().compareTo(valor) < 0) {
            throw new RuntimeException("Créditos insuficientes");
        }
        usuario.setCreditos(usuario.getCreditos().subtract(valor));
        usuarioRepository.save(usuario);
    }

    public Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }
}