"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationSprintController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("./../core/crud");
const decorators_1 = require("./../shared/decorators");
const guards_1 = require("./../shared/guards");
const organization_sprint_entity_1 = require("./organization-sprint.entity");
const organization_sprint_service_1 = require("./organization-sprint.service");
const commands_1 = require("./commands");
const pipes_1 = require("./../shared/pipes");
const dto_1 = require("./dto");
let OrganizationSprintController = class OrganizationSprintController extends crud_1.CrudController {
    constructor(organizationSprintService, commandBus) {
        super(organizationSprintService);
        this.organizationSprintService = organizationSprintService;
        this.commandBus = commandBus;
    }
    async findAll(data) {
        const { relations, findInput } = data;
        return this.organizationSprintService.findAll({
            where: findInput,
            relations
        });
    }
    async findById(id, params) {
        return await this.organizationSprintService.findOneByIdString(id, params);
    }
    /**
     * CREATE organization sprint
     *
     * @param entity
     * @param options
     * @returns
     */
    async create(entity) {
        return await this.commandBus.execute(new commands_1.OrganizationSprintCreateCommand(entity));
    }
    /**
     * UPDATE organization sprint by id
     *
     * @param id
     * @param entity
     * @returns
     */
    async update(id, entity) {
        return this.commandBus.execute(new commands_1.OrganizationSprintUpdateCommand(id, entity));
    }
    async delete(id) {
        return await this.organizationSprintService.delete(id);
    }
};
exports.OrganizationSprintController = OrganizationSprintController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find all organization sprint.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found organization sprints',
        type: organization_sprint_entity_1.OrganizationSprint
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.ORG_SPRINT_VIEW),
    (0, common_1.Get)(),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationSprintController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.ORG_SPRINT_VIEW),
    (0, common_1.Get)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationSprintController.prototype, "findById", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create new record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully created.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.ORG_SPRINT_ADD),
    (0, pipes_1.UseValidationPipe)(),
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateOrganizationSprintDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationSprintController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing record' }),
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
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.ORG_SPRINT_EDIT),
    (0, pipes_1.UseValidationPipe)(),
    (0, common_1.Put)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateOrganizationSprintDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationSprintController.prototype, "update", null);
tslib_1.__decorate([
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.ORG_SPRINT_DELETE),
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationSprintController.prototype, "delete", null);
exports.OrganizationSprintController = OrganizationSprintController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('OrganizationSprint'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT),
    (0, common_1.Controller)('/organization-sprint'),
    tslib_1.__metadata("design:paramtypes", [organization_sprint_service_1.OrganizationSprintService,
        cqrs_1.CommandBus])
], OrganizationSprintController);
//# sourceMappingURL=organization-sprint.controller.js.map