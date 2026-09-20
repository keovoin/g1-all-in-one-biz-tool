import { ICommand } from '@nestjs/cqrs';
import { ID, IOrganizationProjectSetting } from '@gauzy/contracts';
export declare class OrganizationProjectSettingUpdateCommand implements ICommand {
    readonly id: ID;
    readonly input: IOrganizationProjectSetting;
    static readonly type = "[Organization Project Setting] Update";
    constructor(id: ID, input: IOrganizationProjectSetting);
}
