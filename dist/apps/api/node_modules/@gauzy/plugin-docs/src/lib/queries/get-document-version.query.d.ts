import { IQuery } from '@nestjs/cqrs';
import { ID } from '@gauzy/contracts';
export declare class GetDocumentVersionQuery implements IQuery {
    readonly id: ID;
    readonly versionId: ID;
    static readonly type = "[Document Versions] Get One";
    constructor(id: ID, versionId: ID);
}
