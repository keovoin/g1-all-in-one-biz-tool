import { PluginStatus, PluginType } from '@gauzy/contracts';
import { CreatePluginSubscriptionPlanDTO } from './plugin-subscription-plan.dto';
import { PluginVersionDTO } from './plugin-version.dto';
export declare class CreatePluginDTO {
    name: string;
    description?: string;
    type: PluginType;
    status: PluginStatus;
    isActive?: boolean;
    categoryId?: string;
    author?: string;
    license?: string;
    homepage?: string;
    repository?: string;
    version: PluginVersionDTO;
    tags?: string[];
    requiresSubscription?: boolean;
    uploadedById?: string;
    subscriptionPlans?: Array<CreatePluginSubscriptionPlanDTO>;
}
