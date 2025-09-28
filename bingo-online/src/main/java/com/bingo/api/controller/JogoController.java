package com.bingo.api.controller;

import com.bingo.api.dto.CartelaDTO;
import com.bingo.api.entity.Cartela;
import com.bingo.api.entity.Usuario;
import com.bingo.api.service.CartelaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jogos")
public class JogoController {

    @Autowired
    private CartelaService cartelaService;

    @PostMapping("/{idJogo}/comprar-cartela")
    public ResponseEntity<CartelaDTO> comprarCartela(@PathVariable Long idJogo, @AuthenticationPrincipal Usuario usuario) {
        Cartela cartela = cartelaService.comprarCartela(idJogo, usuario);
        return ResponseEntity.ok(cartelaService.toDTO(cartela));
    }
}