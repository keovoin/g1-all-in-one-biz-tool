import { ICommand } from '@nestjs/cqrs';
import { ID, IIntegrationTenantFindInput } from '@gauzy/contracts';
export declare class IntegrationTenantDeleteCommand implements ICommand {
    readonly id: ID;
    readonly options: IIntegrationTenantFindInput;
    static readonly type = "[Integration] Delete Integration";
    constructor(id: ID, options: IIntegrationTenantFindInput);
}
