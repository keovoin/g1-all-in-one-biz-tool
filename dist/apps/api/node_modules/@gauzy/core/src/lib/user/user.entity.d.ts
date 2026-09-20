import { EntityRepositoryType } from '@mikro-orm/core';
import { IUser, IRole, ComponentLayoutStyleEnum, ITag, IUserOrganization, IInvite, IImageAsset, TimeFormatEnum, ISocialAccount, IOrganizationTeam, IOrganization, ID, IUserUiPreferences } from '@gauzy/contracts';
import { TenantBaseEntity } from '../core/entities/internal';
import { MikroOrmUserRepository } from './repository/mikro-orm-user.repository';
export declare class User extends TenantBaseEntity implements IUser {
    [EntityRepositoryType]?: MikroOrmUserRepository;
    thirdPartyId?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    username?: string;
    timeZone?: string;
    timeFormat?: TimeFormatEnum;
    /**
     * bcrypt password digest. Blanked rather than masked on export: a trailing hint of a digest buys
     * an offline cracker free characters and buys an operator nothing.
     */
    hash?: string;
    /** Hashed refresh token — same reasoning as {@link User.hash}. */
    refreshToken?: string;
    imageUrl?: string;
    preferredLanguage?: string;
    preferredComponentLayout?: ComponentLayoutStyleEnum;
    /**
     * Per-user, per-feature UI state (e.g. `{ aiChat: { expanded, position, width, maximized } }`).
     *
     * Same exposure as the other preference columns (`preferredLanguage`,
     * `preferredComponentLayout`): returned by `GET /user/me`, written only through
     * `PUT /user/ui-preferences` (shallow merge per feature key). Same driver-aware
     * column as `EmployeeSetting.data`: jsonb (postgres) / json (mysql) / text (sqlite,
     * where `UserSubscriber` + `UserService.updateUiPreferences` (de)serialize it).
     */
    uiPreferences?: IUserUiPreferences;
    /** Live one-time sign-in / verification code. */
    code?: string;
    codeExpireAt?: Date;
    emailVerifiedAt?: Date;
    lastLoginAt?: Date;
    /** Live e-mail verification token. Blanked: nullable, and a hint of a live token helps nobody. */
    emailToken?: string;
    /** Additional virtual columns */
    name?: string;
    isEmailVerified?: boolean;
    /**
     * Role
     */
    role?: IRole;
    roleId?: string;
    /**
     * ImageAsset
     */
    image?: IImageAsset;
    imageId?: IImageAsset['id'];
    /**
     * Default Team
     */
    defaultTeam?: IOrganizationTeam;
    defaultTeamId?: ID;
    /**
     * Last Team : This field is used to know what was the last team the user logged in
     */
    lastTeam?: IOrganizationTeam;
    lastTeamId?: ID;
    /**
     * Default organization
     */
    defaultOrganization?: IOrganization;
    defaultOrganizationId?: ID;
    /**
     * Last organization : This field is used to know what was the last organization the user was connected on or just set
     */
    lastOrganization?: IOrganization;
    lastOrganizationId?: ID;
    tags?: ITag[];
    /**
     * UserOrganization
     */
    organizations?: IUserOrganization[];
    /**
     * User belongs to invites
     */
    invites?: IInvite[];
    /**
     * User social accounts
     */
    socialAccounts?: ISocialAccount[];
}
