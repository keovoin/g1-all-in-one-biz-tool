import { IPluginSubscription } from '@gauzy/contracts';
import { IQueryHandler } from '@nestjs/cqrs';
import { PluginSubscriptionAccessService } from '../../../../domain';
import { CheckPluginAccessQuery } from '../check-plugin-access.query';
export declare class CheckPluginAccessQueryHandler implements IQueryHandler<CheckPluginAccessQuery> {
    private readonly pluginSubscriptionAccessService;
    constructor(pluginSubscriptionAccessService: PluginSubscriptionAccessService);
    execute(query: CheckPluginAccessQuery): Promise<{
        hasAccess: boolean;
        subscription?: IPluginSubscription;
    }>;
}
