"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPluginTenantUsersQueryDTO = exports.ManagePluginTenantUsersDTO = exports.PluginTenantUserOperationType = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
/**
 * Operation type for managing plugin tenant users
 */
var PluginTenantUserOperationType;
(function (PluginTenantUserOperationType) {
    PluginTenantUserOperationType["ALLOW"] = "allow";
    PluginTenantUserOperationType["DENY"] = "deny";
    PluginTenantUserOperationType["REMOVE_ALLOWED"] = "remove-allowed";
    PluginTenantUserOperationType["REMOVE_DENIED"] = "remove-denied";
    PluginTenantUserOperationType["UNASSIGN"] = "unassign";
})(PluginTenantUserOperationType || (exports.PluginTenantUserOperationType = PluginTenantUserOperationType = {}));
/**
 * DTO for managing plugin tenant users (allow, deny, remove)
 */
class ManagePluginTenantUsersDTO {
}
exports.ManagePluginTenantUsersDTO = ManagePluginTenantUsersDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        type: [String],
        description: 'Array of user IDs to manage'
    }),
    (0, class_validator_1.IsArray)({ message: 'userIds must be an array' }),
    (0, class_validator_1.IsUUID)('4', { each: true, message: 'Each userId must be a valid UUID' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'At least one user ID is required' }),
    tslib_1.__metadata("design:type", Array)
], ManagePluginTenantUsersDTO.prototype, "userIds", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        enum: PluginTenantUserOperationType,
        description: 'Operation to perform: allow, deny, remove-allowed, remove-denied'
    }),
    (0, class_validator_1.IsEnum)(PluginTenantUserOperationType, {
        message: 'Operation must be one of: allow, deny, remove-allowed, remove-denied, unassign'
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Operation is required' }),
    tslib_1.__metadata("design:type", String)
], ManagePluginTenantUsersDTO.prototype, "operation", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        description: 'Optional reason for the operation'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Reason must be a string' }),
    tslib_1.__metadata("design:type", String)
], ManagePluginTenantUsersDTO.prototype, "reason", void 0);
/**
 * Query DTO for getting plugin tenant users
 */
class GetPluginTenantUsersQueryDTO {
}
exports.GetPluginTenantUsersQueryDTO = GetPluginTenantUsersQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: ['allowed', 'denied', 'all'],
        description: 'Type of users to retrieve',
        default: 'all'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['allowed', 'denied', 'all']),
    tslib_1.__metadata("design:type", String)
], GetPluginTenantUsersQueryDTO.prototype, "type", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Number,
        description: 'Number of records to skip'
    }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Number)
], GetPluginTenantUsersQueryDTO.prototype, "skip", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Number,
        description: 'Number of records to take'
    }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Number)
], GetPluginTenantUsersQueryDTO.prototype, "take", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        description: 'Search term for filtering users by name or email'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], GetPluginTenantUsersQueryDTO.prototype, "searchTerm", void 0);
//# sourceMappingURL=manage-plugin-tenant-users.dto.js.map