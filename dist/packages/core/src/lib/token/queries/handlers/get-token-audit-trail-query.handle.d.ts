import { IQueryHandler } from '@nestjs/cqrs';
import { ITokenReadRepository } from '../../interfaces/token-repository.interface';
import { IToken } from '../../interfaces/token.interface';
import { GetTokenAuditTrailQuery } from '../get-token-audit-trail.query';
export declare class GetTokenAuditTrailHandler implements IQueryHandler<GetTokenAuditTrailQuery, IToken[]> {
    private readonly tokenRepository;
    constructor(tokenRepository: ITokenReadRepository);
    execute(query: GetTokenAuditTrailQuery): Promise<IToken[]>;
}
