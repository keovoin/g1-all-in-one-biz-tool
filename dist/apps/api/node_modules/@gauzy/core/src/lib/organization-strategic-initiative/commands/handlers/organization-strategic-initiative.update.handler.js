"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationStrategicInitiativeUpdateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const organization_strategic_initiative_update_command_1 = require("../organization-strategic-initiative.update.command");
const organization_strategic_initiative_service_1 = require("../../organization-strategic-initiative.service");
let OrganizationStrategicInitiativeUpdateHandler = class OrganizationStrategicInitiativeUpdateHandler {
    constructor(_organizationStrategicInitiativeService) {
        this._organizationStrategicInitiativeService = _organizationStrategicInitiativeService;
    }
    /**
     * Executes the update command for an organization strategic initiative.
     *
     * @param command - The update command containing the ID and input data.
     * @returns The updated organization strategic initiative or update result.
     */
    async execute(command) {
        const { id, input } = command;
        return await this._organizationStrategicInitiativeService.update(id, input);
    }
};
exports.OrganizationStrategicInitiativeUpdateHandler = OrganizationStrategicInitiativeUpdateHandler;
exports.OrganizationStrategicInitiativeUpdateHandler = OrganizationStrategicInitiativeUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(organization_strategic_initiative_update_command_1.OrganizationStrategicInitiativeUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [organization_strategic_initiative_service_1.OrganizationStrategicInitiativeService])
], OrganizationStrategicInitiativeUpdateHandler);
//# sourceMappingURL=organization-strategic-initiative.update.handler.js.map