package com.bingo.api.service;

import com.bingo.api.entity.*;
import com.bingo.api.repository.CartelaRepository;
import com.bingo.api.repository.JogoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CartelaService {
    
    @Autowired
    private CartelaRepository cartelaRepository;
    
    @Autowired
    private JogoRepository jogoRepository;
    
    @Autowired
    private UsuarioService usuarioService;
    
    private final Random random = new Random();
    
    @Transactional
    public Cartela comprarCartela(Long idJogo, Usuario usuario) {
        Jogo jogo = jogoRepository.findById(idJogo)
            .orElseThrow(() -> new RuntimeException("Jogo não encontrado"));
        
        if (!"AGUARDANDO".equals(jogo.getStatus())) {
            throw new RuntimeException("Não é possível comprar cartela para jogo em andamento ou finalizado");
        }
        
        // Verificar se usuário já tem cartela neste jogo
        Optional<Cartela> cartelaExistente = cartelaRepository.findByJogoAndUsuario(idJogo, usuario.getIdUsuario());
        if (cartelaExistente.isPresent()) {
            throw new RuntimeException("Usuário já possui cartela neste jogo");
        }
        
        // Debitar créditos
        usuarioService.debitarCredito(usuario, jogo.getPrecoCartela());
        
        // Criar cartela
        Cartela cartela = new Cartela();
        cartela.setUsuario(usuario);
        cartela.setJogo(jogo);
        
        Cartela cartelaSalva = cartelaRepository.save(cartela);
        
        // Gerar números da cartela (15 números únicos entre 1-75)
        Set<Integer> numeros = new HashSet<>();
        while (numeros.size() < 15) {
            numeros.add(random.nextInt(75) + 1);
        }
        
        // Salvar números da cartela
        for (Integer numero : numeros) {
            NumeroCartela numeroCartela = new NumeroCartela();
            numeroCartela.setNumero(numero);
            numeroCartela.setCartela(cartelaSalva);
            cartelaSalva.getNumeros().add(numeroCartela);
        }
        
        return cartelaRepository.save(cartelaSalva);
    }
    
    public com.bingo.api.dto.CartelaDTO toDTO(Cartela cartela) {
        com.bingo.api.dto.CartelaDTO dto = new com.bingo.api.dto.CartelaDTO();
        dto.setIdCartela(cartela.getIdCartela());
        dto.setUsuario(usuarioService.toDTO(cartela.getUsuario()));
        dto.setJogo(toDTO(cartela.getJogo()));
        dto.setNumeros(cartela.getNumeros().stream()
            .map(NumeroCartela::getNumero)
            .collect(Collectors.toList()));
        return dto;
    }
    
    private com.bingo.api.dto.JogoDTO toDTO(Jogo jogo) {
        com.bingo.api.dto.JogoDTO dto = new com.bingo.api.dto.JogoDTO();
        dto.setIdJogo(jogo.getIdJogo());
        dto.setDataHora(jogo.getDataHora());
        dto.setPrecoCartela(jogo.getPrecoCartela());
        dto.setStatus(jogo.getStatus());
        
        if (jogo.getUsuarioVencedor() != null) {
            dto.setUsuarioVencedor(usuarioService.toDTO(jogo.getUsuarioVencedor()));
        }
        
        return dto;
    }
}