'use client';
import React, { useEffect, useState } from 'react';

interface Room {
  id: number;
  nome?: string;
  premio?: string;
  jogadores?: number;
}

export default function TelaJogoBingo() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Room | null>(null);
  const API_BASE = typeof window !== 'undefined' ? (window.location.hostname === 'localhost' ? 'http://localhost:3333' : 'http://100.124.95.109:3333') : 'http://localhost:3333';

  useEffect(() => {
    async function loadRooms(){
      try{
        const res = await fetch(`${API_BASE}/rooms`);
        if(!res.ok) throw new Error('Erro ao buscar salas');
        const data = await res.json();
        setRooms(data);
        if(data && data.length) setSelected({
          id: data[0].id || data[0].id_sala || data[0].id,
          nome: data[0].nome || data[0].title || 'Sala',
          premio: data[0].prize || 'R$ 0,00',
          jogadores: data[0].players_count || 0
        });
      }catch(e){
        console.error(e);
      }finally{
        setLoading(false);
      }
    }
    loadRooms();
  }, []);

  if(loading) return <div style={{padding:20}}>Carregando...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#FFFFEA' }}>
      <div style={{ padding: '20px 40px', backgroundColor: '#E6FFCA', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <a href="/como-jogar" style={{ color: '#006400', textDecoration: 'none' }}>&#x2190; Voltar</a>
          <div><strong>{selected?.nome}</strong></div>
        </div>
        <div style={{ color:'#FF4500' }}>Prêmio: {selected?.premio}</div>
        <div>Jogadores: {selected?.jogadores}</div>
      </div>

      <div style={{ padding: '20px 40px', borderBottom: '1px solid #ccc' }}>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
          <div style={{ backgroundColor: '#90EE90', padding: '10px 20px', borderRadius: '50px', fontWeight: 'bold', color: '#006400' }}>Última bola: --</div>
        </div>
        <div style={{ backgroundColor: '#F0FFF0', padding: '10px 15px', borderRadius: '5px', color:'#555' }}>Bolas sorteadas: --</div>
      </div>

      <div style={{ padding: '20px 40px', flexGrow: 1 }}>
        <h3 style={{ color: '#006400', marginBottom: '20px' }}>Suas cartelas</h3>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          {/* Cartelas dummy (integração para compra de cartelas pode ser adicionada usando /games/:id/buy-cards) */}
          {[101,102,103,104,105].map(id => (
            <a key={id} href={`/cartela/${id}`} style={{ textDecoration: 'none' }}>
              <div style={{ width: '130px', height: '170px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 6px 12px rgba(0,0,0,0.15)', border: '2px solid #ccc', margin: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#006400', fontWeight:'bold' }}>Cartela #{id}</div>
            </a>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 40px', backgroundColor: '#E6FFCA', borderTop: '1px solid #ccc' }}>
        <div>Status: Rodada --</div>
        <div style={{ display: 'flex', gap: 20 }}>
          <button style={{ backgroundColor: '#FF4500', color: 'white', fontWeight: 'bold', padding: '15px 40px', border: 'none', borderRadius: '30px', cursor: 'pointer' }}>BINGO! 🏆</button>
          <a href="/" style={{ textDecoration: 'none' }}><button style={{ backgroundColor: '#4CAF50', color: 'white', fontWeight: 'bold', padding: '15px 40px', border: 'none', borderRadius: '30px', cursor: 'pointer' }}>Sair</button></a>
        </div>
      </div>
    </div>
  );
}
