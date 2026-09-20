import { ICommand } from '@nestjs/cqrs';
import { ID, IOrganizationProjectUpdateInput } from '@gauzy/contracts';
export declare class OrganizationProjectUpdateCommand implements ICommand {
    readonly id: ID;
    readonly input: IOrganizationProjectUpdateInput;
    static readonly type = "[Organization Project] Update";
    constructor(id: ID, input: IOrganizationProjectUpdateInput);
}
