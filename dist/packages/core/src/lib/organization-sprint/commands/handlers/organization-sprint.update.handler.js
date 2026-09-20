"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationSprintUpdateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const organization_sprint_service_1 = require("../../organization-sprint.service");
const organization_sprint_update_command_1 = require("../organization-sprint.update.command");
let OrganizationSprintUpdateHandler = class OrganizationSprintUpdateHandler {
    constructor(organizationSprintService) {
        this.organizationSprintService = organizationSprintService;
    }
    async execute(command) {
        const { id, input } = command;
        // Update the organization sprint using the provided input
        await this.organizationSprintService.update(id, input);
        // Find the updated organization project by ID
        return await this.organizationSprintService.findOneByIdString(id);
    }
};
exports.OrganizationSprintUpdateHandler = OrganizationSprintUpdateHandler;
exports.OrganizationSprintUpdateHandler = OrganizationSprintUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(organization_sprint_update_command_1.OrganizationSprintUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [organization_sprint_service_1.OrganizationSprintService])
], OrganizationSprintUpdateHandler);
//# sourceMappingURL=organization-sprint.update.handler.js.map