import { ICommand } from '@nestjs/cqrs';
import { IOrganizationProjectEditByEmployeeInput } from '@gauzy/contracts';
export declare class OrganizationProjectEditByEmployeeCommand implements ICommand {
    readonly input: IOrganizationProjectEditByEmployeeInput;
    static readonly type = "[OrganizationProject] Edit By Employee";
    constructor(input: IOrganizationProjectEditByEmployeeInput);
}
