import { IQueryHandler } from '@nestjs/cqrs';
import { ITokenReadRepository } from '../../interfaces/token-repository.interface';
import { IToken } from '../../interfaces/token.interface';
import { GetTokenByIdQuery } from '../get-token-by-id.query';
export declare class GetTokenByIdHandler implements IQueryHandler<GetTokenByIdQuery, IToken> {
    private readonly tokenRepository;
    constructor(tokenRepository: ITokenReadRepository);
    execute(query: GetTokenByIdQuery): Promise<IToken>;
}
