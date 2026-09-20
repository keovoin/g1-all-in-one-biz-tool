"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSoundshotCountQueryHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const core_1 = require("@gauzy/core");
const contracts_1 = require("@gauzy/contracts");
const get_soundshot_count_query_1 = require("../get-soundshot-count.query");
const soundshot_service_1 = require("../../services/soundshot.service");
/**
 * Query handler for retrieving the count of soundshot entities.
 *
 * This handler processes the `GetSoundshotCountQuery` to count the number of soundshot entities
 * based on the provided query options.
 */
let GetSoundshotCountQueryHandler = class GetSoundshotCountQueryHandler {
    constructor(soundshotService) {
        this.soundshotService = soundshotService;
    }
    /**
     * Handles the `GetSoundshotCountQuery` to retrieve the count of soundshot entities.
     *
     * @param query - The `GetSoundshotCountQuery` containing the filter options for counting soundshot entities.
     *
     * @returns A promise resolving to the count of soundshot entities (`number`).
     *
     */
    async execute(query) {
        // Destructure the query to extract the soundshot ID and options
        const { options } = query || {};
        // Fetch the soundshot entity from the database
        const { organizationId, tenantId } = options;
        // Check if the current user has the permission
        const permission = core_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE);
        // If permission is not available and current employee ID is missing, return 0
        if (!permission && !core_1.RequestContext.currentEmployeeId()) {
            return 0;
        }
        // Fetch the count of soundshot entities from the database
        return this.soundshotService.count({
            where: {
                ...(!permission && { uploadedById: core_1.RequestContext.currentEmployeeId() }),
                organizationId,
                tenantId
            }
        });
    }
};
exports.GetSoundshotCountQueryHandler = GetSoundshotCountQueryHandler;
exports.GetSoundshotCountQueryHandler = GetSoundshotCountQueryHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_soundshot_count_query_1.GetSoundshotCountQuery),
    tslib_1.__metadata("design:paramtypes", [soundshot_service_1.SoundshotService])
], GetSoundshotCountQueryHandler);
//# sourceMappingURL=get-soundshot-count-query.handler.js.map