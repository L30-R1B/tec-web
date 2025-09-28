package com.bingo.api.controller;

import com.bingo.api.dto.JogoDTO;
import com.bingo.api.dto.SalaDTO;
import com.bingo.api.entity.Jogo;
import com.bingo.api.entity.Sala;
import com.bingo.api.service.JogoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.bingo.api.repository.SalaRepository;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private SalaRepository salaRepository;

    @Autowired
    private JogoService jogoService;

    @PostMapping("/salas")
    public ResponseEntity<SalaDTO> criarSala(@RequestBody SalaDTO salaDTO) {
        Sala sala = new Sala();
        sala.setNome(salaDTO.getNome());
        sala.setDescricao(salaDTO.getDescricao());
        Sala novaSala = salaRepository.save(sala);
        SalaDTO responseDTO = new SalaDTO(novaSala.getIdSala(), novaSala.getNome(), novaSala.getDescricao());
        return ResponseEntity.ok(responseDTO);
    }

    @PostMapping("/jogos")
    public ResponseEntity<JogoDTO> criarJogo(@RequestBody Map<String, Object> payload) {
        Long idSala = Long.valueOf(payload.get("idSala").toString());
        Double precoCartela = Double.valueOf(payload.get("precoCartela").toString());
        Sala sala = salaRepository.findById(idSala)
                .orElseThrow(() -> new RuntimeException("Sala não encontrada"));
        Jogo jogo = jogoService.criarJogo(sala, precoCartela);

        // Simple DTO conversion
        JogoDTO jogoDTO = new JogoDTO();
        jogoDTO.setIdJogo(jogo.getIdJogo());
        jogoDTO.setStatus(jogo.getStatus());
        jogoDTO.setPrecoCartela(jogo.getPrecoCartela());
        jogoDTO.setDataHora(jogo.getDataHora());

        return ResponseEntity.ok(jogoDTO);
    }

    @PostMapping("/jogos/{idJogo}/iniciar")
    public ResponseEntity<Void> iniciarJogo(@PathVariable Long idJogo) {
        jogoService.iniciarJogo(idJogo);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/jogos/{idJogo}/finalizar")
    public ResponseEntity<Void> finalizarJogo(@PathVariable Long idJogo) {
        jogoService.finalizarJogo(idJogo);
        return ResponseEntity.ok().build();
    }
}