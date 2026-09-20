"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardWidgetController = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const guards_1 = require("../../shared/guards");
const decorators_1 = require("../../shared/decorators");
const pipes_1 = require("../../shared/pipes");
const crud_1 = require("../../core/crud");
const dashboard_widget_entity_1 = require("./dashboard-widget.entity");
const commands_1 = require("./commands");
const dashboard_widget_service_1 = require("./dashboard-widget.service");
const dto_1 = require("./dto");
let DashboardWidgetController = class DashboardWidgetController extends crud_1.CrudController {
    constructor(dashboardWidgetService, commandBus) {
        super(dashboardWidgetService);
        this.dashboardWidgetService = dashboardWidgetService;
        this.commandBus = commandBus;
    }
    async findAll(params) {
        return this.dashboardWidgetService.findAll(params);
    }
    async findById(id, params) {
        return this.dashboardWidgetService.findOneByIdString(id, params);
    }
    async create(entity) {
        return await this.commandBus.execute(new commands_1.DashboardWidgetCreateCommand(entity));
    }
    async update(id, entity) {
        return await this.commandBus.execute(new commands_1.DashboardWidgetUpdateCommand(id, entity));
    }
    async delete(id) {
        return await this.dashboardWidgetService.delete(id);
    }
};
exports.DashboardWidgetController = DashboardWidgetController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get dashboard widgets.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found dashboard widgets',
        type: dashboard_widget_entity_1.DashboardWidget
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Records not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.DASHBOARD_READ),
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DashboardWidgetController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find by id.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found dashboard widget',
        type: dashboard_widget_entity_1.DashboardWidget
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.DASHBOARD_READ),
    (0, common_1.Get)(':id'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DashboardWidgetController.prototype, "findById", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create dashboard widget.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully created.'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT),
    (0, common_1.Post)(),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateDashboardWidgetDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DashboardWidgetController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update dashboard widget.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully updated.'
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
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT),
    (0, common_1.Put)(':id'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateDashboardWidgetDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DashboardWidgetController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete dashboard widget.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The record has been successfully deleted.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT),
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], DashboardWidgetController.prototype, "delete", null);
exports.DashboardWidgetController = DashboardWidgetController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Dashboard Widget'),
    (0, common_2.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.DASHBOARD_READ),
    (0, common_1.Controller)('dashboard-widget'),
    tslib_1.__metadata("design:paramtypes", [dashboard_widget_service_1.DashboardWidgetService,
        cqrs_1.CommandBus])
], DashboardWidgetController);
//# sourceMappingURL=dashboard-widget.controller.js.map