import { ICommand } from '@nestjs/cqrs';
import { ID } from '@gauzy/contracts';
export declare class UserOrganizationDeleteCommand implements ICommand {
    readonly userOrganizationId: ID;
    static readonly type = "[UserOrganization] Delete";
    constructor(userOrganizationId: ID);
}
