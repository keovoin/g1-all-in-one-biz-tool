import { ICommand } from '@nestjs/cqrs';
import { ITenant } from '@gauzy/contracts';
export declare class TenantTaskSizeBulkCreateCommand implements ICommand {
    readonly tenants: ITenant[];
    static readonly type = "[Tenant] Task Size Bulk Create";
    constructor(tenants: ITenant[]);
}
