"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportOrganizationCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const report_organization_create_command_1 = require("../report-organization-create.command");
const report_organization_service_1 = require("../../report-organization.service");
let ReportOrganizationCreateHandler = class ReportOrganizationCreateHandler {
    constructor(_reportOrganizationService) {
        this._reportOrganizationService = _reportOrganizationService;
    }
    /**
     * Executes the creation of multiple report organization entries.
     *
     * @param event The event containing input data for creating report organization entries.
     * @returns A promise that resolves to the result of bulk creation of report organization entries.
     */
    async execute(event) {
        try {
            const { input } = event;
            return await this._reportOrganizationService.bulkCreateOrganizationReport(input);
        }
        catch (error) {
            console.error(`Error occurred while executing bulk creation of report organization entries: ${error.message}`);
        }
    }
};
exports.ReportOrganizationCreateHandler = ReportOrganizationCreateHandler;
exports.ReportOrganizationCreateHandler = ReportOrganizationCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(report_organization_create_command_1.ReportOrganizationCreateCommand),
    tslib_1.__metadata("design:paramtypes", [report_organization_service_1.ReportOrganizationService])
], ReportOrganizationCreateHandler);
//# sourceMappingURL=report-organization.create.handler.js.map