import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { PluginSubscriptionPlan } from '../../domain';
import { BulkPluginPlanOperationDTO, CopyPluginPlanDTO, CreateMultiplePluginPlansDTO, CreatePluginSubscriptionPlanDTO, PluginPlanAnalyticsDTO, PluginSubscriptionPlanQueryDTO, UpdatePluginSubscriptionPlanDTO } from '../../shared';
export declare class PluginSubscriptionPlanController {
    private readonly commandBus;
    private readonly queryBus;
    constructor(commandBus: CommandBus, queryBus: QueryBus);
    create(createDto: CreatePluginSubscriptionPlanDTO): Promise<PluginSubscriptionPlan>;
    createMultiple(createDto: CreateMultiplePluginPlansDTO): Promise<PluginSubscriptionPlan[]>;
    findAll(query: PluginSubscriptionPlanQueryDTO): Promise<PluginSubscriptionPlan[]>;
    getActivePlans(pluginId?: string, type?: string): Promise<PluginSubscriptionPlan[]>;
    getByPluginId(pluginId: string): Promise<PluginSubscriptionPlan[]>;
    findOne(id: string): Promise<PluginSubscriptionPlan>;
    update(id: string, updateDto: UpdatePluginSubscriptionPlanDTO): Promise<PluginSubscriptionPlan>;
    partialUpdate(id: string, updateDto: Partial<UpdatePluginSubscriptionPlanDTO>): Promise<PluginSubscriptionPlan>;
    delete(id: string): Promise<void>;
    copy(copyDto: CopyPluginPlanDTO): Promise<PluginSubscriptionPlan>;
    bulkOperation(operationDto: BulkPluginPlanOperationDTO): Promise<void>;
    getAnalytics(analyticsDto: PluginPlanAnalyticsDTO): Promise<{
        totalSubscriptions: number;
        activeSubscriptions: number;
        revenue: number;
        conversionRate: number;
    }>;
}
