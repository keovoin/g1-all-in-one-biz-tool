import { ICommandHandler } from '@nestjs/cqrs';
import { IOrganizationContact } from '@gauzy/contracts';
import { UserService } from '../../../user/user.service';
import { InviteOrganizationContactCommand } from '../invite.organization-contact.command';
import { OrganizationContactService } from '../../../organization-contact/organization-contact.service';
import { InviteService } from '../../invite.service';
import { RoleService } from '../../../role/role.service';
/**
 * Sends an invitation email to the organization organizationContact's primaryEmail
 */
export declare class InviteOrganizationContactHandler implements ICommandHandler<InviteOrganizationContactCommand> {
    private readonly organizationContactService;
    private readonly inviteService;
    private readonly userService;
    private readonly roleService;
    constructor(organizationContactService: OrganizationContactService, inviteService: InviteService, userService: UserService, roleService: RoleService);
    /**
     * Executes the InviteOrganizationContactCommand by validating the organization contact,
     * checking for existing users, creating an invite, and updating the invite status.
     *
     * @param command - The command containing the necessary input data.
     * @returns The updated organization contact with the invite status set to 'INVITED'.
     * @throws InternalServerErrorException if required conditions are not met.
     */
    execute(command: InviteOrganizationContactCommand): Promise<IOrganizationContact>;
    /**
     * This function is used to make sure we are not sending an invitation email to a user that
     * exists for the same tenant.
     *
     * Despite its name and its `tenantId` argument, this check used to run the GLOBAL
     * `getUserByEmail` lookup and ignore the tenant entirely, so a user of ANY OTHER tenant holding
     * the contact's address answered "already exists". That was both a cross-tenant existence
     * oracle — the caller learns, from a distinguishable error, that some unrelated tenant has an
     * account with that email — and a functional bug, because it blocked a perfectly legitimate
     * contact invitation.
     *
     * @param email Email address of the user to check
     * @param tenantId Tenant id of the contact organization
     */
    private userExistsForSameTenant;
}
