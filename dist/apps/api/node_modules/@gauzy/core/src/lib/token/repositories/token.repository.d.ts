import { IUser } from '@gauzy/contracts';
import { CrudService } from '../../core/crud/crud.service';
import { Token } from '../entities/token.entity';
import { IToken, ITokenFilters, ITokenQueryResult, ITokenRepository, TokenStatus } from '../interfaces';
import { MikroOrmTokenRepository } from './micro-orm';
import { TypeOrmTokenRepository } from './type-orm';
export declare class TokenRepository extends CrudService<Token> implements ITokenRepository {
    readonly typeOrmTokenRepository: TypeOrmTokenRepository;
    readonly mikroOrmTokenRepository: MikroOrmTokenRepository;
    constructor(typeOrmTokenRepository: TypeOrmTokenRepository, mikroOrmTokenRepository: MikroOrmTokenRepository);
    findByHashWithLock(tokenHash: string): Promise<IToken | null>;
    findByHash(tokenHash: string): Promise<IToken | null>;
    findById(id: string): Promise<IToken | null>;
    findActiveByUserAndType(userId: string, tokenType: string): Promise<IToken[]>;
    create(tokenData: Partial<IToken>): Promise<IToken>;
    save(token: IToken): Promise<IToken>;
    updateStatus(tokenId: string, status: TokenStatus, version: number, additionalData?: Partial<IToken>): Promise<boolean>;
    updateLastUsed(tokenId: string): Promise<void>;
    revokeAllByUserAndType(userId: string, tokenType: string, revokedById?: IUser['id'], reason?: string): Promise<number>;
    revokeInactiveTokens(tokenType: string, inactivityThresholdMs: number): Promise<number>;
    markExpiredTokens(): Promise<number>;
    query(filters: ITokenFilters, limit?: number, offset?: number): Promise<ITokenQueryResult>;
    deleteOlderThan(date: Date, status?: TokenStatus[]): Promise<number>;
    transaction<T>(work: (repository: ITokenRepository) => Promise<T>): Promise<T>;
}
