import { IQuery } from '@nestjs/cqrs';
import { ITokenFilters } from '../interfaces/token.interface';
export declare class GetTokensQuery implements IQuery {
    readonly filters: ITokenFilters;
    readonly limit?: number;
    readonly offset?: number;
    constructor(filters: ITokenFilters, limit?: number, offset?: number);
}
