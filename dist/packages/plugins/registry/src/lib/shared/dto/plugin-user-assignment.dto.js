"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginUserAccessResponseDTO = exports.CheckPluginUserAccessDTO = exports.UnassignPluginUsersDTO = exports.AssignPluginUsersDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
/**
 * DTO for assigning users to a plugin
 */
class AssignPluginUsersDTO {
}
exports.AssignPluginUsersDTO = AssignPluginUsersDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], description: 'Array of user IDs to assign to the plugin' }),
    (0, class_validator_1.IsArray)({ message: 'userIds must be an array' }),
    (0, class_validator_1.IsUUID)('4', { each: true, message: 'Each userId must be a valid UUID' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'At least one user ID is required' }),
    tslib_1.__metadata("design:type", Array)
], AssignPluginUsersDTO.prototype, "userIds", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Optional reason for the assignment' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Reason must be a string' }),
    tslib_1.__metadata("design:type", String)
], AssignPluginUsersDTO.prototype, "reason", void 0);
/**
 * DTO for unassigning users from a plugin
 */
class UnassignPluginUsersDTO {
}
exports.UnassignPluginUsersDTO = UnassignPluginUsersDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], description: 'Array of user IDs to unassign from the plugin' }),
    (0, class_validator_1.IsArray)({ message: 'userIds must be an array' }),
    (0, class_validator_1.IsUUID)('4', { each: true, message: 'Each userId must be a valid UUID' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'At least one user ID is required' }),
    tslib_1.__metadata("design:type", Array)
], UnassignPluginUsersDTO.prototype, "userIds", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Optional reason for the unassignment' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Reason must be a string' }),
    tslib_1.__metadata("design:type", String)
], UnassignPluginUsersDTO.prototype, "reason", void 0);
/**
 * DTO for checking plugin user access
 */
class CheckPluginUserAccessDTO {
}
exports.CheckPluginUserAccessDTO = CheckPluginUserAccessDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Plugin ID to check access for' }),
    (0, class_validator_1.IsUUID)('4', { message: 'Plugin ID must be a valid UUID' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Plugin ID is required' }),
    tslib_1.__metadata("design:type", String)
], CheckPluginUserAccessDTO.prototype, "pluginId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'User ID to check access for' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'User ID must be a valid UUID' }),
    tslib_1.__metadata("design:type", String)
], CheckPluginUserAccessDTO.prototype, "userId", void 0);
/**
 * Response DTO for plugin user access check
 */
class PluginUserAccessResponseDTO {
}
exports.PluginUserAccessResponseDTO = PluginUserAccessResponseDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, description: 'Whether the user has access to the plugin' }),
    tslib_1.__metadata("design:type", Boolean)
], PluginUserAccessResponseDTO.prototype, "hasAccess", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Access level', required: false }),
    tslib_1.__metadata("design:type", String)
], PluginUserAccessResponseDTO.prototype, "accessLevel", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Object, description: 'Assignment details if available' }),
    tslib_1.__metadata("design:type", Object)
], PluginUserAccessResponseDTO.prototype, "assignment", void 0);
//# sourceMappingURL=plugin-user-assignment.dto.js.map