"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationProjectModuleCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const organization_project_module_create_command_1 = require("../organization-project-module-create.command");
const organization_project_module_service_1 = require("../../organization-project-module.service");
let OrganizationProjectModuleCreateHandler = class OrganizationProjectModuleCreateHandler {
    constructor(organizationProjectModuleService) {
        this.organizationProjectModuleService = organizationProjectModuleService;
    }
    /**
     * @description Executes the OrganizationProjectModuleCreateCommand
     * @param {OrganizationProjectModuleCreateCommand} command  The command containing the Module create data.
     * @returns The created module.
     * @memberof OrganizationProjectModuleCreateHandler
     */
    async execute(command) {
        const { input } = command;
        return await this.organizationProjectModuleService.create(input);
    }
};
exports.OrganizationProjectModuleCreateHandler = OrganizationProjectModuleCreateHandler;
exports.OrganizationProjectModuleCreateHandler = OrganizationProjectModuleCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(organization_project_module_create_command_1.OrganizationProjectModuleCreateCommand),
    tslib_1.__metadata("design:paramtypes", [organization_project_module_service_1.OrganizationProjectModuleService])
], OrganizationProjectModuleCreateHandler);
//# sourceMappingURL=organization-project-module-create.handler.js.map