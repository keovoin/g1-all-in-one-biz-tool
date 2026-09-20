import { ICommandHandler } from '@nestjs/cqrs';
import { ITokenWriteRepository } from '../../interfaces/token-repository.interface';
import { RevokeAllUserTokensCommand } from '../revoke-all-user-token.command';
export declare class RevokeAllUserTokensHandler implements ICommandHandler<RevokeAllUserTokensCommand, number> {
    private readonly tokenRepository;
    constructor(tokenRepository: ITokenWriteRepository);
    execute(command: RevokeAllUserTokensCommand): Promise<number>;
}
