import { ICommandHandler } from '@nestjs/cqrs';
import { ITokenHasher } from '../../interfaces/jwt-service.interface';
import { ITokenWriteRepository } from '../../interfaces/token-repository.interface';
import { IGeneratedToken } from '../../interfaces/token.interface';
import { TokenConfigRegistry } from '../../token-config.registry';
import { RotateTokenCommand } from '../rotate-token.command';
export declare class RotateTokenHandler implements ICommandHandler<RotateTokenCommand, IGeneratedToken> {
    private readonly tokenRepository;
    private readonly configRegistry;
    private readonly tokenHasher;
    constructor(tokenRepository: ITokenWriteRepository, configRegistry: TokenConfigRegistry, tokenHasher: ITokenHasher);
    execute(command: RotateTokenCommand): Promise<IGeneratedToken>;
}
