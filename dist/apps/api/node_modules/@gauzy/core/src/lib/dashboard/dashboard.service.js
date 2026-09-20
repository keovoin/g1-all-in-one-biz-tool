"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const tenant_aware_crud_service_1 = require("../core/crud/tenant-aware-crud.service");
const request_context_1 = require("../core/context/request-context");
const activity_log_service_1 = require("../activity-log/activity-log.service");
const type_orm_dashboard_repository_1 = require("./repository/type-orm-dashboard.repository");
const mikro_orm_dashboard_repository_1 = require("./repository/mikro-orm-dashboard.repository");
let DashboardService = class DashboardService extends tenant_aware_crud_service_1.TenantAwareCrudService {
    constructor(typeOrmDashboardRepository, mikroOrmDashboardRepository, _activityLogService) {
        super(typeOrmDashboardRepository, mikroOrmDashboardRepository);
        this.typeOrmDashboardRepository = typeOrmDashboardRepository;
        this.mikroOrmDashboardRepository = mikroOrmDashboardRepository;
        this._activityLogService = _activityLogService;
    }
    /**
     * Creates a new dashboard.
     *
     * @param input - The data required to create a new dashboard.
     * @returns The created Dashboard entity.
     * @throws {HttpException} If the creation process fails.
     */
    async create(input) {
        try {
            // Retrieve the tenant ID from the request context or fallback to the input tenantId
            const tenantId = request_context_1.RequestContext.currentTenantId() ?? input.tenantId;
            // Destructure organizationId and the rest of the input data
            const { organizationId, ...data } = input;
            // Create the dashboard entity using the base service's create method
            const dashboard = await super.create({
                ...data,
                organizationId,
                tenantId
            });
            // Log the creation activity
            this._activityLogService.logActivity(contracts_1.BaseEntityEnum.Dashboard, contracts_1.ActionTypeEnum.Created, contracts_1.ActorTypeEnum.User, dashboard.id, dashboard.name, dashboard, organizationId, tenantId);
            return dashboard;
        }
        catch (error) {
            // Log the error for debugging purposes
            console.error(`Failed to create dashboard: ${error.message}`);
            // Throw an HTTP exception with a BAD_REQUEST status
            throw new common_1.HttpException(`Failed to create dashboard: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    /**
     * Updates an existing dashboard.
     *
     * @param id - The unique identifier of the dashboard to update.
     * @param input - The data to update the dashboard with.
     * @returns A promise that resolves to the updated Dashboard entity.
     * @throws {NotFoundException} If the dashboard with the given ID does not exist.
     * @throws {HttpException} If the update process fails.
     */
    async update(id, input) {
        try {
            // Retrieve the tenant ID from the request context or fallback to the input tenantId
            const tenantId = request_context_1.RequestContext.currentTenantId() ?? input.tenantId;
            // Destructure organizationId and the rest of the input data
            const { organizationId, ...data } = input;
            // Retrieve the existing dashboard by ID
            const dashboard = await this.findOneByIdString(id);
            // If the dashboard does not exist, throw a NotFoundException
            if (!dashboard) {
                console.log(`Dashboard with ID ${id} does not exist`);
                throw new common_1.NotFoundException(`Dashboard with ID ${id} does not exist`);
            }
            // Dashboards are personal: only the user who created a dashboard may modify it
            this.checkOwnership(dashboard);
            // When promoting a dashboard to be the default one,
            // demote any other default dashboards of the same user first
            if (input.isDefault === true) {
                await this.resetDefaultDashboards(dashboard);
            }
            // Update the dashboard using the base service's create method
            const updatedDashboard = await super.create({
                ...data,
                tenantId,
                organizationId,
                id
            });
            // Log the update activity
            this._activityLogService.logActivity(contracts_1.BaseEntityEnum.Dashboard, contracts_1.ActionTypeEnum.Updated, contracts_1.ActorTypeEnum.User, updatedDashboard.id, updatedDashboard.name, updatedDashboard, organizationId, tenantId, dashboard, input);
            // Return the updated dashboard
            return updatedDashboard;
        }
        catch (error) {
            // Preserve the original HTTP semantics for ownership violations
            // and missing dashboards (403/404, not a generic 400)
            if (error instanceof common_1.ForbiddenException || error instanceof common_1.NotFoundException) {
                throw error;
            }
            // Log the error and throw an HttpException
            console.error('Error while updating dashboard:', error);
            throw new common_1.HttpException(`Failed to update dashboard: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    /**
     * Deletes a dashboard by ID, ensuring the requesting user owns it.
     *
     * @param id - The unique identifier of the dashboard to delete.
     * @returns The delete result.
     * @throws {ForbiddenException} If the dashboard belongs to another user.
     */
    async delete(id) {
        // Retrieve the existing dashboard by ID
        const dashboard = await this.findOneByIdString(id);
        if (!dashboard) {
            throw new common_1.NotFoundException(`Dashboard with ID ${id} does not exist`);
        }
        // Dashboards are personal: only the user who created a dashboard may delete it
        this.checkOwnership(dashboard);
        return await super.delete(id);
    }
    /**
     * Ensures the current user is the creator of the given dashboard.
     *
     * @param dashboard - The dashboard to verify ownership of.
     * @throws {ForbiddenException} If the dashboard was created by another user.
     */
    checkOwnership(dashboard) {
        const currentUserId = request_context_1.RequestContext.currentUserId();
        // Deny when either identity is missing — an orphaned/legacy dashboard
        // must not become manageable by arbitrary users.
        if (!dashboard.createdByUserId || !currentUserId || dashboard.createdByUserId !== currentUserId) {
            throw new common_1.ForbiddenException('You can only manage your own dashboards');
        }
    }
    /**
     * Demotes all default dashboards of the dashboard's creator (within the same
     * tenant/organization), so that at most one dashboard is default per user.
     *
     * Uses `find` + `save` (via `super.create`) to stay ORM-agnostic (TypeORM/MikroORM).
     *
     * @param dashboard - The dashboard being promoted to default.
     */
    async resetDefaultDashboards(dashboard) {
        const { tenantId, organizationId, createdByUserId, id } = dashboard;
        // Find all other default dashboards of the same user
        const { items: defaults } = await this.findAll({
            where: { tenantId, organizationId, createdByUserId, isDefault: true }
        });
        // Demote each of them (except the one being promoted)
        await Promise.all(defaults
            .filter((item) => item.id !== id)
            .map((item) => super.create({ id: item.id, isDefault: false })));
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_dashboard_repository_1.TypeOrmDashboardRepository,
        mikro_orm_dashboard_repository_1.MikroOrmDashboardRepository,
        activity_log_service_1.ActivityLogService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map