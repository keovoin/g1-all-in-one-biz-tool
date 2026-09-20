import { IQueryHandler } from '@nestjs/cqrs';
import { ITokenHasher } from '../../interfaces/jwt-service.interface';
import { ITokenReadRepository, ITokenWriteRepository } from '../../interfaces/token-repository.interface';
import { IValidatedToken } from '../../interfaces/token.interface';
import { TokenConfigRegistry } from '../../token-config.registry';
import { ValidateTokenQuery } from '../validate-token.query';
export declare class ValidateTokenHandler implements IQueryHandler<ValidateTokenQuery, IValidatedToken> {
    private readonly configRegistry;
    private readonly tokenReadRepository;
    private readonly tokenWriteRepository;
    private readonly tokenHasher;
    private readonly logger;
    constructor(configRegistry: TokenConfigRegistry, tokenReadRepository: ITokenReadRepository, tokenWriteRepository: ITokenWriteRepository, tokenHasher: ITokenHasher);
    execute(query: ValidateTokenQuery): Promise<IValidatedToken>;
    /**
     * Identifies which specific domain rule caused isUsable() to return false,
     * persists the appropriate status transition, and returns a typed failure.
     *
     * Keeping this in a helper preserves single-responsibility in execute() while
     * avoiding duplicated domain-method calls.
     */
    private handleUnusableToken;
    private getPayloadUserId;
}
