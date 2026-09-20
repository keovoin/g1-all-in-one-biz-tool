import { IPasswordHashStrategy } from '../interfaces';
export declare class ScryptHashStrategy implements IPasswordHashStrategy {
    private readonly ALGORITHM_PREFIX;
    hash(password: string): Promise<string>;
    verify(password: string, hashedPassword: string): Promise<boolean>;
    getAlgorithmIdentifier(): string;
    canVerify(hashedPassword: string): boolean;
}
