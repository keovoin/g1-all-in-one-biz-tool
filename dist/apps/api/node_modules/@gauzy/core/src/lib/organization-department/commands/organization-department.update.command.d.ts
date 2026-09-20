import { ID, IOrganizationDepartmentCreateInput } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class OrganizationDepartmentUpdateCommand implements ICommand {
    readonly id: ID;
    readonly input: IOrganizationDepartmentCreateInput;
    static readonly type = "[OrganizationDepartment] Update";
    constructor(id: ID, input: IOrganizationDepartmentCreateInput);
}
