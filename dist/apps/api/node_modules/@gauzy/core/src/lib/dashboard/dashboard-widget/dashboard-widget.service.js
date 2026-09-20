"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardWidgetService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("../../core/crud");
const context_1 = require("../../core/context");
const type_orm_dashboard_widget_repository_1 = require("./repository/type-orm-dashboard-widget.repository");
const mikro_orm_dashboard_widget_repository_1 = require("./repository/mikro-orm-dashboard-widget.repository");
const activity_log_service_1 = require("../../activity-log/activity-log.service");
let DashboardWidgetService = class DashboardWidgetService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmDashboardWidgetRepository, mikroOrmDashboardWidgetRepository, activityLogService) {
        super(typeOrmDashboardWidgetRepository, mikroOrmDashboardWidgetRepository);
        this.typeOrmDashboardWidgetRepository = typeOrmDashboardWidgetRepository;
        this.mikroOrmDashboardWidgetRepository = mikroOrmDashboardWidgetRepository;
        this.activityLogService = activityLogService;
    }
    /**
     * Creates a new dashboard widget
     *
     * @param {IDashboardWidgetCreateInput} input - The input data for creating a dashboard widget
     * @returns {Promise<DashboardWidget>} The created dashboard widget
     */
    async create(input) {
        try {
            const user = context_1.RequestContext.currentUser();
            const tenantId = context_1.RequestContext.currentTenantId() ?? input.tenantId;
            const { organizationId, employeeId = user?.employeeId } = input;
            // create dashboard widget
            const dashboardWidget = await super.create({
                ...input,
                employeeId,
                tenantId
            });
            // Generate the activity log
            this.activityLogService.logActivity(contracts_1.BaseEntityEnum.DashboardWidget, contracts_1.ActionTypeEnum.Created, contracts_1.ActorTypeEnum.User, dashboardWidget.id, dashboardWidget.name, dashboardWidget, organizationId, tenantId);
            // Return the created widget
            return dashboardWidget;
        }
        catch (error) {
            throw new common_2.HttpException(`Failed to create dashboard widget: ${error.message}`, common_2.HttpStatus.BAD_REQUEST);
        }
    }
    /**
     * Updates an existing dashboard widget
     *
     * @param {ID} id - The ID of the dashboard widget to update
     * @param {IDashboardWidgetUpdateInput} input - The input data for updating a dashboard widget
     * @returns {Promise<DashboardWidget>} The updated dashboard widget
     */
    async update(id, input) {
        const tenantId = context_1.RequestContext.currentTenantId() ?? input.tenantId;
        try {
            const { organizationId } = input;
            // Retrieve existing dashboard widget
            const existingDashboardWidget = await this.findOneByIdString(id);
            if (!existingDashboardWidget) {
                throw new common_2.NotFoundException(`Dashboard widget with id ${id} not found`);
            }
            // Update the widget
            const updatedWidget = await super.create({
                ...input,
                id
            });
            // Log the update activity
            this.activityLogService.logActivity(contracts_1.BaseEntityEnum.DashboardWidget, contracts_1.ActionTypeEnum.Updated, contracts_1.ActorTypeEnum.User, updatedWidget.id, updatedWidget.name, updatedWidget, organizationId, tenantId, existingDashboardWidget, input);
            return updatedWidget;
        }
        catch (error) {
            throw new common_2.HttpException(`Failed to update dashboard widget: ${error.message}`, common_2.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.DashboardWidgetService = DashboardWidgetService;
exports.DashboardWidgetService = DashboardWidgetService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_dashboard_widget_repository_1.TypeOrmDashboardWidgetRepository,
        mikro_orm_dashboard_widget_repository_1.MikroOrmDashboardWidgetRepository,
        activity_log_service_1.ActivityLogService])
], DashboardWidgetService);
//# sourceMappingURL=dashboard-widget.service.js.map