import { ID, IOrganizationContactAcceptInviteInput, IOrganizationCreateInput, IUser } from '@gauzy/contracts';
/**
 * Accept organization-contact invite request DTO validation (`POST /invite/contact`).
 *
 * The route is `@Public()` and used to bind the raw contract interface with no pipe, so the whole
 * body reached `AuthService.register()`. Its `user` object was spread into the new account, and
 * `User.organizations` is a `cascade: true` relation: `user.organizations: [{ organizationId, tenantId }]`
 * would have been inserted as real memberships of ANY organization the caller could name.
 *
 * `user` is therefore whitelisted with the same profile-only class as `/invite/accept`; its `email`,
 * `role` and `tenant` are dropped here and re-supplied by `InviteAcceptOrganizationContactHandler`
 * from the invitation and from the tenant it provisions. `originalUrl` is not accepted from the body
 * either — the controller sets it from the `Origin` header after the pipe has run.
 *
 * `contactOrganization` is the organization-creation form's full output (organization settings and
 * flattened contact/address fields), so it is only shape-checked here. The handler strips the
 * identity and ownership columns from it before anything is persisted.
 */
export declare class AcceptOrganizationContactInviteDTO implements IOrganizationContactAcceptInviteInput {
    /** The invitation being accepted; claimed atomically by the handler before any write. */
    readonly inviteId: ID;
    /**
     * Password for the account this acceptance creates. Always a NEW account in a NEW tenant, so it
     * is required; the minimum matches the accept-client-invite form's own validator.
     */
    readonly password: string;
    /** Profile fields only — see {@link AcceptInviteUserDTO}. */
    readonly user: IUser;
    /** The organization to provision for the contact; sanitized by the handler before persisting. */
    readonly contactOrganization: IOrganizationCreateInput;
}
