"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const guards_1 = require("../shared/guards");
const decorators_1 = require("../shared/decorators");
const pipes_1 = require("../shared/pipes");
const crud_1 = require("../core/crud");
const dashboard_entity_1 = require("./dashboard.entity");
const dashboard_service_1 = require("./dashboard.service");
const commands_1 = require("./commands");
const dto_1 = require("./dto");
let DashboardController = class DashboardController extends crud_1.CrudController {
    constructor(dashboardService, commandBus) {
        super(dashboardService);
        this.dashboardService = dashboardService;
        this.commandBus = commandBus;
    }
    /**
     * Retrieves a list of dashboards with pagination.
     *
     * @param params - The pagination and filter parameters.
     * @returns A paginated list of dashboards.
     */
    async findAll(params) {
        return this.dashboardService.findAll(params);
    }
    /**
     * Retrieves a dashboard by its unique identifier.
     *
     * @param id - The unique identifier of the dashboard.
     * @param params - Additional query parameters for pagination or filtering.
     * @returns The dashboard entity if found.
     */
    async findById(id, params) {
        return this.dashboardService.findOneByIdString(id, params);
    }
    /**
     * Creates a new dashboard.
     *
     * @param entity - The data transfer object containing the details of the dashboard to be created.
     * @returns The created dashboard entity.
     */
    async create(entity) {
        return await this.commandBus.execute(new commands_1.DashboardCreateCommand(entity));
    }
    /**
     * Updates an existing dashboard.
     *
     * @param id - The UUID of the dashboard to be updated.
     * @param entity - The data transfer object containing the updated details of the dashboard.
     * @returns The updated dashboard entity.
     */
    async update(id, entity) {
        return await this.commandBus.execute(new commands_1.DashboardUpdateCommand(id, entity));
    }
    /**
     * Deletes a dashboard by its ID.
     *
     * @param id - The UUID of the dashboard to delete.
     * @returns The result of the delete operation.
     */
    async delete(id) {
        return await this.dashboardService.delete(id);
    }
};
exports.DashboardController = DashboardController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a list of dashboards with pagination.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully retrieved dashboards.',
        type: dashboard_entity_1.Dashboard
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'No dashboards found.'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.DASHBOARD_READ),
    (0, common_1.Get)('/'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DashboardController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a dashboard by its ID.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Dashboard retrieved successfully.',
        type: dashboard_entity_1.Dashboard
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Dashboard not found.'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.DASHBOARD_READ),
    (0, common_1.Get)('/:id'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DashboardController.prototype, "findById", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a new dashboard.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The dashboard has been successfully created.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, object invalid.'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.DASHBOARD_CREATE),
    (0, common_1.Post)('/'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateDashboardDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DashboardController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing dashboard.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.ACCEPTED,
        description: 'The dashboard has been successfully updated.',
        type: dashboard_entity_1.Dashboard
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Dashboard not found.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input; the response body may contain clues as to what went wrong.'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.DASHBOARD_UPDATE),
    (0, common_1.Put)('/:id'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateDashboardDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DashboardController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete a dashboard by ID.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The dashboard has been successfully deleted.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Dashboard not found.'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.DASHBOARD_DELETE),
    (0, common_1.Delete)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], DashboardController.prototype, "delete", null);
exports.DashboardController = DashboardController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Dashboard'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.DASHBOARD_READ),
    (0, common_1.Controller)('/dashboard'),
    tslib_1.__metadata("design:paramtypes", [dashboard_service_1.DashboardService, cqrs_1.CommandBus])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map