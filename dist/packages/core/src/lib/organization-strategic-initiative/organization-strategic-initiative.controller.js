"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationStrategicInitiativeController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("../core/crud");
const guards_1 = require("../shared/guards");
const decorators_1 = require("../shared/decorators");
const pipes_1 = require("../shared/pipes");
const organization_strategic_initiative_entity_1 = require("./organization-strategic-initiative.entity");
const organization_strategic_initiative_service_1 = require("./organization-strategic-initiative.service");
const commands_1 = require("./commands");
const queries_1 = require("./queries");
const dto_1 = require("./dto");
let OrganizationStrategicInitiativeController = class OrganizationStrategicInitiativeController extends crud_1.CrudController {
    constructor(_organizationStrategicInitiativeService, _commandBus, _queryBus) {
        super(_organizationStrategicInitiativeService);
        this._organizationStrategicInitiativeService = _organizationStrategicInitiativeService;
        this._commandBus = _commandBus;
        this._queryBus = _queryBus;
    }
    /**
     * GET all organization strategic initiatives with optional filters
     *
     * @param params - Query parameters for filtering
     * @returns Paginated list of organization strategic initiatives
     */
    async findAll(params) {
        return await this._queryBus.execute(new queries_1.OrganizationStrategicInitiativeFindAllQuery(params));
    }
    /**
     * GET organization strategic initiatives by project ID
     *
     * @param projectId - The project ID
     * @returns List of organization strategic initiatives linked to the project
     */
    async findByProject(projectId) {
        return await this._queryBus.execute(new queries_1.OrganizationStrategicInitiativeFindByProjectQuery(projectId));
    }
    /**
     * GET an organization strategic initiative by ID
     *
     * @param id - The organization strategic initiative ID
     * @param params - Optional query parameters
     * @returns The organization strategic initiative
     */
    async findById(id, params) {
        return await this._queryBus.execute(new queries_1.OrganizationStrategicInitiativeFindOneQuery(id, params));
    }
    /**
     * CREATE a new organization strategic initiative
     *
     * @param entity - The organization strategic initiative data
     * @returns The created organization strategic initiative
     */
    async create(entity) {
        return await this._commandBus.execute(new commands_1.OrganizationStrategicInitiativeCreateCommand(entity));
    }
    /**
     * UPDATE an organization strategic initiative by ID
     *
     * @param id - The organization strategic initiative ID
     * @param entity - The updated organization strategic initiative data
     * @returns The updated organization strategic initiative
     */
    async update(id, entity) {
        return await this._commandBus.execute(new commands_1.OrganizationStrategicInitiativeUpdateCommand(id, entity));
    }
    /**
     * UPDATE strategic signals of an organization strategic initiative
     *
     * @param id - The organization strategic initiative ID
     * @param signals - The strategic signals data
     * @returns The updated organization strategic initiative
     */
    async updateSignals(id, signals) {
        return await this._commandBus.execute(new commands_1.OrganizationStrategicInitiativeUpdateSignalsCommand(id, signals));
    }
    /**
     * DELETE an organization strategic initiative by ID
     *
     * @param id - The organization strategic initiative ID
     * @returns Delete result
     */
    async delete(id) {
        return await this._organizationStrategicInitiativeService.delete(id);
    }
};
exports.OrganizationStrategicInitiativeController = OrganizationStrategicInitiativeController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all organization strategic initiatives with optional filters' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found organization strategic initiatives',
        type: organization_strategic_initiative_entity_1.OrganizationStrategicInitiative,
        isArray: true
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Records not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_STRATEGIC_INITIATIVE_READ),
    (0, common_1.Get)(),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationStrategicInitiativeController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find organization strategic initiatives by project' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found organization strategic initiatives for project',
        type: organization_strategic_initiative_entity_1.OrganizationStrategicInitiative,
        isArray: true
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Project not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_STRATEGIC_INITIATIVE_READ),
    (0, common_1.Get)('project/:projectId'),
    tslib_1.__param(0, (0, common_1.Param)('projectId', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationStrategicInitiativeController.prototype, "findByProject", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find an organization strategic initiative by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found organization strategic initiative',
        type: organization_strategic_initiative_entity_1.OrganizationStrategicInitiative
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_STRATEGIC_INITIATIVE_READ),
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationStrategicInitiativeController.prototype, "findById", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a new organization strategic initiative' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Organization strategic initiative created successfully',
        type: organization_strategic_initiative_entity_1.OrganizationStrategicInitiative
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, the response body may contain clues as to what went wrong'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_STRATEGIC_INITIATIVE_CREATE),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.Post)(),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateOrganizationStrategicInitiativeDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationStrategicInitiativeController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update an organization strategic initiative' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Organization strategic initiative updated successfully',
        type: organization_strategic_initiative_entity_1.OrganizationStrategicInitiative
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, the response body may contain clues as to what went wrong'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_STRATEGIC_INITIATIVE_UPDATE),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Put)(':id'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateOrganizationStrategicInitiativeDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationStrategicInitiativeController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update strategic signals of an organization strategic initiative' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Strategic signals updated successfully',
        type: organization_strategic_initiative_entity_1.OrganizationStrategicInitiative
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_STRATEGIC_INITIATIVE_UPDATE),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Put)(':id/signals'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateOrganizationStrategicSignalsDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationStrategicInitiativeController.prototype, "updateSignals", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete an organization strategic initiative' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Organization strategic initiative deleted successfully'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_STRATEGIC_INITIATIVE_DELETE),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationStrategicInitiativeController.prototype, "delete", null);
exports.OrganizationStrategicInitiativeController = OrganizationStrategicInitiativeController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('OrganizationStrategicInitiative'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, common_1.Controller)('/organization-strategic-initiative'),
    tslib_1.__metadata("design:paramtypes", [organization_strategic_initiative_service_1.OrganizationStrategicInitiativeService,
        cqrs_1.CommandBus,
        cqrs_1.QueryBus])
], OrganizationStrategicInitiativeController);
//# sourceMappingURL=organization-strategic-initiative.controller.js.map