import { ID, PluginStatus, PluginType } from '@gauzy/contracts';
import { IPluginVersionUpdate } from '../models/plugin-version.model';
import { CreatePluginDTO } from './create-plugin.dto';
import { CreatePluginSubscriptionPlanDTO, UpdatePluginSubscriptionPlanDTO } from './plugin-subscription-plan.dto';
declare const UpdatePluginDTO_base: import("@nestjs/common").Type<Partial<Omit<CreatePluginDTO, "version" | "subscriptionPlans">>>;
export declare class UpdatePluginDTO extends UpdatePluginDTO_base {
    readonly id: ID;
    name?: string;
    description?: string;
    type?: PluginType;
    status?: PluginStatus;
    isActive?: boolean;
    repository?: string;
    author?: string;
    license?: string;
    homepage?: string;
    requiresSubscription?: boolean;
    readonly version?: IPluginVersionUpdate;
    subscriptionPlans?: Array<UpdatePluginSubscriptionPlanDTO | CreatePluginSubscriptionPlanDTO>;
}
export {};
