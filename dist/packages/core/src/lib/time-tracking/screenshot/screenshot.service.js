"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreenshotService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const request_context_1 = require("./../../core/context/request-context");
const tenant_aware_crud_service_1 = require("./../../core/crud/tenant-aware-crud.service");
const utils_1 = require("./../../core/utils");
const database_helper_1 = require("../../database/database.helper");
const type_orm_screenshot_repository_1 = require("./repository/type-orm-screenshot.repository");
const mikro_orm_screenshot_repository_1 = require("./repository/mikro-orm-screenshot.repository");
let ScreenshotService = class ScreenshotService extends tenant_aware_crud_service_1.TenantAwareCrudService {
    constructor(typeOrmScreenshotRepository, mikroOrmScreenshotRepository) {
        super(typeOrmScreenshotRepository, mikroOrmScreenshotRepository);
    }
    /**
     * Delete screenshot by ID
     *
     * @param id - The ID of the screenshot to delete
     * @param options - Optional additional conditions for finding the screenshot
     * @returns The deleted screenshot
     * @throws ForbiddenException if the screenshot cannot be found or deleted
     */
    async deleteScreenshot(id, options) {
        try {
            const tenantId = request_context_1.RequestContext.currentTenantId() ?? options.tenantId;
            const { organizationId, forceDelete } = options;
            // Check if the current user has the permission to change the selected employee
            const hasChangeSelectedEmployeePermission = request_context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE);
            let screenshot;
            switch (this.ormType) {
                case utils_1.MultiORMEnum.MikroORM: {
                    const where = { id, tenantId, organizationId };
                    if (!hasChangeSelectedEmployeePermission) {
                        const employeeId = request_context_1.RequestContext.currentEmployeeId();
                        where.timeSlot = { employeeId, tenantId, organizationId };
                    }
                    const item = await this.mikroOrmRepository.findOneOrFail(where);
                    screenshot = this.serialize(item);
                    break;
                }
                case utils_1.MultiORMEnum.TypeORM:
                default: {
                    // Create a query builder for the Screenshot entity
                    const query = this.typeOrmRepository.createQueryBuilder();
                    // Add the WHERE clause to the query
                    query
                        .where((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."id" = :id`), { id })
                        .andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."tenantId" = :tenantId`), { tenantId })
                        .andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationId" = :organizationId`), { organizationId });
                    // Restrict by employeeId if the user doesn't have permission
                    if (!hasChangeSelectedEmployeePermission) {
                        // Get the current employee ID from the request context
                        const employeeId = request_context_1.RequestContext.currentEmployeeId();
                        // Join the timeSlot table and filter by employeeId, tenantId, and organizationId
                        query.leftJoin(`${query.alias}.timeSlot`, 'time_slot', 'time_slot.employeeId = :employeeId AND time_slot.tenantId = :tenantId AND time_slot.organizationId = :organizationId', {
                            employeeId,
                            tenantId,
                            organizationId
                        });
                    }
                    // Find the screenshot
                    screenshot = await query.getOneOrFail();
                    break;
                }
            }
            // Handle force delete or soft delete based on the flag
            if (forceDelete) {
                await this.delete(screenshot.id);
                return screenshot;
            }
            return await this.softRemove(screenshot.id);
        }
        catch (error) {
            throw new common_1.ForbiddenException('You do not have permission to delete this screenshot.');
        }
    }
};
exports.ScreenshotService = ScreenshotService;
exports.ScreenshotService = ScreenshotService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_screenshot_repository_1.TypeOrmScreenshotRepository,
        mikro_orm_screenshot_repository_1.MikroOrmScreenshotRepository])
], ScreenshotService);
//# sourceMappingURL=screenshot.service.js.map