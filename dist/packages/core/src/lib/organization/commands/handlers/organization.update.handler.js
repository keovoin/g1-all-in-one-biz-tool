"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationUpdateHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const context_1 = require("../../../core/context");
const organization_service_1 = require("../../organization.service");
const organization_update_command_1 = require("../organization.update.command");
let OrganizationUpdateHandler = class OrganizationUpdateHandler {
    constructor(organizationService) {
        this.organizationService = organizationService;
    }
    /**
     * Executes the organization update operation.
     *
     * @param command This includes the organization's ID and the new data to be updated.
     * @returns A promise that resolves to the updated instance of IOrganization.
     */
    async execute(command) {
        const { input, id } = command;
        return await this.update(id, input);
    }
    /**
     * Updates an organization with the provided input data.
     *
     * @param id The unique identifier of the organization to be updated.
     * @param input The data to update the organization with.
     * @returns The updated organization.
     */
    async update(id, input) {
        const organization = await this.organizationService.findOneByIdString(id);
        if (!organization) {
            throw new common_1.NotFoundException(`Organization with ID ${id} not found.`);
        }
        const tenantId = context_1.RequestContext.currentTenantId() ?? input.tenantId;
        // If any organization is set as default, update others to non-default
        if (input.isDefault) {
            await this.organizationService.update({ tenantId }, { isDefault: false });
        }
        // Simplify boolean assignments and handle optional fields like standardWorkHoursPerDay
        const updateData = {
            ...input,
            show_profits: !!input.show_profits,
            show_bonuses_paid: !!input.show_bonuses_paid,
            show_income: !!input.show_income,
            show_total_hours: !!input.show_total_hours,
            show_projects_count: input.show_projects_count !== false,
            show_minimum_project_size: input.show_minimum_project_size !== false,
            show_clients_count: input.show_clients_count !== false,
            show_clients: input.show_clients !== false,
            show_employees_count: input.show_employees_count !== false,
            ...(input.standardWorkHoursPerDay !== undefined && {
                standardWorkHoursPerDay: input.standardWorkHoursPerDay
            })
        };
        // Creates a new organization or updates an existing one based on the provided data.
        await this.organizationService.create({ ...updateData, id });
        // Return the updated organization entity
        return await this.organizationService.findOneByIdString(id);
    }
};
exports.OrganizationUpdateHandler = OrganizationUpdateHandler;
exports.OrganizationUpdateHandler = OrganizationUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(organization_update_command_1.OrganizationUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [organization_service_1.OrganizationService])
], OrganizationUpdateHandler);
//# sourceMappingURL=organization.update.handler.js.map