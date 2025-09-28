package com.bingo.api.repository;

import com.bingo.api.entity.NumeroSorteado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface NumeroSorteadoRepository extends JpaRepository<NumeroSorteado, Long> {
    List<NumeroSorteado> findByJogoIdJogoOrderByOrdemSorteio(Long idJogo);
    
    @Query("SELECT MAX(ns.ordemSorteio) FROM NumeroSorteado ns WHERE ns.jogo.idJogo = :idJogo")
    Optional<Integer> findMaxOrdemSorteioByJogo(@Param("idJogo") Long idJogo);
    
    @Query("SELECT ns.numero FROM NumeroSorteado ns WHERE ns.jogo.idJogo = :idJogo")
    List<Integer> findNumerosSorteadosByJogo(@Param("idJogo") Long idJogo);
    
    Boolean existsByJogoIdJogoAndNumero(Long idJogo, Integer numero);
}