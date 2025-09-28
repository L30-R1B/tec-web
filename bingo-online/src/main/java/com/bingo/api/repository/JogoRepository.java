package com.bingo.api.repository;

import com.bingo.api.entity.Jogo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface JogoRepository extends JpaRepository<Jogo, Long> {
    List<Jogo> findBySalaIdSala(Long idSala);
    
    @Query("SELECT j FROM Jogo j WHERE j.sala.idSala = :idSala AND j.status IN ('AGUARDANDO', 'EM_ANDAMENTO')")
    List<Jogo> findJogosAtivosBySala(@Param("idSala") Long idSala);
    
    List<Jogo> findByStatus(String status);
}