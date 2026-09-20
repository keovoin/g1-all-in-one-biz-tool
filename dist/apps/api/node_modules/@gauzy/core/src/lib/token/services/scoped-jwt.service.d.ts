import { JwtService } from '@nestjs/jwt';
import { IJwtService, ITokenPayload } from '../interfaces';
/**
 * Scoped JWT Service
 * Allows each token type to have its own JWT secret
 */
export declare class ScopedJwtService implements IJwtService {
    private readonly secret;
    private readonly tokenType;
    private readonly jwtService;
    constructor(secret: string, tokenType: string, jwtService: JwtService);
    sign(payload: ITokenPayload, expiresIn?: number): Promise<string>;
    verify(token: string): Promise<ITokenPayload>;
    decode(token: string): ITokenPayload | null;
}
