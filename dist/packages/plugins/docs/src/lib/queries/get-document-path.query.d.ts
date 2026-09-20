import { IQuery } from '@nestjs/cqrs';
import { ID } from '@gauzy/contracts';
export declare class GetDocumentPathQuery implements IQuery {
    readonly id: ID;
    static readonly type = "[Documents] Get Path";
    constructor(id: ID);
}
