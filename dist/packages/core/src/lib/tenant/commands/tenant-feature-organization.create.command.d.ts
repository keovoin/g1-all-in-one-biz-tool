import { ICommand } from '@nestjs/cqrs';
import { ITenant } from '@gauzy/contracts';
export declare class TenantFeatureOrganizationCreateCommand implements ICommand {
    readonly input: ITenant[];
    static readonly type = "[Tenant] Feature Organization Create";
    constructor(input: ITenant[]);
}
