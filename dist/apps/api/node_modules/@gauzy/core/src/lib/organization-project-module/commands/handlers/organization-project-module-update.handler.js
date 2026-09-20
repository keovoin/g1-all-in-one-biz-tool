"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationProjectModuleUpdateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const organization_project_module_update_command_1 = require("../organization-project-module-update.command");
const organization_project_module_service_1 = require("../../organization-project-module.service");
let OrganizationProjectModuleUpdateHandler = class OrganizationProjectModuleUpdateHandler {
    constructor(organizationProjectModuleService) {
        this.organizationProjectModuleService = organizationProjectModuleService;
    }
    /**
     * @description Executes the OrganizationProjectModuleUpdateCommand
     * @param {OrganizationProjectModuleUpdateCommand} command  The command containing the Module ID and update data.
     * @returns The updated module.
     * @memberof OrganizationProjectModuleUpdateHandler
     */
    async execute(command) {
        const { id, input } = command;
        return await this.organizationProjectModuleService.update(id, input);
    }
};
exports.OrganizationProjectModuleUpdateHandler = OrganizationProjectModuleUpdateHandler;
exports.OrganizationProjectModuleUpdateHandler = OrganizationProjectModuleUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(organization_project_module_update_command_1.OrganizationProjectModuleUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [organization_project_module_service_1.OrganizationProjectModuleService])
], OrganizationProjectModuleUpdateHandler);
//# sourceMappingURL=organization-project-module-update.handler.js.map