'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './RoomsCarousel.css';

interface Room {
  id: number;
  name: string;
  players: number;
  maxPlayers: number;
  theme: string;
  prize: string;
}

const mockRooms: Room[] = [
  {
    id: 1,
    name: "Sala Rápida",
    players: 8,
    maxPlayers: 12,
    theme: "Clássico",
    prize: "R$ 50,00"
  },
  {
    id: 2,
    name: "Turbinada",
    players: 15,
    maxPlayers: 20,
    theme: "Turbo",
    prize: "R$ 100,00"
  },
  {
    id: 3,
    name: "Mega Prêmio",
    players: 25,
    maxPlayers: 30,
    theme: "Premium",
    prize: "R$ 250,00"
  },
  {
    id: 4,
    name: "Iniciantes",
    players: 5,
    maxPlayers: 10,
    theme: "Amigável",
    prize: "R$ 25,00"
  },
  {
    id: 5,
    name: "VIP",
    players: 18,
    maxPlayers: 25,
    theme: "Exclusiva",
    prize: "R$ 500,00"
  }
];

export default function RoomsCarousel() {
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
        {mockRooms.map((room) => (
          <SwiperSlide key={room.id}>
            <div className="room-card">
              <div className="room-header">
                <h3 className="room-name">{room.name}</h3>
                <span className="room-theme">{room.theme}</span>
              </div>

              <div className="room-info">
                <div className="players-count">
                  <span> {room.players}/{room.maxPlayers} jogadores</span>
                </div>
                <div className="prize">
                  <span> Prêmio: {room.prize}</span>
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