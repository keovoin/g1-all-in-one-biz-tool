"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetVideosQueryHandler = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const cqrs_1 = require("@nestjs/cqrs");
const moment = require("moment-timezone");
const typeorm_1 = require("typeorm");
const videos_service_1 = require("../../services/videos.service");
const get_videos_query_1 = require("../get-videos.query");
let GetVideosQueryHandler = class GetVideosQueryHandler {
    constructor(videosService) {
        this.videosService = videosService;
    }
    /**
     * Handles the `GetVideosQuery` to retrieve a paginated list of video entities.
     *
     * @param query - The `GetVideosQuery` containing parameters for pagination and filtering.
     *
     * @returns A promise resolving to a paginated result (`IPagination<IVideo>`), including a list of videos and metadata.
     */
    async execute(query) {
        // Extract pagination and filter parameters from the query
        const { params } = query;
        const { startDate, endDate, tenantId, organizationId, employeeIds = [], timeZone = 'UTC' } = (params || {});
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
        // Fetch paginated videos from the service
        return this.videosService.paginate({
            ...params,
            where: { ...where, ...params.where },
            withDeleted: true
        });
    }
};
exports.GetVideosQueryHandler = GetVideosQueryHandler;
exports.GetVideosQueryHandler = GetVideosQueryHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_videos_query_1.GetVideosQuery),
    tslib_1.__metadata("design:paramtypes", [videos_service_1.VideosService])
], GetVideosQueryHandler);
//# sourceMappingURL=get-videos.handler.js.map