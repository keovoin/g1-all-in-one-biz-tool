"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationProjectController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("./../core/crud");
const commands_1 = require("./commands");
const organization_project_entity_1 = require("./organization-project.entity");
const organization_project_service_1 = require("./organization-project.service");
const guards_1 = require("./../shared/guards");
const project_manager_or_permission_guard_1 = require("./guards/project-manager-or-permission.guard");
const decorators_1 = require("./../shared/decorators");
const dto_1 = require("./../shared/dto");
const pipes_1 = require("./../shared/pipes");
const dto_2 = require("./../core/dto");
const dto_3 = require("./dto");
const sensitive_relations_decorator_1 = require("../core/decorators/sensitive-relations.decorator");
const sensitive_relations_interceptor_1 = require("../core/interceptors/sensitive-relations.interceptor");
const organization_sensitive_relations_config_1 = require("../core/util/organization-sensitive-relations.config");
let OrganizationProjectController = class OrganizationProjectController extends crud_1.CrudController {
    constructor(organizationProjectService, commandBus) {
        super(organizationProjectService);
        this.organizationProjectService = organizationProjectService;
        this.commandBus = commandBus;
    }
    /**
     * GET organization projects by employee.
     *
     * @param employeeId - UUID of the employee.
     * @param options - Additional filtering options based on tenant organization.
     * @returns An array of organization projects associated with the employee.
     */
    async findProjectsByEmployee(employeeId, options) {
        return await this.organizationProjectService.findByEmployee(employeeId, options);
    }
    /**
     * Update organization project by employee.
     *
     * @param body - Payload for updating the organization project by employee.
     * @returns A boolean indicating if the update was successful.
     */
    async updateProjectByEmployee(body) {
        return await this.commandBus.execute(new commands_1.OrganizationProjectEditByEmployeeCommand(body));
    }
    /**
     * Update organization project task view mode.
     *
     * @param id - The UUID of the organization project to update.
     * @param entity - Payload containing the new task view mode settings.
     * @returns The updated organization project.
     */
    async updateTaskViewMode(id, entity) {
        return await this.commandBus.execute(new commands_1.OrganizationProjectUpdateCommand(id, entity));
    }
    /**
     * Update organization project settings by ID.
     *
     * @param id - The ID of the organization project to update settings for.
     * @param entity - An object containing the updated project settings.
     * @returns A promise that resolves to an `IOrganizationProjectSetting` object representing the updated project settings.
     */
    async updateProjectSetting(id, entity) {
        return await this.commandBus.execute(new commands_1.OrganizationProjectSettingUpdateCommand(id, entity));
    }
    /**
     * Finds synced projects with pagination and optional search.
     * @param params - Pagination and filtering parameters.
     * @returns A paginated list of organization projects.
     */
    async findSyncedProjects(params) {
        return await this.organizationProjectService.findSyncedProjects(params);
    }
    /**
     * Get count of organization projects.
     * @param options - Query options for filtering the count of organization projects.
     * @returns The total count of organization projects.
     */
    async getCount(options) {
        return await this.organizationProjectService.countBy(options);
    }
    /**
     * Find all organization projects in the same tenant using pagination.
     * @param filter - Pagination parameters and additional filters.
     * @returns A paginated result containing organization projects.
     */
    async pagination(filter) {
        return await this.organizationProjectService.pagination(filter);
    }
    /**
     * Find all organization projects.
     * @param params - Pagination parameters and any additional filters.
     * @returns A paginated result containing organization projects.
     */
    async findAll(params) {
        return await this.organizationProjectService.findAll(params);
    }
    /**
     * Retrieve an organization project by its ID.
     * @param id - UUID of the organization project.
     * @param options - Optional query parameters for relations.
     * @returns The organization project corresponding to the given ID.
     */
    async findById(id, options) {
        return await this.organizationProjectService.findById(id, options);
    }
    /**
     * Create a new organization project.
     * @param entity - Payload for creating a new organization project.
     * @returns The newly created organization project.
     */
    async create(entity) {
        return await this.commandBus.execute(new commands_1.OrganizationProjectCreateCommand(entity));
    }
    /**
     * Check if an employee is a manager of a specific project.
     * @param projectId - UUID of the organization project.
     * @param employeeId - UUID of the employee.
     * @returns True if the employee is a manager of the project, otherwise false.
     */
    async isProjectManager(projectId, employeeId) {
        return await this.organizationProjectService.isManagerOfProject(projectId, employeeId);
    }
    /**
     * Update an organization project by ID.
     * @param id - UUID of the organization project
     * @param entity - Update payload for the organization project
     * @returns The updated organization project.
     */
    async update(id, entity) {
        return await this.commandBus.execute(new commands_1.OrganizationProjectUpdateCommand(id, entity));
    }
    /**
     * Delete an organization project by ID.
     * @param id - UUID of the organization project
     */
    async delete(id) {
        return await this.organizationProjectService.delete(id);
    }
};
exports.OrganizationProjectController = OrganizationProjectController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all organization projects by Employee.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found projects',
        isArray: true,
        type: organization_project_entity_1.OrganizationProject
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, swagger_1.ApiParam)({
        name: 'employeeId',
        description: 'UUID of the employee',
        type: String,
        required: true
    }),
    (0, swagger_1.ApiQuery)({
        name: 'options',
        description: 'Filtering options for tenant organization',
        type: dto_2.TenantOrganizationBaseDTO,
        required: false
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.ORG_PROJECT_VIEW),
    (0, pipes_1.UseValidationPipe)(),
    (0, common_1.Get)('/employee/:employeeId'),
    tslib_1.__param(0, (0, common_1.Param)('employeeId', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_2.TenantOrganizationBaseDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationProjectController.prototype, "findProjectsByEmployee", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update organization project by employee' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The record has been successfully updated.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input. The response body may contain clues as to what went wrong.'
    }),
    (0, swagger_1.ApiBody)({
        description: 'Payload for updating organization project by employee'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.ORG_PROJECT_EDIT),
    (0, common_1.Put)('/employee'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationProjectController.prototype, "updateProjectByEmployee", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update organization project task view mode' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The record has been successfully updated.',
        type: organization_project_entity_1.OrganizationProject
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, the response body may contain clues as to what went wrong'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'UUID of the organization project',
        type: String,
        required: true
    }),
    (0, swagger_1.ApiBody)({
        description: 'Payload for updating the task view mode',
        type: dto_3.UpdateTaskModeDTO
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.ORG_PROJECT_EDIT),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    (0, common_1.Put)('/task-view/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_3.UpdateTaskModeDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationProjectController.prototype, "updateTaskViewMode", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update organization project settings by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Organization project settings updated successfully'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'The ID of the organization project to update settings for',
        type: String,
        required: true
    }),
    (0, swagger_1.ApiBody)({
        description: 'Updated project settings payload',
        type: dto_3.UpdateProjectSettingDTO
    }),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    (0, common_1.Put)('/setting/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_3.UpdateProjectSettingDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationProjectController.prototype, "updateProjectSetting", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find synced projects with pagination and optional search.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Paginated list of synced organization projects',
        type: organization_project_entity_1.OrganizationProject,
        isArray: true
    }),
    (0, pipes_1.UseValidationPipe)(),
    (0, common_1.Get)('/synced'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationProjectController.prototype, "findSyncedProjects", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find organization projects count.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found count',
        type: Number
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'options',
        description: 'Query options for filtering the count',
        type: dto_1.CountQueryDTO,
        required: false
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.ORG_PROJECT_VIEW),
    (0, pipes_1.UseValidationPipe)(),
    (0, common_1.Get)('/count'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CountQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationProjectController.prototype, "getCount", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find all organization project in the same tenant using pagination.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found organization project in the tenant',
        type: organization_project_entity_1.OrganizationProject,
        isArray: true
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.ORG_PROJECT_VIEW),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    (0, common_1.Get)('/pagination'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationProjectController.prototype, "pagination", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all organization projects.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found projects',
        type: organization_project_entity_1.OrganizationProject,
        isArray: true
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.ORG_PROJECT_VIEW),
    (0, pipes_1.UseValidationPipe)(),
    (0, common_1.Get)('/'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationProjectController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find organization project by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Returns the organization project with the specified ID',
        type: organization_project_entity_1.OrganizationProject
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Organization project not found'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'UUID of the organization project',
        type: String,
        required: true
    }),
    (0, swagger_1.ApiQuery)({
        name: 'options',
        description: 'Relations query options',
        required: false,
        type: dto_1.RelationsQueryDTO
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.ORG_PROJECT_VIEW),
    (0, common_1.Get)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.RelationsQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationProjectController.prototype, "findById", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a new organization project' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The organization project has been successfully created',
        type: organization_project_entity_1.OrganizationProject
    }),
    (0, swagger_1.ApiBody)({
        description: 'Payload for creating the organization project',
        type: dto_3.CreateOrganizationProjectDTO
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.ORG_PROJECT_ADD),
    (0, pipes_1.UseValidationPipe)(),
    (0, common_1.Post)('/'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_3.CreateOrganizationProjectDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationProjectController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Check if an employee is a manager of a specific project.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Returns true if the employee is a manager of the project, otherwise false.',
        type: Boolean
    }),
    (0, swagger_1.ApiParam)({
        name: 'projectId',
        description: 'UUID of the organization project',
        type: String,
        required: true
    }),
    (0, swagger_1.ApiParam)({
        name: 'employeeId',
        description: 'UUID of the employee',
        type: String,
        required: true
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.ORG_PROJECT_VIEW),
    (0, common_1.Get)('/:projectId/is-manager/:employeeId'),
    tslib_1.__param(0, (0, common_1.Param)('projectId', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Param)('employeeId', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationProjectController.prototype, "isProjectManager", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update organization project by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.ACCEPTED,
        description: 'The organization project has been successfully updated',
        type: organization_project_entity_1.OrganizationProject
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Organization project not found'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'UUID of the organization project',
        type: String,
        required: true
    }),
    (0, swagger_1.ApiBody)({
        description: 'Payload for updating the organization project',
        type: dto_3.UpdateOrganizationProjectDTO
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.ORG_PROJECT_EDIT),
    (0, pipes_1.UseValidationPipe)(),
    (0, common_1.Put)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_3.UpdateOrganizationProjectDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationProjectController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete organization project by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'The organization project has been successfully deleted'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Organization project not found'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'UUID of the organization project',
        type: String,
        required: true
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.ORG_PROJECT_DELETE),
    (0, common_1.Delete)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationProjectController.prototype, "delete", null);
exports.OrganizationProjectController = OrganizationProjectController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('OrganizationProject'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, project_manager_or_permission_guard_1.ProjectManagerOrPermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.ORG_PROJECT_EDIT),
    (0, common_1.UseInterceptors)(sensitive_relations_interceptor_1.SensitiveRelationsInterceptor),
    (0, sensitive_relations_decorator_1.SensitiveRelations)(organization_sensitive_relations_config_1.ORGANIZATION_SENSITIVE_RELATIONS, 'organization'),
    (0, common_1.Controller)('/organization-projects'),
    tslib_1.__metadata("design:paramtypes", [organization_project_service_1.OrganizationProjectService,
        cqrs_1.CommandBus])
], OrganizationProjectController);
//# sourceMappingURL=organization-project.controller.js.map