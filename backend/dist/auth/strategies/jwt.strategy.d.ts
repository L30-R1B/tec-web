import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
type JwtPayload = {
    sub: number;
    email: string;
    isAdmin: boolean;
};
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor(configService: ConfigService);
    validate(payload: JwtPayload): Promise<{
        sub: number;
        email: string;
        isAdmin: boolean;
    }>;
}
export {};
