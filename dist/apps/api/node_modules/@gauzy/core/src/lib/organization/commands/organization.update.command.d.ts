import { ICommand } from '@nestjs/cqrs';
import { IOrganization, IOrganizationUpdateInput } from '@gauzy/contracts';
export declare class OrganizationUpdateCommand implements ICommand {
    readonly id: IOrganization['id'];
    readonly input: IOrganizationUpdateInput;
    static readonly type = "[Organization] Update";
    constructor(id: IOrganization['id'], input: IOrganizationUpdateInput);
}
