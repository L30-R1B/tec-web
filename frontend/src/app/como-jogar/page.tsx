'use client';
import React from 'react';
import DicasLateral from '../components/Dica';

const Regras = [
  { numero: 1, titulo: 'Escolha uma sala', descricao: 'Selecione a sala com o prêmio que você quer disputar.' },
  { numero: 2, titulo: 'Compre suas cartelas', descricao: 'Escolha pacotes prontos ou monte sua própria cartela.' },
  { numero: 3, titulo: 'Acompanhe o sorteio', descricao: 'As bolas vão sendo sorteadas em tempo real.' },
  { numero: 4, titulo: 'Marque sua cartela', descricao: 'Seus números são destacados automaticamente.' },
  { numero: 5, titulo: 'Grite BINGO! 🎉', descricao: 'Ao completar a cartela, clique no botão \"BINGO!\".' },
];

export default function InstrucoesBingo() {
  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', backgroundColor: 'white' }}>
      <h1 style={{ color: 'green' }}>Como jogar nosso bingo online?</h1>
      <p style={{ color: 'green', fontWeight: 'bold', fontSize:'1.2em' }}>Em poucos passos você pode se divertir e concorrer a prêmios!</p>
      <div style={{ display: 'flex', gap: '50px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          {Regras.map(r => (
            <div key={r.numero} style={{ marginBottom: '10px' }}>
              <p style={{ fontWeight: 'bold', fontSize: '1.2em', color: '#006400' }}>{r.numero} - {r.titulo}</p>
              <p style={{ color: 'green' }}>{r.descricao}</p>
            </div>
          ))}
        </div>
        <div style={{ flexShrink: 0, minWidth: '300px' }}>
          <DicasLateral />
        </div>
      </div>
    </div>
  );
}
