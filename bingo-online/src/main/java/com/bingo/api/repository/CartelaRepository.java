package com.bingo.api.repository;

import com.bingo.api.entity.Cartela;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface CartelaRepository extends JpaRepository<Cartela, Long> {
    List<Cartela> findByJogoIdJogo(Long idJogo);
    List<Cartela> findByUsuarioIdUsuarioAndJogoIdJogo(Long idUsuario, Long idJogo);
    
    @Query("SELECT c FROM Cartela c WHERE c.jogo.idJogo = :idJogo AND c.usuario.idUsuario = :idUsuario")
    Optional<Cartela> findByJogoAndUsuario(@Param("idJogo") Long idJogo, @Param("idUsuario") Long idUsuario);
    
    @Query("SELECT COUNT(c) FROM Cartela c WHERE c.jogo.idJogo = :idJogo")
    Integer countCartelasByJogo(@Param("idJogo") Long idJogo);
}