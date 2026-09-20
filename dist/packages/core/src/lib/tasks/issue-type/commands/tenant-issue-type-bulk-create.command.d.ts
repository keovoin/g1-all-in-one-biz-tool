import { ICommand } from '@nestjs/cqrs';
import { ITenant } from '@gauzy/contracts';
export declare class TenantIssueTypeBulkCreateCommand implements ICommand {
    readonly tenants: ITenant[];
    static readonly type = "[Tenant] Issue Type Bulk Create";
    constructor(tenants: ITenant[]);
}
