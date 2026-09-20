import { ID, IOrganizationTeam, IOrganizationTeamJoinRequest, IUser, OrganizationTeamJoinRequestStatusEnum } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class OrganizationTeamJoinRequest extends TenantOrganizationBaseEntity implements IOrganizationTeamJoinRequest {
    /**
     * The email address associated with the user.
     */
    email: string;
    /**
     * The full name of the user.
     */
    fullName: string;
    /**
     * The link address associated with the user or entity.
     */
    linkAddress: string;
    /**
     * The position of the user.
     */
    position: string;
    /**
     * The status of the organization team join request.
     */
    status: OrganizationTeamJoinRequestStatusEnum;
    /**
     * A confidential code associated with the entity.
     */
    code: string;
    /**
     * A confidential token for authentication or validation.
     */
    token: string;
    /**
     * The expiration date and time for the associated token or code.
     */
    expiredAt: Date;
    /**
     * Additional Virtual Columns
     */
    isExpired: boolean;
    /**
     * The associated user for the organization team join request.
     */
    user?: IUser;
    /**
     * The unique identifier (UUID) of the associated user.
     */
    userId?: ID;
    /**
     * The organization team associated with this join request.
     */
    organizationTeam?: IOrganizationTeam;
    /**
     * The unique identifier (UUID) for the associated organization team.
     */
    organizationTeamId?: ID;
}
