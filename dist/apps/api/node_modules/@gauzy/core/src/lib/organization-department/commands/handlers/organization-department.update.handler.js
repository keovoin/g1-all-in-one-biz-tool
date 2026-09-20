"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationDepartmentUpdateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const organization_department_service_1 = require("../../organization-department.service");
const organization_department_update_command_1 = require("../organization-department.update.command");
let OrganizationDepartmentUpdateHandler = class OrganizationDepartmentUpdateHandler {
    constructor(organizationDepartmentService) {
        this.organizationDepartmentService = organizationDepartmentService;
    }
    /**
     *
     * @param command
     * @returns
     */
    async execute(command) {
        const { id, input } = command;
        //This will call save() with the id so that members[] also get saved accordingly
        return this.organizationDepartmentService.create({ ...input, id });
    }
};
exports.OrganizationDepartmentUpdateHandler = OrganizationDepartmentUpdateHandler;
exports.OrganizationDepartmentUpdateHandler = OrganizationDepartmentUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(organization_department_update_command_1.OrganizationDepartmentUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [organization_department_service_1.OrganizationDepartmentService])
], OrganizationDepartmentUpdateHandler);
//# sourceMappingURL=organization-department.update.handler.js.map