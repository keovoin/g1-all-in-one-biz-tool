import { ICommand } from '@nestjs/cqrs';
import { ITenant } from '@gauzy/contracts';
export declare class TenantRelatedIssueTypeBulkCreateCommand implements ICommand {
    readonly tenants: ITenant[];
    static readonly type = "[Tenant RelatedIssueType] Bulk Create";
    constructor(tenants: ITenant[]);
}
