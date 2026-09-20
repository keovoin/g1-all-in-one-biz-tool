import { IQuery } from '@nestjs/cqrs';
import { PluginPlanAnalyticsDTO } from '../../../shared';
export declare class GetPluginPlanAnalyticsQuery implements IQuery {
    readonly analyticsDto: PluginPlanAnalyticsDTO;
    static readonly type = "[Plugin Subscription Plan] Get Analytics";
    constructor(analyticsDto: PluginPlanAnalyticsDTO);
}
