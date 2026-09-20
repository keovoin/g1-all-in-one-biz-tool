import { IInvite, IOrganizationCreateInput } from '@gauzy/contracts';
import { CommandBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateResult } from 'typeorm';
import { AuthService } from '../../../auth/auth.service';
import { OrganizationContactService } from '../../../organization-contact/organization-contact.service';
import { OrganizationService } from '../../../organization/organization.service';
import { RoleService } from '../../../role/role.service';
import { TenantService } from '../../../tenant/tenant.service';
import { InviteService } from '../../invite.service';
import { InviteAcceptOrganizationContactCommand } from '../invite.accept-organization-contact.command';
/**
 * Columns of the organization (and of its nested `contact`) that identify or own an EXISTING row.
 *
 * `POST /invite/contact` is public and `OrganizationService.create()` ends in a repository `save()`:
 * a body `id` turns that save into an UPDATE of somebody else's organization — re-parenting it into
 * the tenant this acceptance provisions — and the foreign-key pointers would attach the new
 * organization to another tenant's contact or image asset.
 */
export declare const CONTACT_ORGANIZATION_OWNED_FIELDS: readonly ["id", "tenant", "tenantId", "contactId", "image", "imageId", "createdByUserId", "updatedByUserId", "deletedByUserId", "deletedAt", "archivedAt"];
/**
 * Returns a copy of the body-supplied organization with the owned columns removed, at the top level
 * and inside `contact`. Never mutates its argument.
 *
 * @param contactOrganization The organization-creation form output from the request body.
 * @returns The same data minus {@link CONTACT_ORGANIZATION_OWNED_FIELDS}.
 */
export declare function sanitizeContactOrganization(contactOrganization: IOrganizationCreateInput): IOrganizationCreateInput;
export declare class InviteAcceptOrganizationContactHandler implements ICommandHandler<InviteAcceptOrganizationContactCommand> {
    private readonly inviteService;
    private readonly authService;
    private readonly organizationService;
    private readonly organizationContactService;
    private readonly tenantService;
    private readonly roleService;
    private readonly commandBus;
    constructor(inviteService: InviteService, authService: AuthService, organizationService: OrganizationService, organizationContactService: OrganizationContactService, tenantService: TenantService, roleService: RoleService, commandBus: CommandBus);
    execute(command: InviteAcceptOrganizationContactCommand): Promise<IInvite | UpdateResult>;
}
