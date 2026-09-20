import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class ValidatePluginLicenseCommand implements ICommand {
    readonly pluginId: ID;
    readonly licenseKey?: string;
    readonly tenantId?: ID;
    readonly organizationId?: ID;
    readonly userId?: ID;
    static readonly type = "[Plugin License] Validate";
    constructor(pluginId: ID, licenseKey?: string, tenantId?: ID, organizationId?: ID, userId?: ID);
}
