import { IPasswordHashStrategy } from '../interfaces';
/**
 * Bcrypt password hashing strategy (legacy, for backward compatibility).
 */
export declare class BcryptHashStrategy implements IPasswordHashStrategy {
    private readonly BCRYPT_PREFIXES;
    private readonly saltRounds;
    constructor();
    hash(password: string): Promise<string>;
    verify(password: string, hashedPassword: string): Promise<boolean>;
    getAlgorithmIdentifier(): string;
    canVerify(hashedPassword: string): boolean;
}
