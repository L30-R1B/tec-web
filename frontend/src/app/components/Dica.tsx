'use client';
import React from 'react';

interface DicaItem {
  titulo: string;
  descricao: string;
}

const DicaCard: React.FC<DicaItem> = ({ titulo, descricao }) => (
  <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
    <div>
      <p style={{ fontWeight: 'bold', display: 'block', margin: 0, color: '#a09e1dff' }}>{titulo}</p>
      <p style={{ fontSize: '0.9em', color: '#a09e1dff', marginTop: '3px' }}>{descricao}</p>
    </div>
  </div>
);

const DicasLateral: React.FC = () => { 
  const dicas = [
    { titulo: 'Quanto mais cartelas comprar, mais chance de ganhar!', descricao: 'Analise o jogo e maximize suas chances.' },
    { titulo: 'Clique rápido no botão bingo para não perder!', descricao: 'A agilidade é a chave para a vitória.' },
    { titulo: 'Pagamento fácil e seguro', descricao: 'Todas as transações são protegidas por criptografia.' },
  ];

  return (
    <div style={{ backgroundColor: '#f8f8baff', padding: '20px', borderRadius: '8px', maxWidth: '320px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', border: '1px solid #CCC' }}>
      {dicas.map((d, i) => <DicaCard key={i} titulo={d.titulo} descricao={d.descricao} />)}
    </div>
  );
};

export default DicasLateral;
