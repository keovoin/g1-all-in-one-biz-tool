import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ICreateTokenDto, IGeneratedToken, IRevokeTokenDto, IRotateTokenDto, IToken, ITokenFilters, ITokenQueryResult, IValidateTokenDto, IValidatedToken } from '../interfaces/token.interface';
/**
 * Token Service - Facade for CQRS operations
 * Implements Facade Pattern - provides simplified interface to complex CQRS subsystem
 */
export declare class TokenService {
    private readonly commandBus;
    private readonly queryBus;
    constructor(commandBus: CommandBus, queryBus: QueryBus);
    /**
     * Create a new token
     */
    createToken(dto: ICreateTokenDto): Promise<IGeneratedToken>;
    /**
     * Rotate an existing token
     */
    rotateToken(dto: IRotateTokenDto): Promise<IGeneratedToken>;
    /**
     * Revoke a token
     */
    revokeToken(dto: IRevokeTokenDto): Promise<void>;
    /**
     * Revoke all tokens for a user by type
     */
    revokeAllUserTokens(userId: string, tokenType: string, revokedBy?: string, reason?: string): Promise<number>;
    /**
     * Validate a token
     */
    validateToken(dto: IValidateTokenDto): Promise<IValidatedToken>;
    /**
     * Get token by ID
     */
    getTokenById(tokenId: string): Promise<IToken>;
    /**
     * Get active tokens for a user by type
     */
    getActiveTokens(userId: string, tokenType: string): Promise<IToken[]>;
    /**
     * Query tokens with filters
     */
    queryTokens(filters: ITokenFilters, limit?: number, offset?: number): Promise<ITokenQueryResult>;
    /**
     * Get audit trail for a token (rotation history)
     */
    getTokenAuditTrail(tokenId: string): Promise<IToken[]>;
}
