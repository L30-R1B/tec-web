// path: src/bingo-engine/realtime/realtime.gateway.ts
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: '*' }, // Em produção, restrinja para o domínio do seu frontend
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  
  private logger = new Logger('RealtimeGateway');

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('joinGameRoom')
  handleJoinGame(
    @MessageBody() gameId: number,
    @ConnectedSocket() client: Socket,
  ) {
    const roomName = `game-${gameId}`;
    client.join(roomName);
    this.logger.log(`Cliente ${client.id} entrou na sala ${roomName}`);
    client.emit('joinedGame', `Você está acompanhando o jogo ${gameId}`);
  }

  @SubscribeMessage('leaveGameRoom')
  handleLeaveGame(
    @MessageBody() gameId: number,
    @ConnectedSocket() client: Socket,
  ) {
    const roomName = `game-${gameId}`;
    client.leave(roomName);
    this.logger.log(`Cliente ${client.id} saiu da sala ${roomName}`);
  }

  // Envia o número sorteado para todos na sala do jogo
  broadcastNumber(gameId: number, number: number, order: number) {
    const roomName = `game-${gameId}`;
    this.server.to(roomName).emit('numberDrawn', { number, order });
  }

  // Anuncia o vencedor e finaliza a sala
  broadcastWinner(gameId: number, winnerInfo: any) {
    const roomName = `game-${gameId}`;
    this.server.to(roomName).emit('gameWinner', winnerInfo);
    this.server.in(roomName).socketsLeave(roomName); // Desconecta todos da sala
  }
  
  // Anuncia o fim do jogo sem vencedores
  broadcastEnd(gameId: number, message: string) {
    const roomName = `game-${gameId}`;
    this.server.to(roomName).emit('gameEnded', { message });
    this.server.in(roomName).socketsLeave(roomName); // Desconecta todos da sala
  }
}

