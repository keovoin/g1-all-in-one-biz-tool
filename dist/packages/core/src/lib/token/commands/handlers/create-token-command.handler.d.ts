import { ICommandHandler } from '@nestjs/cqrs';
import { ITokenHasher } from '../../interfaces/jwt-service.interface';
import { ITokenWriteRepository } from '../../interfaces/token-repository.interface';
import { IGeneratedToken } from '../../interfaces/token.interface';
import { TokenConfigRegistry } from '../../token-config.registry';
import { CreateTokenCommand } from '../create-token.command';
export declare class CreateTokenHandler implements ICommandHandler<CreateTokenCommand, IGeneratedToken> {
    private readonly tokenWriteRepository;
    private readonly configRegistry;
    private readonly tokenHasher;
    private readonly logger;
    constructor(tokenWriteRepository: ITokenWriteRepository, configRegistry: TokenConfigRegistry, tokenHasher: ITokenHasher);
    execute(command: CreateTokenCommand): Promise<IGeneratedToken>;
}
