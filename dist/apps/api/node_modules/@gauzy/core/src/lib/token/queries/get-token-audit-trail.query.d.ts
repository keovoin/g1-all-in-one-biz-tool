import { IQuery } from '@nestjs/cqrs';
export declare class GetTokenAuditTrailQuery implements IQuery {
    readonly tokenId: string;
    constructor(tokenId: string);
}
