"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationProjectModuleController = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const pipes_1 = require("./../shared/pipes");
const guards_1 = require("../shared/guards");
const decorators_1 = require("../shared/decorators");
const crud_1 = require("../core/crud");
const organization_project_module_entity_1 = require("./organization-project-module.entity");
const organization_project_module_service_1 = require("./organization-project-module.service");
const dto_1 = require("./dto");
const commands_1 = require("./commands");
let OrganizationProjectModuleController = class OrganizationProjectModuleController extends crud_1.CrudController {
    constructor(organizationProjectModuleService, commandBus) {
        super(organizationProjectModuleService);
        this.organizationProjectModuleService = organizationProjectModuleService;
        this.commandBus = commandBus;
    }
    /**
     * @description Find employee project modules
     * @param options - Options finders and relations
     * @returns - A promise that resolves after found project modules
     * @memberof OrganizationProjectModuleController
     */
    async getEmployeeProjectModules(params) {
        return await this.organizationProjectModuleService.getEmployeeProjectModules(params);
    }
    /**
     * @description Find Team's project modules
     * @param options - Options finders and relations
     * @returns - A promise that resolves after found project modules
     * @memberof OrganizationProjectModuleController
     */
    async findTeamProjectModules(params) {
        return await this.organizationProjectModuleService.findTeamProjectModules(params);
    }
    /**
     * @description Find project modules by employee
     * @param employeeId - The employee ID for whom to search project modules
     * @param options - Finders options
     * @returns A promise that resolves after found project modules
     * @memberof OrganizationProjectModuleController
     */
    async findByEmployee(employeeId, params) {
        return await this.organizationProjectModuleService.findByEmployee(employeeId, params);
    }
    async findAll(params) {
        return await this.organizationProjectModuleService.findAll(params);
    }
    async findById(id, params) {
        return this.organizationProjectModuleService.findOneByIdString(id, params);
    }
    async create(entity) {
        return await this.commandBus.execute(new commands_1.OrganizationProjectModuleCreateCommand(entity));
    }
    async update(id, entity) {
        return await this.commandBus.execute(new commands_1.OrganizationProjectModuleUpdateCommand(id, entity));
    }
    async delete(id) {
        return await this.organizationProjectModuleService.delete(id);
    }
};
exports.OrganizationProjectModuleController = OrganizationProjectModuleController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find employee project modules.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found employee project modules',
        type: organization_project_module_entity_1.OrganizationProjectModule
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Records not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.PROJECT_MODULE_READ),
    (0, common_1.Get)('employee'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationProjectModuleController.prototype, "getEmployeeProjectModules", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find my team project modules.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found team project modules',
        type: organization_project_module_entity_1.OrganizationProjectModule
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Records not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.PROJECT_MODULE_READ),
    (0, common_1.Get)('team'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationProjectModuleController.prototype, "findTeamProjectModules", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find Employee project modules.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found Employee project modules',
        type: organization_project_module_entity_1.OrganizationProjectModule
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.PROJECT_MODULE_READ),
    (0, common_1.Get)('employee/:id'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.OrganizationProjectModuleFindInputDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationProjectModuleController.prototype, "findByEmployee", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all project modules.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found project modules',
        type: organization_project_module_entity_1.OrganizationProjectModule
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.PROJECT_MODULE_READ),
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationProjectModuleController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, pipes_1.UseValidationPipe)(),
    (0, swagger_1.ApiOperation)({ summary: 'Find by id' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found one record'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.PROJECT_MODULE_READ),
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationProjectModuleController.prototype, "findById", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'create a project module' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully created.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.PROJECT_MODULE_CREATE),
    (0, common_1.Post)(),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateOrganizationProjectModuleDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationProjectModuleController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing project module' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully edited.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.PROJECT_MODULE_UPDATE),
    (0, common_1.Put)(':id'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateOrganizationProjectModuleDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationProjectModuleController.prototype, "update", null);
tslib_1.__decorate([
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.PROJECT_MODULE_DELETE),
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationProjectModuleController.prototype, "delete", null);
exports.OrganizationProjectModuleController = OrganizationProjectModuleController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Project Modules'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT),
    (0, common_1.Controller)('/organization-project-modules'),
    tslib_1.__metadata("design:paramtypes", [organization_project_module_service_1.OrganizationProjectModuleService,
        cqrs_1.CommandBus])
], OrganizationProjectModuleController);
//# sourceMappingURL=organization-project-module.controller.js.map