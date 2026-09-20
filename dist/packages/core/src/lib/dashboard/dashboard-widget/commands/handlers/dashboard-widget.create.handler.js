"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardWidgetCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const dashboard_widget_service_1 = require("../../dashboard-widget.service");
const dashboard_widget_create_command_1 = require("../dashboard-widget.create.command");
let DashboardWidgetCreateHandler = class DashboardWidgetCreateHandler {
    constructor(dashboardWidgetService) {
        this.dashboardWidgetService = dashboardWidgetService;
    }
    /**
     * Handles the DashboardWidgetCreateCommand to create a new dashboard widget.
     *
     * @param command - The command containing the input data for dashboard widget creation.
     * @returns A promise that resolves to the created dashboard widget.
     */
    async execute(command) {
        const { input } = command;
        return this.dashboardWidgetService.create(input);
    }
};
exports.DashboardWidgetCreateHandler = DashboardWidgetCreateHandler;
exports.DashboardWidgetCreateHandler = DashboardWidgetCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(dashboard_widget_create_command_1.DashboardWidgetCreateCommand),
    tslib_1.__metadata("design:paramtypes", [dashboard_widget_service_1.DashboardWidgetService])
], DashboardWidgetCreateHandler);
//# sourceMappingURL=dashboard-widget.create.handler.js.map