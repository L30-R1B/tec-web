// path: src/auth/interfaces/authenticated-request.interface.ts
import { FastifyRequest } from 'fastify';

export interface AuthenticatedRequest extends FastifyRequest {
  user: {
    sub: number;
    email: string;
    isAdmin: boolean;
  };
}
