import { IQueryHandler } from '@nestjs/cqrs';
import { ITokenReadRepository } from '../../interfaces/token-repository.interface';
import { ITokenQueryResult } from '../../interfaces/token.interface';
import { GetTokensQuery } from '../get-tokens.query';
export declare class GetTokensHandler implements IQueryHandler<GetTokensQuery, ITokenQueryResult> {
    private readonly tokenRepository;
    constructor(tokenRepository: ITokenReadRepository);
    execute(query: GetTokensQuery): Promise<ITokenQueryResult>;
}
