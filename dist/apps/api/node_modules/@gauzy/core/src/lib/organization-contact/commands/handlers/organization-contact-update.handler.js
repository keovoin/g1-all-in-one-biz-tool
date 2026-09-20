"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationContactUpdateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const organization_contact_update_command_1 = require("../organization-contact-update.command");
const organization_contact_service_1 = require("../../organization-contact.service");
const contact_service_1 = require("../../../contact/contact.service");
let OrganizationContactUpdateHandler = class OrganizationContactUpdateHandler {
    constructor(_organizationContactService, _contactService) {
        this._organizationContactService = _organizationContactService;
        this._contactService = _contactService;
    }
    /**
     * Updates an organization contact based on a given command and retrieves the updated contact.
     *
     * @param command Contains the ID and new data for updating the organization contact.
     * @returns A Promise resolving to the updated organization contact.
     * @throws BadRequestException for any errors during the update process.
     */
    async execute(command) {
        try {
            const { id, input } = command;
            // Destructure organizationId from the input, and get tenantId either from the current RequestContext or from the input.
            let { organizationId } = input;
            // Create/Update contact details of created organization
            try {
                input.contact = await this._contactService.create({
                    ...input.contact,
                    organization: { id: organizationId }
                });
            }
            catch (error) {
                console.log('Error occurred during creation of contact details or creating the organization contact:', error);
            }
            // Update the organization contact using the provided ID and input data.
            await this._organizationContactService.create({
                ...input,
                id
            });
            // Retrieve and return the updated organization contact.
            return this._organizationContactService.findOneByIdString(id);
        }
        catch (error) {
            // Re-throw the error as a BadRequestException.
            throw new common_1.BadRequestException(error);
        }
    }
};
exports.OrganizationContactUpdateHandler = OrganizationContactUpdateHandler;
exports.OrganizationContactUpdateHandler = OrganizationContactUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(organization_contact_update_command_1.OrganizationContactUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [organization_contact_service_1.OrganizationContactService,
        contact_service_1.ContactService])
], OrganizationContactUpdateHandler);
//# sourceMappingURL=organization-contact-update.handler.js.map