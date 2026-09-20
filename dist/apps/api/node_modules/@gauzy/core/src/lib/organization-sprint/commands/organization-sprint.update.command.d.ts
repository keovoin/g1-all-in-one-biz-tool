import { IOrganizationSprintUpdateInput } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class OrganizationSprintUpdateCommand implements ICommand {
    readonly id: string;
    readonly input: IOrganizationSprintUpdateInput;
    static readonly type = "[OrganizationSprint] Update";
    constructor(id: string, input: IOrganizationSprintUpdateInput);
}
