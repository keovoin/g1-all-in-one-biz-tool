import { ICommandHandler } from '@nestjs/cqrs';
import { PluginUserAssignmentService } from '../../../../domain/services/plugin-user-assignment.service';
import { AssignUsersToPluginCommand, BulkAssignUsersToPluginsCommand, UnassignUsersFromPluginCommand } from '../../commands/plugin-user-assignment.commands';
/**
 * Handler for assigning users to a plugin
 */
export declare class AssignUsersToPluginCommandHandler implements ICommandHandler<AssignUsersToPluginCommand> {
    private readonly userAssignmentService;
    constructor(userAssignmentService: PluginUserAssignmentService);
    execute(command: AssignUsersToPluginCommand): Promise<any>;
}
/**
 * Handler for unassigning users from a plugin
 */
export declare class UnassignUsersFromPluginCommandHandler implements ICommandHandler<UnassignUsersFromPluginCommand> {
    private readonly userAssignmentService;
    constructor(userAssignmentService: PluginUserAssignmentService);
    execute(command: UnassignUsersFromPluginCommand): Promise<any>;
}
/**
 * Handler for bulk assigning users to multiple plugins
 */
export declare class BulkAssignUsersToPluginsCommandHandler implements ICommandHandler<BulkAssignUsersToPluginsCommand> {
    private readonly userAssignmentService;
    constructor(userAssignmentService: PluginUserAssignmentService);
    execute(command: BulkAssignUsersToPluginsCommand): Promise<any>;
}
