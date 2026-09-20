import { IInvite, InviteStatusEnum, IOrganizationDepartment, IOrganizationContact, IOrganizationProject, IUser, IRole, IOrganizationTeam, ID } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class Invite extends TenantOrganizationBaseEntity implements IInvite {
    /**
     * Invite Token
     */
    /** Live invite bearer token — anyone holding it can accept the invite. */
    token: string;
    /**
     * Invited Email
     */
    email: string;
    /**
     * Invited Full Name
     */
    fullName?: string;
    /**
     * Invited Status
     */
    status: InviteStatusEnum;
    /**
     * Expire Date
     */
    expireDate: Date;
    /**
     * Action Date
     */
    actionDate?: Date;
    /**
     * Invited Code
     */
    code?: string;
    /**
     * Additional Virtual Columns
     */
    isExpired?: boolean;
    /**
     * The associated role for the invite.
     */
    role?: IRole;
    /**
     * The identifier for the associated role.
     */
    roleId?: ID;
    /**
     * The user associated with this invite.
     */
    user?: IUser;
    /**
     * The identifier of the associated user.
     */
    userId?: ID;
    /**
     * The user who issued the invite.
     */
    invitedByUser?: IUser;
    /**
     * The identifier of the user who issued the invite.
     */
    invitedByUserId?: ID;
    /**
     * Organization Projects Invites
     */
    projects?: IOrganizationProject[];
    /**
     * Organization Contacts Invites
     */
    organizationContacts?: IOrganizationContact[];
    /**
     * Organization Departments Invites
     */
    departments?: IOrganizationDepartment[];
    /**
     * Organization Teams Invites
     */
    teams?: IOrganizationTeam[];
}
