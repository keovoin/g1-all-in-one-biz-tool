"use strict";
var DashboardCreateHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardCreateHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const dashboard_service_1 = require("../../dashboard.service");
const dashboard_create_command_1 = require("../dashboard.create.command");
let DashboardCreateHandler = DashboardCreateHandler_1 = class DashboardCreateHandler {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
        this.logger = new common_1.Logger(DashboardCreateHandler_1.name);
    }
    /**
     * Handles the DashboardCreateCommand to create a new dashboard.
     *
     * @param command - The command containing the input data for dashboard creation.
     * @returns A promise that resolves to the created dashboard.
     */
    async execute(command) {
        try {
            const { input } = command;
            return await this.dashboardService.create(input);
        }
        catch (error) {
            this.logger.error('Failed to create dashboard', error.stack);
            throw new common_1.HttpException(`Error while creating dashboard: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.DashboardCreateHandler = DashboardCreateHandler;
exports.DashboardCreateHandler = DashboardCreateHandler = DashboardCreateHandler_1 = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(dashboard_create_command_1.DashboardCreateCommand),
    tslib_1.__metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardCreateHandler);
//# sourceMappingURL=dashboard.create.handler.js.map