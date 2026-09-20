import { ICommand } from '@nestjs/cqrs';
import { ID, IIntegrationTenantUpdateInput } from '@gauzy/contracts';
export declare class IntegrationTenantUpdateCommand implements ICommand {
    readonly id: ID;
    readonly input: IIntegrationTenantUpdateInput;
    static readonly type = "[Integration] Update Integration";
    constructor(id: ID, input: IIntegrationTenantUpdateInput);
}
