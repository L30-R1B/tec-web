import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private logger;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinGame(gameId: number, client: Socket): void;
    handleLeaveGame(gameId: number, client: Socket): void;
    broadcastNumber(gameId: number, number: number, order: number): void;
    broadcastWinner(gameId: number, winnerInfo: any): void;
    broadcastEnd(gameId: number, message: string): void;
}
