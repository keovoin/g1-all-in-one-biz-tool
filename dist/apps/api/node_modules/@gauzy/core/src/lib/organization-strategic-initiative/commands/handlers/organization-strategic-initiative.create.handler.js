"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationStrategicInitiativeCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const organization_strategic_initiative_create_command_1 = require("../organization-strategic-initiative.create.command");
const organization_strategic_initiative_service_1 = require("../../organization-strategic-initiative.service");
let OrganizationStrategicInitiativeCreateHandler = class OrganizationStrategicInitiativeCreateHandler {
    constructor(_organizationStrategicInitiativeService) {
        this._organizationStrategicInitiativeService = _organizationStrategicInitiativeService;
    }
    /**
     * Executes the create command for an organization strategic initiative.
     *
     * @param command - The create command containing the input data.
     * @returns The created organization strategic initiative.
     */
    async execute(command) {
        const { input } = command;
        return await this._organizationStrategicInitiativeService.create(input);
    }
};
exports.OrganizationStrategicInitiativeCreateHandler = OrganizationStrategicInitiativeCreateHandler;
exports.OrganizationStrategicInitiativeCreateHandler = OrganizationStrategicInitiativeCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(organization_strategic_initiative_create_command_1.OrganizationStrategicInitiativeCreateCommand),
    tslib_1.__metadata("design:paramtypes", [organization_strategic_initiative_service_1.OrganizationStrategicInitiativeService])
], OrganizationStrategicInitiativeCreateHandler);
//# sourceMappingURL=organization-strategic-initiative.create.handler.js.map