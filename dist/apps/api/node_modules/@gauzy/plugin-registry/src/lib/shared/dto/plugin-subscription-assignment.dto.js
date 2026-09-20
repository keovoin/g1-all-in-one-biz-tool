"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginSubscriptionAccessResponseDTO = exports.CheckPluginSubscriptionAccessDTO = exports.RevokePluginSubscriptionAssignmentDTO = exports.AssignPluginSubscriptionDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
/**
 * DTO for assigning plugin subscription to users
 */
class AssignPluginSubscriptionDTO {
}
exports.AssignPluginSubscriptionDTO = AssignPluginSubscriptionDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], description: 'Array of user IDs to assign the plugin subscription to' }),
    (0, class_validator_1.IsArray)({ message: 'userIds must be an array' }),
    (0, class_validator_1.IsUUID)('4', { each: true, message: 'Each userId must be a valid UUID' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'At least one user ID is required' }),
    tslib_1.__metadata("design:type", Array)
], AssignPluginSubscriptionDTO.prototype, "userIds", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Optional reason for the assignment' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Reason must be a string' }),
    tslib_1.__metadata("design:type", String)
], AssignPluginSubscriptionDTO.prototype, "reason", void 0);
/**
 * DTO for revoking plugin subscription assignment from users
 */
class RevokePluginSubscriptionAssignmentDTO {
}
exports.RevokePluginSubscriptionAssignmentDTO = RevokePluginSubscriptionAssignmentDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], description: 'Array of user IDs to revoke plugin subscription from' }),
    (0, class_validator_1.IsArray)({ message: 'userIds must be an array' }),
    (0, class_validator_1.IsUUID)('4', { each: true, message: 'Each userId must be a valid UUID' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'At least one user ID is required' }),
    tslib_1.__metadata("design:type", Array)
], RevokePluginSubscriptionAssignmentDTO.prototype, "userIds", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Optional reason for the revocation' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Revocation reason must be a string' }),
    tslib_1.__metadata("design:type", String)
], RevokePluginSubscriptionAssignmentDTO.prototype, "revocationReason", void 0);
/**
 * DTO for checking plugin subscription access
 */
class CheckPluginSubscriptionAccessDTO {
}
exports.CheckPluginSubscriptionAccessDTO = CheckPluginSubscriptionAccessDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Plugin ID to check access for' }),
    (0, class_validator_1.IsUUID)('4', { message: 'Plugin ID must be a valid UUID' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Plugin ID is required' }),
    tslib_1.__metadata("design:type", String)
], CheckPluginSubscriptionAccessDTO.prototype, "pluginId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'User ID to check access for' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'User ID must be a valid UUID' }),
    tslib_1.__metadata("design:type", String)
], CheckPluginSubscriptionAccessDTO.prototype, "userId", void 0);
/**
 * Response DTO for subscription access check
 */
class PluginSubscriptionAccessResponseDTO {
}
exports.PluginSubscriptionAccessResponseDTO = PluginSubscriptionAccessResponseDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, description: 'Whether the user has access to the plugin' }),
    tslib_1.__metadata("design:type", Boolean)
], PluginSubscriptionAccessResponseDTO.prototype, "hasAccess", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Access level/scope', required: false }),
    tslib_1.__metadata("design:type", String)
], PluginSubscriptionAccessResponseDTO.prototype, "accessLevel", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, description: 'Whether the user can assign this plugin to others' }),
    tslib_1.__metadata("design:type", Boolean)
], PluginSubscriptionAccessResponseDTO.prototype, "canAssign", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, description: 'Whether the plugin requires a subscription' }),
    tslib_1.__metadata("design:type", Boolean)
], PluginSubscriptionAccessResponseDTO.prototype, "requiresSubscription", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, description: 'Whether the user can activate the plugin' }),
    tslib_1.__metadata("design:type", Boolean)
], PluginSubscriptionAccessResponseDTO.prototype, "canActivate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Object, description: 'Subscription details if available' }),
    tslib_1.__metadata("design:type", Object)
], PluginSubscriptionAccessResponseDTO.prototype, "subscription", void 0);
//# sourceMappingURL=plugin-subscription-assignment.dto.js.map