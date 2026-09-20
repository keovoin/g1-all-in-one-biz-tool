/**
 * Interface for password hashing strategies (Strategy Pattern).
 */
export interface IPasswordHashStrategy {
    hash(password: string): Promise<string>;
    verify(password: string, hashedPassword: string): Promise<boolean>;
    getAlgorithmIdentifier(): string;
    canVerify(hashedPassword: string): boolean;
}
export declare const PASSWORD_HASH_STRATEGIES: unique symbol;
export declare const DEFAULT_PASSWORD_HASH_STRATEGY: unique symbol;
