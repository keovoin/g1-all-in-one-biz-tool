import { IQuery } from '@nestjs/cqrs';
import { ID } from '@gauzy/contracts';
export declare class GetDocumentQuery implements IQuery {
    readonly id: ID;
    readonly relations: string[];
    /** Explicit organization scope; when omitted the service falls back to the request context. */
    readonly organizationId?: ID;
    static readonly type = "[Documents] Get One";
    constructor(id: ID, relations?: string[], 
    /** Explicit organization scope; when omitted the service falls back to the request context. */
    organizationId?: ID);
}
