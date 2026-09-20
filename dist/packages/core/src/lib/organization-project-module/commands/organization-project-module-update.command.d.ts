import { ICommand } from '@nestjs/cqrs';
import { ID, IOrganizationProjectModuleUpdateInput } from '@gauzy/contracts';
export declare class OrganizationProjectModuleUpdateCommand implements ICommand {
    readonly id: ID;
    readonly input: IOrganizationProjectModuleUpdateInput;
    static readonly type = "[OrganizationProjectModule] Update Module";
    constructor(id: ID, input: IOrganizationProjectModuleUpdateInput);
}
