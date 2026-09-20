"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSoundshotsQueryHandler = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const moment = require("moment-timezone");
const typeorm_1 = require("typeorm");
const soundshot_service_1 = require("../../services/soundshot.service");
const get_soundshots_query_1 = require("../get-soundshots.query");
let GetSoundshotsQueryHandler = class GetSoundshotsQueryHandler {
    constructor(soundshotService) {
        this.soundshotService = soundshotService;
    }
    /**
     * Handles the GetSoundshotsQuery and returns a paginated list of soundshots.
     *
     * @param query - The query containing pagination and filtering parameters for soundshots
     * @returns Promise<IPagination<ISoundshot>> A paginated list of soundshots
     */
    async execute(query) {
        // Extract pagination and filter parameters from the query
        const { params } = query;
        const { startDate, endDate, tenantId, organizationId, employeeIds = [], timeZone = 'UTC' } = params;
        // Build the dynamic WHERE clause for the query
        const where = {
            tenantId,
            organizationId
        };
        const hasPermission = core_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE);
        // If the current user doesn't have the permission to select employee, filter by uploadedById
        if (!hasPermission) {
            // If current employee ID is missing, return empty pagination result
            if (!core_1.RequestContext.currentEmployeeId()) {
                return { items: [], total: 0 };
            }
            where.uploadedById = core_1.RequestContext.currentEmployeeId();
        }
        // Add recordedAt only if startDate and endDate are provided
        if (startDate && endDate) {
            // Convert startDate and endDate to UTC based on the provided timeZone
            const startDateUtc = moment.tz(startDate, timeZone).utc().toDate();
            const endDateUtc = moment.tz(endDate, timeZone).utc().toDate();
            // Update the 'recordedAt' property to filter records between the specified dates
            where.recordedAt = (0, typeorm_1.Between)(startDateUtc, endDateUtc);
        }
        // Add employee filter only if employeeIds is provided and non-empty
        if (employeeIds.length > 0 && hasPermission) {
            where.uploadedById = (0, typeorm_1.In)(employeeIds);
        }
        // Fetch paginated soundshots from the service
        return this.soundshotService.paginate({
            ...params,
            where: { ...where, ...params.where },
            withDeleted: true
        });
    }
};
exports.GetSoundshotsQueryHandler = GetSoundshotsQueryHandler;
exports.GetSoundshotsQueryHandler = GetSoundshotsQueryHandler = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    (0, cqrs_1.QueryHandler)(get_soundshots_query_1.GetSoundshotsQuery),
    tslib_1.__metadata("design:paramtypes", [soundshot_service_1.SoundshotService])
], GetSoundshotsQueryHandler);
//# sourceMappingURL=get-soundshots-query.handler.js.map