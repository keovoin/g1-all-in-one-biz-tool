"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationTeamEmployeeController = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const guards_1 = require("./../shared/guards");
const decorators_1 = require("./../shared/decorators");
const pipes_1 = require("./../shared/pipes");
const organization_team_employee_service_1 = require("./organization-team-employee.service");
const dto_1 = require("./dto");
let OrganizationTeamEmployeeController = class OrganizationTeamEmployeeController {
    constructor(organizationTeamEmployeeService) {
        this.organizationTeamEmployeeService = organizationTeamEmployeeService;
    }
    /**
     * Update a team member by memberId
     *
     * @param id - ID of the team member to update
     * @param entity - Data transfer object for updating team member
     * @returns Updated team member
     */
    async update(id, entity) {
        return this.organizationTeamEmployeeService.update(id, entity);
    }
    /**
     * Update organization team member's active task entity
     *
     * @param id - ID of the team member
     * @param entity - Data transfer object for updating active task
     * @returns Updated team member
     */
    async updateActiveTask(id, entity) {
        return this.organizationTeamEmployeeService.updateActiveTask(id, entity);
    }
    /**
     * Delete a team member by memberId
     *
     * @param id - ID of the team member to delete
     * @param options - Query parameters for deletion
     * @returns Result of the deletion operation
     */
    async delete(id, options) {
        return this.organizationTeamEmployeeService.deleteTeamMember(id, options);
    }
};
exports.OrganizationTeamEmployeeController = OrganizationTeamEmployeeController;
tslib_1.__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.ORG_TEAM_EDIT),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    (0, common_1.Put)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateTeamMemberDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationTeamEmployeeController.prototype, "update", null);
tslib_1.__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.ORG_TEAM_EDIT_ACTIVE_TASK),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    (0, common_1.Put)('/:id/active-task'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateOrganizationTeamActiveTaskDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationTeamEmployeeController.prototype, "updateActiveTask", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete an organization team member record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The record has been successfully deleted'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.ORG_TEAM_DELETE),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    (0, common_1.Delete)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.DeleteTeamMemberQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationTeamEmployeeController.prototype, "delete", null);
exports.OrganizationTeamEmployeeController = OrganizationTeamEmployeeController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('OrganizationTeamEmployee'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.ORG_TEAM_EDIT),
    (0, common_1.Controller)('/organization-team-employee'),
    tslib_1.__metadata("design:paramtypes", [organization_team_employee_service_1.OrganizationTeamEmployeeService])
], OrganizationTeamEmployeeController);
//# sourceMappingURL=organization-team-employee.controller.js.map