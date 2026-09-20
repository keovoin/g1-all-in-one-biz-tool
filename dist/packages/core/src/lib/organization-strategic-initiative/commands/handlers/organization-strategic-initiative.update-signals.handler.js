"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationStrategicInitiativeUpdateSignalsHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const organization_strategic_initiative_update_signals_command_1 = require("../organization-strategic-initiative.update-signals.command");
const organization_strategic_initiative_service_1 = require("../../organization-strategic-initiative.service");
let OrganizationStrategicInitiativeUpdateSignalsHandler = class OrganizationStrategicInitiativeUpdateSignalsHandler {
    constructor(_organizationStrategicInitiativeService) {
        this._organizationStrategicInitiativeService = _organizationStrategicInitiativeService;
    }
    /**
     * Executes the update signals command for an organization strategic initiative.
     *
     * @param command - The command containing the ID and signals data.
     * @returns The updated organization strategic initiative.
     */
    async execute(command) {
        const { id, signals } = command;
        return await this._organizationStrategicInitiativeService.updateSignals(id, signals);
    }
};
exports.OrganizationStrategicInitiativeUpdateSignalsHandler = OrganizationStrategicInitiativeUpdateSignalsHandler;
exports.OrganizationStrategicInitiativeUpdateSignalsHandler = OrganizationStrategicInitiativeUpdateSignalsHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(organization_strategic_initiative_update_signals_command_1.OrganizationStrategicInitiativeUpdateSignalsCommand),
    tslib_1.__metadata("design:paramtypes", [organization_strategic_initiative_service_1.OrganizationStrategicInitiativeService])
], OrganizationStrategicInitiativeUpdateSignalsHandler);
//# sourceMappingURL=organization-strategic-initiative.update-signals.handler.js.map