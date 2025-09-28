package com.bingo.api.controller;

import com.bingo.api.entity.Jogo;
import com.bingo.api.entity.Sala;
import com.bingo.api.repository.JogoRepository;
import com.bingo.api.repository.SalaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/salas")
public class SalaController {

    @Autowired
    private SalaRepository salaRepository;

    @Autowired
    private JogoRepository jogoRepository;

    @GetMapping
    public ResponseEntity<List<Sala>> listarSalas() {
        return ResponseEntity.ok(salaRepository.findAll());
    }

    @GetMapping("/{idSala}/jogos")
    public ResponseEntity<List<Jogo>> listarJogosDaSala(@PathVariable Long idSala) {
        return ResponseEntity.ok(jogoRepository.findBySalaIdSala(idSala));
    }
}