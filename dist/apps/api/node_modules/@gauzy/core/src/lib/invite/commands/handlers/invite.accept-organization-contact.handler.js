"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InviteAcceptOrganizationContactHandler = exports.CONTACT_ORGANIZATION_OWNED_FIELDS = void 0;
exports.sanitizeContactOrganization = sanitizeContactOrganization;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const cqrs_1 = require("@nestjs/cqrs");
const commands_1 = require("./../../../tenant/commands");
const auth_service_1 = require("../../../auth/auth.service");
const organization_contact_service_1 = require("../../../organization-contact/organization-contact.service");
const organization_service_1 = require("../../../organization/organization.service");
const commands_2 = require("../../../role/commands");
const role_service_1 = require("../../../role/role.service");
const tenant_service_1 = require("../../../tenant/tenant.service");
const invite_service_1 = require("../../invite.service");
const invite_accept_organization_contact_command_1 = require("../invite.accept-organization-contact.command");
const commands_3 = require("./../../../reports/commands");
/**
 * Columns of the organization (and of its nested `contact`) that identify or own an EXISTING row.
 *
 * `POST /invite/contact` is public and `OrganizationService.create()` ends in a repository `save()`:
 * a body `id` turns that save into an UPDATE of somebody else's organization — re-parenting it into
 * the tenant this acceptance provisions — and the foreign-key pointers would attach the new
 * organization to another tenant's contact or image asset.
 */
exports.CONTACT_ORGANIZATION_OWNED_FIELDS = [
    'id',
    'tenant',
    'tenantId',
    'contactId',
    'image',
    'imageId',
    'createdByUserId',
    'updatedByUserId',
    'deletedByUserId',
    'deletedAt',
    'archivedAt'
];
/**
 * Returns a copy of the body-supplied organization with the owned columns removed, at the top level
 * and inside `contact`. Never mutates its argument.
 *
 * @param contactOrganization The organization-creation form output from the request body.
 * @returns The same data minus {@link CONTACT_ORGANIZATION_OWNED_FIELDS}.
 */
function sanitizeContactOrganization(contactOrganization) {
    const omitOwned = (source) => {
        const copy = { ...source };
        for (const field of exports.CONTACT_ORGANIZATION_OWNED_FIELDS) {
            delete copy[field];
        }
        return copy;
    };
    const sanitized = omitOwned((contactOrganization ?? {}));
    const { contact } = sanitized;
    if (contact && typeof contact === 'object' && !Array.isArray(contact)) {
        sanitized['contact'] = omitOwned(contact);
    }
    else {
        delete sanitized['contact'];
    }
    return sanitized;
}
let InviteAcceptOrganizationContactHandler = class InviteAcceptOrganizationContactHandler {
    constructor(inviteService, authService, organizationService, organizationContactService, tenantService, roleService, commandBus) {
        this.inviteService = inviteService;
        this.authService = authService;
        this.organizationService = organizationService;
        this.organizationContactService = organizationContactService;
        this.tenantService = tenantService;
        this.roleService = roleService;
        this.commandBus = commandBus;
    }
    async execute(command) {
        const { input: { user, password, inviteId, originalUrl }, languageCode } = command;
        let { contactOrganization } = command.input;
        // 0. Claim the invite BEFORE creating anything — see InviteService.claimInvite. This handler
        // provisions a whole tenant, organization and user account, so two parallel acceptances of
        // one invite would otherwise build two of each. The conditional flip to ACCEPTED is the
        // only thing that serializes them, and it has to happen ahead of the first side effect.
        if (!(await this.inviteService.claimInvite(inviteId))) {
            throw new common_1.ConflictException('Invite has already been accepted');
        }
        // 0.1 Read the invitation now, before provisioning anything: it decides which address the
        // account is created for, and a claimed id that is not an organization-contact invite must
        // stop here rather than after a tenant, organization and roles have been committed. Nothing
        // has been written yet on this path, so the claim is handed back: otherwise anyone holding a
        // team-member invite id could burn that invitation through this public route.
        let invite;
        let organizationContact;
        try {
            invite = await this.inviteService.findOneByIdString(inviteId, {
                relations: {
                    organizationContacts: true
                }
            });
            // TODO Make invite and contact as one to one, since an invite is not shared by multiple contacts
            [organizationContact] = invite?.organizationContacts ?? [];
            if (!organizationContact) {
                throw new common_1.BadRequestException('Invite is not an organization contact invite');
            }
        }
        catch (error) {
            await this.inviteService.releaseInvite(inviteId);
            throw error;
        }
        try {
            // 0.2 Nothing that identifies or owns an EXISTING row may come from this public body.
            contactOrganization = sanitizeContactOrganization(contactOrganization);
            // 1. Create new tenant for the contact
            const { name } = contactOrganization;
            const tenant = await this.tenantService.create({
                name
            });
            // 2. Create Role and Role Permissions for contact
            await this.commandBus.execute(new commands_2.TenantRoleBulkCreateCommand([tenant]));
            // 3. Create Enabled/Disabled features for relative tenants.
            await this.commandBus.execute(new commands_1.TenantFeatureOrganizationCreateCommand([tenant]));
            const { contact: contactInput = {}, ...organizationInput } = contactOrganization;
            let contact = contactInput;
            // 4. Create Organization for the contact
            const organization = await this.organizationService.create({
                ...organizationInput,
                tenant
            });
            // 5. Create Enabled/Disabled reports for relative organization.
            await this.commandBus.execute(new commands_3.ReportOrganizationCreateCommand(organization));
            // 6. Create contact details of created organization
            const { id: organizationId } = organization;
            const { id: tenantId } = tenant;
            contact = Object.assign({}, contact, {
                organizationId,
                tenantId
            });
            await this.organizationService.create({
                contact,
                ...organization
            });
            // 7. Find SUPER_ADMIN role to relative tenant.
            const role = await this.roleService.findOneByWhereOptions({
                tenantId,
                name: contracts_1.RolesEnum.SUPER_ADMIN
            });
            // 8. Create user account for contact and link role, tenant and organization
            await this.authService.register({
                user: {
                    ...user,
                    // The invited address, never a body-supplied one (register may auto-verify it).
                    email: invite.email,
                    tenant,
                    role
                },
                password,
                originalUrl,
                organizationId,
                inviteId
            }, languageCode);
            // 8. Link newly created contact organization to organization contact invite
            const { id: organizationContactId } = organizationContact;
            await this.organizationContactService.update(organizationContactId, {
                tenant,
                organization,
                inviteStatus: contracts_1.ContactOrganizationInviteStatus.ACCEPTED
            });
            // Keep the original return shape. Re-reading the invite here would serialize the whole
            // row — including its token — back to an unauthenticated caller on this public endpoint.
            // The status write is redundant now that the claim above owns it, but it is idempotent
            // and preserves exactly what callers of this handler received before.
            return await this.inviteService.update(inviteId, {
                status: contracts_1.InviteStatusEnum.ACCEPTED
            });
        }
        catch (error) {
            // Deliberately do NOT release the invite here. Unlike the find-or-create handlers, this
            // one provisions a whole tenant, organization and role in separate un-rolled-back writes;
            // by the time a later step throws, those records are already committed. Returning to INVITED
            // would let a retry provision a SECOND tenant for the same contact. Leaving it ACCEPTED
            // blocks that — recovering a half-provisioned contact is a deliberate admin action, which
            // is the safe default for orphaned provisioning and strictly safer than the pre-claim
            // behaviour, where a failure left the invite INVITED and every retry re-provisioned.
            throw error;
        }
    }
};
exports.InviteAcceptOrganizationContactHandler = InviteAcceptOrganizationContactHandler;
exports.InviteAcceptOrganizationContactHandler = InviteAcceptOrganizationContactHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(invite_accept_organization_contact_command_1.InviteAcceptOrganizationContactCommand),
    tslib_1.__metadata("design:paramtypes", [invite_service_1.InviteService,
        auth_service_1.AuthService,
        organization_service_1.OrganizationService,
        organization_contact_service_1.OrganizationContactService,
        tenant_service_1.TenantService,
        role_service_1.RoleService,
        cqrs_1.CommandBus])
], InviteAcceptOrganizationContactHandler);
//# sourceMappingURL=invite.accept-organization-contact.handler.js.map