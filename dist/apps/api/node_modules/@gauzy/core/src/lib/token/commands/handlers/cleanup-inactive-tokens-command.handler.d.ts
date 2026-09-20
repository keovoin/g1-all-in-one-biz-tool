import { ICommandHandler } from '@nestjs/cqrs';
import { ITokenMaintenanceRepository } from '../../interfaces/token-repository.interface';
import { CleanupInactiveTokensCommand } from '../cleanup-inactive-tokens.command';
export declare class CleanupInactiveTokensHandler implements ICommandHandler<CleanupInactiveTokensCommand, number> {
    private readonly tokenRepository;
    constructor(tokenRepository: ITokenMaintenanceRepository);
    execute(command: CleanupInactiveTokensCommand): Promise<number>;
}
