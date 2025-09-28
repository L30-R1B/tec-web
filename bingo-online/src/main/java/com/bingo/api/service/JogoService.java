package com.bingo.api.service;

import com.bingo.api.entity.*;
import com.bingo.api.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class JogoService {
    
    @Autowired
    private JogoRepository jogoRepository;
    
    @Autowired
    private NumeroSorteadoRepository numeroSorteadoRepository;
    
    @Autowired
    private CartelaRepository cartelaRepository;
    
    @Autowired
    private WebSocketService webSocketService;
    
    private final Random random = new Random();
    
    public Jogo criarJogo(Sala sala, Double precoCartela) {
        Jogo jogo = new Jogo();
        jogo.setSala(sala);
        jogo.setPrecoCartela(new java.math.BigDecimal(precoCartela));
        jogo.setStatus("AGUARDANDO");
        return jogoRepository.save(jogo);
    }
    
    @Transactional
    public void iniciarJogo(Long idJogo) {
        Jogo jogo = jogoRepository.findById(idJogo)
            .orElseThrow(() -> new RuntimeException("Jogo não encontrado"));
        
        if (!"AGUARDANDO".equals(jogo.getStatus())) {
            throw new RuntimeException("Jogo não está aguardando início");
        }
        
        jogo.setStatus("EM_ANDAMENTO");
        jogoRepository.save(jogo);
        
        // Notificar via WebSocket
        Map<String, Object> data = new HashMap<>();
        data.put("jogoId", jogo.getIdJogo());
        webSocketService.enviarMensagemSala(
            jogo.getSala().getIdSala(), 
            new com.bingo.api.dto.WebSocketMessage("JOGO_INICIADO", data)
        );
    }
    
    @Scheduled(fixedRate = 5000) // Executa a cada 5 segundos
    @Transactional
    public void sortearNumeros() {
        List<Jogo> jogosAtivos = jogoRepository.findByStatus("EM_ANDAMENTO");
        
        for (Jogo jogo : jogosAtivos) {
            sortearNumeroParaJogo(jogo);
        }
    }
    
    private void sortearNumeroParaJogo(Jogo jogo) {
        // Gerar número único entre 1 e 75 (padrão bingo americano)
        Integer numeroSorteado;
        do {
            numeroSorteado = random.nextInt(75) + 1;
        } while (numeroSorteadoRepository.existsByJogoIdJogoAndNumero(jogo.getIdJogo(), numeroSorteado));
        
        // Determinar ordem do sorteio
        Integer ultimaOrdem = numeroSorteadoRepository.findMaxOrdemSorteioByJogo(jogo.getIdJogo())
            .orElse(0);
        
        // Salvar número sorteado
        NumeroSorteado numero = new NumeroSorteado();
        numero.setNumero(numeroSorteado);
        numero.setOrdemSorteio(ultimaOrdem + 1);
        numero.setJogo(jogo);
        numeroSorteadoRepository.save(numero);
        
        // Notificar via WebSocket
        Map<String, Object> data = new HashMap<>();
        data.put("numeroSorteado", numeroSorteado);
        data.put("jogoId", jogo.getIdJogo());
        data.put("ordemSorteio", ultimaOrdem + 1);
        webSocketService.enviarMensagemSala(
            jogo.getSala().getIdSala(), 
            new com.bingo.api.dto.WebSocketMessage("NOVO_NUMERO", data)
        );
        
        // Verificar se há vencedor
        verificarVencedor(jogo);
    }
    
    private void verificarVencedor(Jogo jogo) {
        List<Cartela> cartelas = cartelaRepository.findByJogoIdJogo(jogo.getIdJogo());
        List<Integer> numerosSorteados = numeroSorteadoRepository.findNumerosSorteadosByJogo(jogo.getIdJogo());
        
        for (Cartela cartela : cartelas) {
            if (isCartelaVencedora(cartela, numerosSorteados)) {
                declararVencedor(jogo, cartela.getUsuario());
                return;
            }
        }
    }
    
    private boolean isCartelaVencedora(Cartela cartela, List<Integer> numerosSorteados) {
        Set<Integer> numerosCartela = cartela.getNumeros().stream()
            .map(NumeroCartela::getNumero)
            .collect(Collectors.toSet());
        
        return numerosSorteados.containsAll(numerosCartela);
    }
    
    @Transactional
    public void declararVencedor(Jogo jogo, Usuario vencedor) {
        jogo.setStatus("FINALIZADO");
        jogo.setUsuarioVencedor(vencedor);
        jogoRepository.save(jogo);
        
        // Notificar via WebSocket
        Map<String, Object> data = new HashMap<>();
        data.put("jogoId", jogo.getIdJogo());
        data.put("vencedor", new com.bingo.api.dto.UsuarioDTO(
            vencedor.getIdUsuario(), 
            vencedor.getNome(), 
            vencedor.getEmail(), 
            vencedor.getCreditos(), 
            vencedor.getIsAdmin()
        ));
        webSocketService.enviarMensagemSala(
            jogo.getSala().getIdSala(), 
            new com.bingo.api.dto.WebSocketMessage("FIM_DE_JOGO", data)
        );
    }
    
    public void finalizarJogo(Long idJogo) {
        Jogo jogo = jogoRepository.findById(idJogo)
            .orElseThrow(() -> new RuntimeException("Jogo não encontrado"));
        
        jogo.setStatus("FINALIZADO");
        jogoRepository.save(jogo);
    }
}