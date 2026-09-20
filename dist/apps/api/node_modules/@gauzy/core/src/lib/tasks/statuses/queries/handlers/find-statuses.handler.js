"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindStatusesHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const status_service_1 = require("../../status.service");
const find_statuses_query_1 = require("../find-statuses.query");
let FindStatusesHandler = class FindStatusesHandler {
    constructor(taskStatusService) {
        this.taskStatusService = taskStatusService;
    }
    /**
     * Executes a query to find task statuses with pagination options.
     * @param query - The FindStatusesQuery containing search criteria and pagination options.
     * @returns A promise of paginated results with task statuses.
     */
    async execute(query) {
        try {
            const { options } = query;
            // Fetch all task statuses based on the query options
            return await this.taskStatusService.fetchAll(options);
        }
        catch (error) {
            // Handle errors and return appropriate error response
            throw new common_1.BadRequestException('An error occurred while fetching task statuses. Please check your query parameters.');
        }
    }
};
exports.FindStatusesHandler = FindStatusesHandler;
exports.FindStatusesHandler = FindStatusesHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(find_statuses_query_1.FindStatusesQuery),
    tslib_1.__metadata("design:paramtypes", [status_service_1.TaskStatusService])
], FindStatusesHandler);
//# sourceMappingURL=find-statuses.handler.js.map