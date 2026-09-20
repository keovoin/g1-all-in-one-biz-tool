"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardWidgetUpdateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const dashboard_widget_service_1 = require("../../dashboard-widget.service");
const dashboard_widget_update_command_1 = require("../dashboard-widget.update.command");
let DashboardWidgetUpdateHandler = class DashboardWidgetUpdateHandler {
    constructor(dashboardWidgetService) {
        this.dashboardWidgetService = dashboardWidgetService;
    }
    /**
     * Handles the DashboardWidgetUpdateCommand to update an existing dashboard widget.
     *
     * @param command - The command containing the id and input data for dashboard widget update.
     * @returns A promise that resolves to the updated dashboard widget.
     */
    async execute(command) {
        const { id, input } = command;
        return this.dashboardWidgetService.update(id, input);
    }
};
exports.DashboardWidgetUpdateHandler = DashboardWidgetUpdateHandler;
exports.DashboardWidgetUpdateHandler = DashboardWidgetUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(dashboard_widget_update_command_1.DashboardWidgetUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [dashboard_widget_service_1.DashboardWidgetService])
], DashboardWidgetUpdateHandler);
//# sourceMappingURL=dashboard-widget.update.handler.js.map