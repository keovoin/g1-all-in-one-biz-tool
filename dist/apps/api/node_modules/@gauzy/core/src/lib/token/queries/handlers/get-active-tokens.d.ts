import { IQueryHandler } from '@nestjs/cqrs';
import { ITokenReadRepository } from '../../interfaces/token-repository.interface';
import { IToken } from '../../interfaces/token.interface';
import { GetActiveTokensQuery } from '../get-active-tokens';
export declare class GetActiveTokensHandler implements IQueryHandler<GetActiveTokensQuery, IToken[]> {
    private readonly tokenRepository;
    constructor(tokenRepository: ITokenReadRepository);
    execute(query: GetActiveTokensQuery): Promise<IToken[]>;
}
