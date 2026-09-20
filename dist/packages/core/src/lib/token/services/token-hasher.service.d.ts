import { ITokenHasher } from '../interfaces/jwt-service.interface';
export declare class TokenHasherService implements ITokenHasher {
    hashToken(token: string): string;
}
