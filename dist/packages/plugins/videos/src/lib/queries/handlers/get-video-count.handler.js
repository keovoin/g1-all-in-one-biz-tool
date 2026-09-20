"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetVideoCountQueryHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const videos_service_1 = require("../../services/videos.service");
const get_video_count_query_1 = require("../get-video-count.query");
const core_1 = require("@gauzy/core");
const contracts_1 = require("@gauzy/contracts");
const common_1 = require("@nestjs/common");
/**
 * Handler for the `GetVideoCountQuery` that retrieves the count of video entities
 * based on the provided query parameters and user permissions.
 */
let GetVideoCountQueryHandler = class GetVideoCountQueryHandler {
    /**
     * Constructs the `GetVideoCountQueryHandler`.
     *
     * @param videosService - The service responsible for video-related operations.
     */
    constructor(videosService) {
        this.videosService = videosService;
    }
    /**
     * Executes the `GetVideoCountQuery` to retrieve the count of video entities.
     *
     * Validates the query, checks user permissions, builds appropriate where conditions,
     * and returns the count of matching video records.
     *
     * @param query - The `GetVideoCountQuery` containing the query options.
     * @returns A Promise that resolves to the count of video entities.
     * @throws {BadRequestException} If query options are invalid or required parameters are missing.
     */
    async execute(query) {
        // Validate the query parameters
        this.validateQuery(query);
        // Extract required parameters from query options
        const { organizationId, tenantId } = query.options;
        // Check if user has permission to view all videos or just their own
        const hasPermission = core_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE);
        // Build where conditions based on permissions and query parameters
        const whereConditions = this.buildWhereConditions(organizationId, tenantId, hasPermission);
        // Return the count of videos matching the conditions
        return this.videosService.count({ where: whereConditions });
    }
    /**
     * Validates the query parameters to ensure all required fields are present.
     *
     * @param query - The `GetVideoCountQuery` to validate.
     * @throws {BadRequestException} If any required parameter is missing.
     */
    validateQuery(query) {
        if (!query?.options) {
            throw new common_1.BadRequestException('Query options are required');
        }
        if (!query.options.organizationId) {
            throw new common_1.BadRequestException('Organization ID is required');
        }
        if (!query.options.tenantId) {
            throw new common_1.BadRequestException('Tenant ID is required');
        }
    }
    /**
     * Builds the where conditions for the video count query based on organization,
     * tenant, and user permissions.
     *
     * @param organizationId - The ID of the organization to filter videos by.
     * @param tenantId - The ID of the tenant to filter videos by.
     * @param hasPermission - Boolean indicating if user has permission to view all videos.
     * @returns An object containing the where conditions for the query.
     * @throws {BadRequestException} If current employee ID cannot be determined for restricted access.
     */
    buildWhereConditions(organizationId, tenantId, hasPermission) {
        // Base conditions that always apply
        const conditions = {
            organizationId,
            tenantId
        };
        // If user doesn't have permission to view all videos, restrict to their own uploads
        if (!hasPermission) {
            const currentEmployeeId = core_1.RequestContext.currentEmployeeId();
            if (!currentEmployeeId) {
                throw new common_1.BadRequestException('Unable to determine current employee');
            }
            conditions.uploadedById = currentEmployeeId;
        }
        return conditions;
    }
};
exports.GetVideoCountQueryHandler = GetVideoCountQueryHandler;
exports.GetVideoCountQueryHandler = GetVideoCountQueryHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_video_count_query_1.GetVideoCountQuery),
    tslib_1.__metadata("design:paramtypes", [videos_service_1.VideosService])
], GetVideoCountQueryHandler);
//# sourceMappingURL=get-video-count.handler.js.map