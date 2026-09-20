import { ICommand } from '@nestjs/cqrs';
import { IOrganizationSprintCreateInput } from '@gauzy/contracts';
export declare class OrganizationSprintCreateCommand implements ICommand {
    readonly input: IOrganizationSprintCreateInput;
    static readonly type = "[OrganizationSprint] Create";
    constructor(input: IOrganizationSprintCreateInput);
}
