import { ICommand } from '@nestjs/cqrs';
import { IOrganizationProjectModuleCreateInput } from '@gauzy/contracts';
export declare class OrganizationProjectModuleCreateCommand implements ICommand {
    readonly input: IOrganizationProjectModuleCreateInput;
    static readonly type = "[OrganizationProjectModule] Create Module";
    constructor(input: IOrganizationProjectModuleCreateInput);
}
