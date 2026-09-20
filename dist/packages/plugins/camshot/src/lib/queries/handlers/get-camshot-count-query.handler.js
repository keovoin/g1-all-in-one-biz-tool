"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCamshotCountQueryHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const core_1 = require("@gauzy/core");
const contracts_1 = require("@gauzy/contracts");
const get_camshot_count_query_1 = require("../get-camshot-count.query");
const camshot_service_1 = require("../../services/camshot.service");
/**
 * Query handler for retrieving the count of camshot entities.
 *
 * This handler processes the `GetCamshotCountQuery` to count the number of camshot entities
 * based on the provided query options.
 */
let GetCamshotCountQueryHandler = class GetCamshotCountQueryHandler {
    constructor(camshotService) {
        this.camshotService = camshotService;
    }
    /**
     * Handles the `GetCamshotCountQuery` to retrieve the count of camshot entities.
     *
     * @param query - The `GetCamshotCountQuery` containing the filter options for counting camshot entities.
     *
     * @returns A promise resolving to the count of camshot entities (`number`).
     *
     */
    async execute(query) {
        // Destructure the query to extract the camshot ID and options
        const { options } = query || {};
        // Fetch the camshot entity from the database
        const { organizationId, tenantId } = options;
        // Check if the current user has the permission
        const permission = core_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE);
        // Without the permission the caller only counts their own camshots — and a caller with no
        // employee identity counts none (same guard as the soundshot sibling; a null uploadedById used
        // to be dropped from the SQL and return the organization-wide count).
        if (!permission && !core_1.RequestContext.currentEmployeeId()) {
            return 0;
        }
        // Fetch the count of camshot entities from the database
        return this.camshotService.count({
            where: {
                ...(!permission && { uploadedById: core_1.RequestContext.currentEmployeeId() }),
                organizationId,
                tenantId
            }
        });
    }
};
exports.GetCamshotCountQueryHandler = GetCamshotCountQueryHandler;
exports.GetCamshotCountQueryHandler = GetCamshotCountQueryHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_camshot_count_query_1.GetCamshotCountQuery),
    tslib_1.__metadata("design:paramtypes", [camshot_service_1.CamshotService])
], GetCamshotCountQueryHandler);
//# sourceMappingURL=get-camshot-count-query.handler.js.map