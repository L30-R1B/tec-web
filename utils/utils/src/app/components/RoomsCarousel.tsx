// src/app/components/RoomsCarousel.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { api, Room } from '@/services/api';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './RoomsCarousel.css';

export default function RoomsCarousel() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const data = await api.getAllRooms();
      setRooms(data);
    } catch (err) {
      setError('Erro ao carregar salas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: 'var(--primary-green)', fontSize: '20px' }}>
          Carregando salas...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: '#dc2626', fontSize: '20px' }}>{error}</p>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: 'var(--primary-green)', fontSize: '20px' }}>
          Nenhuma sala disponível no momento
        </p>
      </div>
    );
  }

  return (
    <div className="rooms-carousel-container">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        className="rooms-swiper"
      >
        {rooms.map((room) => (
          <SwiperSlide key={room.id}>
            <div className="room-card">
              <div className="room-header">
                <h3 className="room-name">{room.nome}</h3>
                <span className="room-theme">Sala #{room.id}</span>
              </div>

              <div className="room-info">
                <div className="players-count">
                  <p style={{ margin: 0 }}>{room.descricao}</p>
                </div>
              </div>

              <button className="enter-room-button">
                Entrar na Sala
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}