import { ICommand } from '@nestjs/cqrs';
import { IFeatureOrganizationUpdateInput } from '@gauzy/contracts';
export declare class FeatureToggleUpdateCommand implements ICommand {
    readonly input: IFeatureOrganizationUpdateInput;
    static readonly type = "[Feature] Toggle Update";
    constructor(input: IFeatureOrganizationUpdateInput);
}
