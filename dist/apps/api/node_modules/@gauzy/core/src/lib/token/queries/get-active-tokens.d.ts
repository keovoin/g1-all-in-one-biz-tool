import { IQuery } from '@nestjs/cqrs';
export declare class GetActiveTokensQuery implements IQuery {
    readonly userId: string;
    readonly tokenType: string;
    constructor(userId: string, tokenType: string);
}
