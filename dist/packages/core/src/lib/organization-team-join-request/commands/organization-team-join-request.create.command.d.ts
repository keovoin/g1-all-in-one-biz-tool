import { ICommand } from '@nestjs/cqrs';
import { IAppIntegrationConfig } from '@gauzy/common';
import { IOrganizationTeamJoinRequestCreateInput, LanguagesEnum } from '@gauzy/contracts';
export declare class OrganizationTeamJoinRequestCreateCommand implements ICommand {
    readonly input: IOrganizationTeamJoinRequestCreateInput & Partial<IAppIntegrationConfig>;
    readonly languageCode: LanguagesEnum;
    static readonly type = "[Organization Team Join Request] Create";
    constructor(input: IOrganizationTeamJoinRequestCreateInput & Partial<IAppIntegrationConfig>, languageCode: LanguagesEnum);
}
