import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { IGeneratedToken, IToken, IValidatedToken } from './interfaces';
import { ScopedTokenConfig } from './scoped-config.registry';
/**
 * Scoped Token Service
 * Automatically uses the token type from ScopedTokenConfig
 * User doesn't need to specify tokenType in every call
 */
export declare class ScopedTokenService {
    private readonly commandBus;
    private readonly queryBus;
    private readonly scopedConfig;
    constructor(commandBus: CommandBus, queryBus: QueryBus, scopedConfig: ScopedTokenConfig);
    /**
     * Get the token type this service is scoped to
     */
    get tokenType(): string;
    /**
     * Create a new token (tokenType automatically set)
     */
    createToken(dto: {
        userId: string;
        metadata?: Record<string, any>;
        expiresAt?: Date;
    }): Promise<IGeneratedToken>;
    /**
     * Rotate an existing token (tokenType automatically set)
     */
    rotateToken(dto: {
        rawOldToken: string;
        userId: string;
        metadata?: Record<string, any>;
    }): Promise<IGeneratedToken>;
    /**
     * Revoke a token
     */
    revokeToken(dto: {
        rawToken: string;
        revokedById?: string;
        reason?: string;
    }): Promise<void>;
    /**
     * Revoke all tokens for a user (tokenType automatically set)
     */
    revokeAllUserTokens(userId: string, revokedById?: string, reason?: string): Promise<number>;
    /**
     * Validate a token (tokenType automatically set)
     */
    validateToken(dto: {
        rawToken: string;
        checkInactivity?: boolean;
    }): Promise<IValidatedToken>;
    /**
     * Get active tokens for a user (tokenType automatically set)
     */
    getActiveTokens(userId: string): Promise<IToken[]>;
}
