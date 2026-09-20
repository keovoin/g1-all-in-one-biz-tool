import { IQuery } from '@nestjs/cqrs';
import { ID } from '@gauzy/contracts';
export declare class GetDocumentSettingsQuery implements IQuery {
    readonly organizationId: ID;
    static readonly type = "[Document Settings] Get";
    constructor(organizationId: ID);
}
