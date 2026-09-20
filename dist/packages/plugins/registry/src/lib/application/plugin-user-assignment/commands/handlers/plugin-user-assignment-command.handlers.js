"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkAssignUsersToPluginsCommandHandler = exports.UnassignUsersFromPluginCommandHandler = exports.AssignUsersToPluginCommandHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const plugin_user_assignment_service_1 = require("../../../../domain/services/plugin-user-assignment.service");
const plugin_user_assignment_commands_1 = require("../../commands/plugin-user-assignment.commands");
/**
 * Handler for assigning users to a plugin
 */
let AssignUsersToPluginCommandHandler = class AssignUsersToPluginCommandHandler {
    constructor(userAssignmentService) {
        this.userAssignmentService = userAssignmentService;
    }
    async execute(command) {
        const { pluginId, userIds, reason } = command;
        const assignments = await this.userAssignmentService.assignUsersToPlugin(pluginId, userIds, reason);
        return {
            message: `Successfully assigned ${assignments.length} user(s) to plugin`,
            assignments
        };
    }
};
exports.AssignUsersToPluginCommandHandler = AssignUsersToPluginCommandHandler;
exports.AssignUsersToPluginCommandHandler = AssignUsersToPluginCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(plugin_user_assignment_commands_1.AssignUsersToPluginCommand),
    tslib_1.__metadata("design:paramtypes", [plugin_user_assignment_service_1.PluginUserAssignmentService])
], AssignUsersToPluginCommandHandler);
/**
 * Handler for unassigning users from a plugin
 */
let UnassignUsersFromPluginCommandHandler = class UnassignUsersFromPluginCommandHandler {
    constructor(userAssignmentService) {
        this.userAssignmentService = userAssignmentService;
    }
    async execute(command) {
        const { pluginId, userIds, reason } = command;
        // TODO: Implement proper logic with plugin installation service
        const revocations = await this.userAssignmentService.unassignUsersFromPlugin(pluginId, userIds, reason);
        return {
            message: `Successfully unassigned ${revocations.length} user(s) from plugin`,
            revocations
        };
    }
};
exports.UnassignUsersFromPluginCommandHandler = UnassignUsersFromPluginCommandHandler;
exports.UnassignUsersFromPluginCommandHandler = UnassignUsersFromPluginCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(plugin_user_assignment_commands_1.UnassignUsersFromPluginCommand),
    tslib_1.__metadata("design:paramtypes", [plugin_user_assignment_service_1.PluginUserAssignmentService])
], UnassignUsersFromPluginCommandHandler);
/**
 * Handler for bulk assigning users to multiple plugins
 */
let BulkAssignUsersToPluginsCommandHandler = class BulkAssignUsersToPluginsCommandHandler {
    constructor(userAssignmentService) {
        this.userAssignmentService = userAssignmentService;
    }
    async execute(command) {
        const { pluginIds, userIds, reason } = command;
        const results = [];
        for (const pluginId of pluginIds) {
            const assignments = await this.userAssignmentService.assignUsersToPlugin(pluginId, userIds, reason);
            results.push({
                pluginId,
                assignments
            });
        }
        return {
            message: `Successfully assigned users to ${pluginIds.length} plugin(s)`,
            results
        };
    }
};
exports.BulkAssignUsersToPluginsCommandHandler = BulkAssignUsersToPluginsCommandHandler;
exports.BulkAssignUsersToPluginsCommandHandler = BulkAssignUsersToPluginsCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(plugin_user_assignment_commands_1.BulkAssignUsersToPluginsCommand),
    tslib_1.__metadata("design:paramtypes", [plugin_user_assignment_service_1.PluginUserAssignmentService])
], BulkAssignUsersToPluginsCommandHandler);
//# sourceMappingURL=plugin-user-assignment-command.handlers.js.map