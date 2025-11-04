import { FastifyRequest } from 'fastify';
export interface AuthenticatedRequest extends FastifyRequest {
    user: {
        sub: number;
        email: string;
        isAdmin: boolean;
    };
}
