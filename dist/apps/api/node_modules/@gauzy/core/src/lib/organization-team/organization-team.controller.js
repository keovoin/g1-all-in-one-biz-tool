"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationTeamController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("./../core/crud");
const guards_1 = require("./../shared/guards");
const pipes_1 = require("./../shared/pipes");
const decorators_1 = require("./../shared/decorators");
const dto_1 = require("./../shared/dto");
const queries_1 = require("./queries");
const dto_2 = require("./dto");
const organization_team_entity_1 = require("./organization-team.entity");
const organization_team_service_1 = require("./organization-team.service");
const commands_1 = require("./commands");
const sensitive_relations_decorator_1 = require("../core/decorators/sensitive-relations.decorator");
const sensitive_relations_interceptor_1 = require("../core/interceptors/sensitive-relations.interceptor");
const organization_sensitive_relations_config_1 = require("../core/util/organization-sensitive-relations.config");
let OrganizationTeamController = class OrganizationTeamController extends crud_1.CrudController {
    constructor(_commandBus, _queryBus, _organizationTeamService) {
        super(_organizationTeamService);
        this._commandBus = _commandBus;
        this._queryBus = _queryBus;
        this._organizationTeamService = _organizationTeamService;
    }
    /**
     * GET find my organization teams
     *
     * @param data
     * @returns
     */
    async findMyTeams(params) {
        return await this._organizationTeamService.findMyTeams(params);
    }
    /**
     * GET organization team count
     *
     * @param options
     * @returns
     */
    async getCount(options) {
        return await this._organizationTeamService.countBy(options);
    }
    /**
     * GET organization teams by pagination
     *
     * @param params
     * @returns
     */
    async pagination(params) {
        return await this._organizationTeamService.pagination(params);
    }
    /**
     * GET organization teams
     *
     * @param params
     * @returns
     */
    async findAll(params) {
        return await this._organizationTeamService.findAll(params);
    }
    /**
     * Find team by primary ID
     *
     * @param id - The primary ID of the organization team.
     * @param query - Query parameters for team statistics.
     * @returns The result of the team statistics query.
     */
    async findById(id, options) {
        return await this._queryBus.execute(new queries_1.GetOrganizationTeamStatisticQuery(id, options));
    }
    /**
     * CREATE organization team
     *
     * @param entity
     * @returns
     */
    async create(entity) {
        return await this._commandBus.execute(new commands_1.OrganizationTeamCreateCommand(entity));
    }
    /**
     * UPDATE organization team by id
     *
     * @param id
     * @param entity
     * @returns
     */
    async update(id, entity) {
        return await this._organizationTeamService.update(id, entity);
    }
    /**
     * Delete organization team
     *
     * @param id
     * @returns
     */
    async delete(teamId, options) {
        return await this._organizationTeamService.deleteTeam(teamId, options);
    }
    /**
     * Exist from teams where users joined as a team members.
     *
     * @param userId
     * @returns
     */
    async existTeamsAsMember(userId) {
        return await this._organizationTeamService.existTeamsAsMember(userId);
    }
};
exports.OrganizationTeamController = OrganizationTeamController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find all organization Teams.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found Teams',
        type: organization_team_entity_1.OrganizationTeam
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.ORG_TEAM_VIEW),
    (0, common_1.Get)('/me'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationTeamController.prototype, "findMyTeams", null);
tslib_1.__decorate([
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.ORG_TEAM_VIEW),
    (0, common_1.Get)('/count'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CountQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationTeamController.prototype, "getCount", null);
tslib_1.__decorate([
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.ORG_TEAM_VIEW),
    (0, common_1.Get)('/pagination'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationTeamController.prototype, "pagination", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find all organization Teams.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found Teams',
        type: organization_team_entity_1.OrganizationTeam
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.ORG_TEAM_VIEW),
    (0, common_1.Get)('/'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationTeamController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.ORG_TEAM_VIEW),
    (0, common_1.Get)('/:id'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_2.OrganizationTeamStatisticDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationTeamController.prototype, "findById", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create new record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully created.' /*, type: T*/
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.ORG_TEAM_ADD),
    (0, common_1.Post)('/'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_2.CreateOrganizationTeamDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationTeamController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update an organization Team' }),
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
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.ORG_TEAM_EDIT),
    (0, common_1.Put)('/:id'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_2.UpdateOrganizationTeamDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationTeamController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete organization team' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'The record has been successfully deleted'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.ORG_TEAM_DELETE),
    (0, common_1.Delete)('/:id'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.DeleteQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationTeamController.prototype, "delete", null);
tslib_1.__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.ORG_TEAM_REMOVE_ACCOUNT_AS_MEMBER),
    (0, common_1.Delete)('/teams/:userId'),
    tslib_1.__param(0, (0, common_1.Param)('userId', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationTeamController.prototype, "existTeamsAsMember", null);
exports.OrganizationTeamController = OrganizationTeamController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('OrganizationTeam'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.ORG_TEAM_EDIT),
    (0, common_1.UseInterceptors)(sensitive_relations_interceptor_1.SensitiveRelationsInterceptor),
    (0, sensitive_relations_decorator_1.SensitiveRelations)(organization_sensitive_relations_config_1.ORGANIZATION_SENSITIVE_RELATIONS, 'organization'),
    (0, common_1.Controller)('/organization-team'),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus,
        cqrs_1.QueryBus,
        organization_team_service_1.OrganizationTeamService])
], OrganizationTeamController);
//# sourceMappingURL=organization-team.controller.js.map