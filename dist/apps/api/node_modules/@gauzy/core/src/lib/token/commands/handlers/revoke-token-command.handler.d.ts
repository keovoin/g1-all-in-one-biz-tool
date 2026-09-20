import { ICommandHandler } from '@nestjs/cqrs';
import { ITokenHasher } from '../../interfaces/jwt-service.interface';
import { ITokenReadRepository, ITokenWriteRepository } from '../../interfaces/token-repository.interface';
import { RevokeTokenCommand } from '../revoke-token.command';
export declare class RevokeTokenHandler implements ICommandHandler<RevokeTokenCommand, void> {
    private readonly tokenReadRepository;
    private readonly tokenWriteRepository;
    private readonly tokenHasher;
    constructor(tokenReadRepository: ITokenReadRepository, tokenWriteRepository: ITokenWriteRepository, tokenHasher: ITokenHasher);
    execute(command: RevokeTokenCommand): Promise<void>;
}
