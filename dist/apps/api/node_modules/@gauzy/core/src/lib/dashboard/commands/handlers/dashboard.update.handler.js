"use strict";
var DashboardUpdateHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardUpdateHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const dashboard_service_1 = require("../../dashboard.service");
const dashboard_update_command_1 = require("../dashboard.update.command");
let DashboardUpdateHandler = DashboardUpdateHandler_1 = class DashboardUpdateHandler {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
        this.logger = new common_1.Logger(DashboardUpdateHandler_1.name);
    }
    /**
     * Handles the DashboardUpdateCommand to update an existing dashboard.
     *
     * @param command - The command containing the id and input data for dashboard update.
     * @returns A promise that resolves to the updated dashboard.
     */
    async execute(command) {
        try {
            const { id, input } = command;
            return await this.dashboardService.update(id, input);
        }
        catch (error) {
            this.logger.error('Failed to update dashboard', error.stack);
            // Preserve intentional HTTP semantics from the service
            // (404 unknown id, 403 not owner) instead of flattening to 400.
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(`Error while updating dashboard: ${error.message}`, contracts_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.DashboardUpdateHandler = DashboardUpdateHandler;
exports.DashboardUpdateHandler = DashboardUpdateHandler = DashboardUpdateHandler_1 = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(dashboard_update_command_1.DashboardUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardUpdateHandler);
//# sourceMappingURL=dashboard.update.handler.js.map