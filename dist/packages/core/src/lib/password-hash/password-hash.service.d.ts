import { IPasswordHashStrategy } from './interfaces';
/**
 * Password hashing service that orchestrates multiple hashing strategies.
 * Supports transparent migration from legacy algorithms (bcrypt) to modern ones (scrypt).
 */
export declare class PasswordHashService {
    private readonly defaultStrategy;
    private readonly strategies;
    private readonly logger;
    constructor(defaultStrategy: IPasswordHashStrategy, strategies: IPasswordHashStrategy[]);
    hash(password: string): Promise<string>;
    verify(password: string, hashedPassword: string): Promise<boolean>;
    needsRehash(hashedPassword: string): boolean;
    getDefaultAlgorithm(): string;
}
