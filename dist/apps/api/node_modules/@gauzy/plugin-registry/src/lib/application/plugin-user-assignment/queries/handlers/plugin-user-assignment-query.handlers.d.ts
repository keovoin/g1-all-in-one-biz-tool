import { IPagination } from '@gauzy/contracts';
import { IQueryHandler } from '@nestjs/cqrs';
import { PluginTenantService, PluginUserAssignmentService } from '../../../../domain';
import { IPluginTenant } from '../../../../shared';
import { CheckUserPluginAccessQuery, GetAllPluginUserAssignmentsQuery, GetPluginUserAssignmentsQuery, GetUserPluginAssignmentsQuery } from '../../queries/plugin-user-assignment.queries';
/**
 * Handler for getting plugin user assignments
 */
export declare class GetPluginUserAssignmentsQueryHandler implements IQueryHandler<GetPluginUserAssignmentsQuery> {
    private readonly pluginTenantService;
    constructor(pluginTenantService: PluginTenantService);
    execute(query: GetPluginUserAssignmentsQuery): Promise<IPagination<IPluginTenant>>;
}
/**
 * Handler for getting user plugin assignments
 */
export declare class GetUserPluginAssignmentsQueryHandler implements IQueryHandler<GetUserPluginAssignmentsQuery> {
    private readonly userAssignmentService;
    private readonly pluginTenantService;
    constructor(userAssignmentService: PluginUserAssignmentService, pluginTenantService: PluginTenantService);
    execute(query: GetUserPluginAssignmentsQuery): Promise<IPagination<IPluginTenant>>;
}
/**
 * Handler for checking user plugin access
 */
export declare class CheckUserPluginAccessQueryHandler implements IQueryHandler<CheckUserPluginAccessQuery> {
    private readonly userAssignmentService;
    constructor(userAssignmentService: PluginUserAssignmentService);
    execute(query: CheckUserPluginAccessQuery): Promise<{
        hasAccess: boolean;
    }>;
}
/**
 * Handler for getting all plugin user assignments
 */
export declare class GetAllPluginUserAssignmentsQueryHandler implements IQueryHandler<GetAllPluginUserAssignmentsQuery> {
    private readonly pluginTenantService;
    constructor(pluginTenantService: PluginTenantService);
    execute(query: GetAllPluginUserAssignmentsQuery): Promise<IPagination<IPluginTenant>>;
}
