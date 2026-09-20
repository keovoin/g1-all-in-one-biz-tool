import { ICommandHandler } from '@nestjs/cqrs';
import { ITokenMaintenanceRepository } from '../../interfaces/token-repository.interface';
import { CleanupExpiredTokensCommand } from '../cleanup-expired-tokens.command';
export declare class CleanupExpiredTokensHandler implements ICommandHandler<CleanupExpiredTokensCommand, number> {
    private readonly tokenRepository;
    constructor(tokenRepository: ITokenMaintenanceRepository);
    execute(command: CleanupExpiredTokensCommand): Promise<number>;
}
