"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("./../core/crud");
const pipes_1 = require("./../shared/pipes");
const decorators_1 = require("./../shared/decorators");
const guards_1 = require("./../shared/guards");
const commands_1 = require("./commands");
const organization_entity_1 = require("./organization.entity");
const organization_service_1 = require("./organization.service");
const dto_1 = require("./dto");
const organization_find_options_dto_1 = require("./dto/organization-find-options.dto");
const sensitive_relations_decorator_1 = require("../core/decorators/sensitive-relations.decorator");
const sensitive_relations_interceptor_1 = require("../core/interceptors/sensitive-relations.interceptor");
const organization_sensitive_relations_config_1 = require("../core/util/organization-sensitive-relations.config");
let OrganizationController = class OrganizationController extends crud_1.CrudController {
    constructor(organizationService, commandBus) {
        super(organizationService);
        this.organizationService = organizationService;
        this.commandBus = commandBus;
    }
    /**
     * GET organization count
     *
     * @param options
     * @returns
     */
    async getCount(options) {
        return await this.organizationService.countBy(options);
    }
    /**
     * GET organization pagination
     *
     * Retrieve a paginated list of organizations within the tenant.
     *
     * @param options Query options for pagination and filtering
     * @returns Paginated list of organizations
     */
    async pagination(options) {
        return await this.organizationService.paginate(options);
    }
    /**
     * GET organizations by find many conditions
     *
     * Find all organizations within the tenant, optionally applying filters.
     *
     * @param options Query options for filtering organizations
     * @returns A list of organizations based on the applied filters
     */
    async findAll(options) {
        return await this.organizationService.findAll(options);
    }
    /**
     * GET organization by id
     *
     * Find an organization by its ID within the tenant.
     *
     * @param id The unique ID of the organization
     * @param options Query options for additional filtering
     * @returns The organization that matches the ID
     */
    async findById(id, options) {
        return await this.organizationService.findOneByIdString(id, options);
    }
    /**
     * CREATE organization for a specific tenant
     *
     * Creates a new organization within the tenant.
     *
     * @param entity The DTO containing organization details
     * @returns The newly created organization
     */
    async create(entity) {
        return await this.commandBus.execute(new commands_1.OrganizationCreateCommand(entity));
    }
    /**
     * UPDATE organization by id
     *
     * Update an existing organization by its ID within the tenant.
     *
     * @param id The unique ID of the organization
     * @param entity The DTO containing updated organization details
     * @returns The updated organization
     */
    async update(id, entity) {
        return await this.commandBus.execute(new commands_1.OrganizationUpdateCommand(id, entity));
    }
};
exports.OrganizationController = OrganizationController;
tslib_1.__decorate([
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW),
    (0, common_1.Get)('/count'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationController.prototype, "getCount", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve paginated list of organizations within the tenant.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully retrieved paginated list of organizations.',
        type: organization_entity_1.Organization,
        isArray: true
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'No organizations found.'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW),
    (0, common_1.Get)('/pagination'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationController.prototype, "pagination", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all organizations within the tenant.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully retrieved organizations.',
        type: organization_entity_1.Organization,
        isArray: true
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'No organizations found.'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW),
    (0, common_1.Get)('/'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find Organization by ID within the tenant.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully retrieved the organization.',
        type: organization_entity_1.Organization
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'No organization found with the provided ID.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'The unique identifier (UUID) of the organization.'
    }),
    (0, decorators_1.Permissions)(),
    (0, common_1.Get)(':id'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, organization_find_options_dto_1.OrganizationFindOptionsQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationController.prototype, "findById", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a new Organization for a specific tenant' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The Organization has been successfully created.',
        type: organization_entity_1.Organization
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, the response body may contain clues as to what went wrong.'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.Post)(),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateOrganizationDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing Organization' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The Organization has been successfully updated.',
        type: organization_entity_1.Organization
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, the response body may contain clues as to what went wrong.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'No organization found with the provided ID.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: String,
        description: 'The unique identifier (UUID) of the organization.'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Put)(':id'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateOrganizationDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationController.prototype, "update", null);
exports.OrganizationController = OrganizationController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Organization'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT),
    (0, common_1.UseInterceptors)(sensitive_relations_interceptor_1.SensitiveRelationsInterceptor),
    (0, sensitive_relations_decorator_1.SensitiveRelations)(organization_sensitive_relations_config_1.ORGANIZATION_SENSITIVE_RELATIONS),
    (0, common_1.Controller)('/organization'),
    tslib_1.__metadata("design:paramtypes", [organization_service_1.OrganizationService, cqrs_1.CommandBus])
], OrganizationController);
//# sourceMappingURL=organization.controller.js.map