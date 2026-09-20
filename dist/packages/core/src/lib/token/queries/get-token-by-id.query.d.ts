import { IQuery } from '@nestjs/cqrs';
export declare class GetTokenByIdQuery implements IQuery {
    readonly tokenId: string;
    constructor(tokenId: string);
}
