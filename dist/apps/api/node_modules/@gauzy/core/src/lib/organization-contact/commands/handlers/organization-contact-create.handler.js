"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationContactCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const utils_1 = require("@gauzy/utils");
const context_1 = require("../../../core/context");
const organization_contact_create_command_1 = require("../organization-contact-create.command");
const organization_contact_service_1 = require("../../organization-contact.service");
const organization_project_service_1 = require("../../../organization-project/organization-project.service");
const contact_service_1 = require("../../../contact/contact.service");
let OrganizationContactCreateHandler = class OrganizationContactCreateHandler {
    constructor(_organizationContactService, _organizationProjectService, _contactService) {
        this._organizationContactService = _organizationContactService;
        this._organizationProjectService = _organizationProjectService;
        this._contactService = _contactService;
    }
    /**
     * Executes the creation of an organization contact.
     *
     * @param command An instance of OrganizationContactCreateCommand containing the necessary input for creating a new organization contact.
     * @returns A promise that resolves to the newly created organization contact (IOrganizationContact).
     */
    async execute(command) {
        try {
            const { input } = command;
            const organizationId = input.organizationId;
            const tenantId = context_1.RequestContext.currentTenantId() ?? input.tenantId;
            // If members are empty and projects are provided, populate members from projects
            if ((0, utils_1.isEmpty)(input.members) && (0, utils_1.isNotEmpty)(input.projects)) {
                const projectIds = input.projects.map((project) => project.id);
                // Retrieve projects with specified IDs, belonging to the given organization and tenant.
                const projects = await this._organizationProjectService.find({
                    where: {
                        id: (0, typeorm_1.In)(projectIds),
                        organization: { id: organizationId },
                        tenantId
                    },
                    relations: { members: true }
                });
                // Extract all project employees
                const projectEmployees = projects.flatMap((project) => project.members);
                // Map each project employee to IEmployee
                const projectMembers = await Promise.all(projectEmployees
                    .flatMap((projectEmployee) => projectEmployee.employee)
                    .map((employee) => employee));
                // Assign to input.members, ensuring input.members is initialized
                input.members = [...(input.members || []), ...projectMembers];
            }
            // Create contact details of organization
            try {
                input.contact = await this._contactService.create({
                    ...input.contact,
                    organizationId,
                    tenantId,
                    organization: { id: organizationId },
                    tenant: { id: tenantId }
                });
            }
            catch (error) {
                throw new common_1.BadRequestException('Failed to create contact details', error.message);
            }
            // Create a new organization contact with the modified input
            return await this._organizationContactService.create({
                ...input,
                organizationId,
                organization: { id: organizationId },
                tenantId,
                tenant: { id: tenantId }
            });
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to create organization contact', error.message);
        }
    }
};
exports.OrganizationContactCreateHandler = OrganizationContactCreateHandler;
exports.OrganizationContactCreateHandler = OrganizationContactCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(organization_contact_create_command_1.OrganizationContactCreateCommand),
    tslib_1.__metadata("design:paramtypes", [organization_contact_service_1.OrganizationContactService,
        organization_project_service_1.OrganizationProjectService,
        contact_service_1.ContactService])
], OrganizationContactCreateHandler);
//# sourceMappingURL=organization-contact-create.handler.js.map