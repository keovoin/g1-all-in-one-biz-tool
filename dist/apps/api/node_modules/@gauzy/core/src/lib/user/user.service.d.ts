import { InsertResult, UpdateResult, DeleteResult } from 'typeorm';
import { JwtPayload } from 'jsonwebtoken';
import { ComponentLayoutStyleEnum, ID, IFindMeUser, IUser, IUserUiPreferences, IUserUiPreferencesUpdateInput, LanguagesEnum, UserStats } from '@gauzy/contracts';
import { TenantAwareCrudService } from './../core/crud';
import { EmployeeService } from '../employee/employee.service';
import { TaskService } from '../tasks/task.service';
import { MikroOrmUserRepository } from './repository/mikro-orm-user.repository';
import { TypeOrmUserRepository } from './repository/type-orm-user.repository';
import { User } from './user.entity';
import { PasswordHashService } from '../password-hash/password-hash.service';
export declare class UserService extends TenantAwareCrudService<User> {
    readonly typeOrmUserRepository: TypeOrmUserRepository;
    readonly mikroOrmUserRepository: MikroOrmUserRepository;
    private readonly _employeeService;
    private readonly _taskService;
    private readonly _passwordHashService;
    constructor(typeOrmUserRepository: TypeOrmUserRepository, mikroOrmUserRepository: MikroOrmUserRepository, _employeeService: EmployeeService, _taskService: TaskService, _passwordHashService: PasswordHashService);
    /**
     * Returns the total number of users without any filters/options.
     * Uses the underlying ORM repositories directly.
     */
    countAll(): Promise<number>;
    /**
     * Get the count of users and the number of users who logged in during the last 30 days.
     *
     * @returns {Promise<UserStats>} - A promise that resolves to an object containing user statistics.
     */
    getUserStats(): Promise<UserStats>;
    /**
     * Get the count of users who logged in during the last 30 days.
     *
     * @returns {Promise<number>} - The count of active users
     */
    getMonthlyActiveUsers(): Promise<number>;
    /**
     * Fetches the logged-in user's details along with associated employee details if requested.
     *
     * @param options Options for the findMeUser method.
     * @returns A promise resolving to the user details.
     */
    findMeUser(options: IFindMeUser): Promise<IUser>;
    /**
     * Retrieves details of the currently logged-in user, including specified relations.
     *
     * @param relations An array of strings indicating which relations of the user to include.
     * @returns A Promise resolving to the IUser object with the desired relations.
     */
    private findMe;
    /**
     * Marked email as verified for user
     *
     * @param id
     * @returns
     */
    markEmailAsVerified(id: ID): Promise<number | UpdateResult>;
    /**
     * GET a user by email across EVERY tenant of the installation.
     *
     * 🛑 This lookup is deliberately GLOBAL and must only be used by the pre-authentication flows
     * that have no tenant context yet — social/OAuth login and social signup, where the address is
     * what identifies the account in the first place. Calling it from a request handler that already
     * knows the caller's tenant turns it into a cross-tenant disclosure (and an account-existence
     * oracle) for the whole deployment: it answers for a user of any tenant.
     *
     * Tenant-scoped callers must use {@link getUserByEmailInTenant} instead.
     *
     * @param email
     * @returns the user with that email in ANY tenant, or null
     */
    getUserByEmail(email: string): Promise<IUser | null>;
    /**
     * GET a user by email INSIDE a single tenant.
     *
     * The tenant-safe counterpart of {@link getUserByEmail}: anything reachable from an
     * authenticated request handler must go through here so that one tenant can never read — or
     * probe for the existence of — an account belonging to another.
     *
     * Fails closed on a missing tenant: an `undefined` key is DROPPED from a TypeORM `where` object
     * in this codebase (see TYPEORM_NULL_WHERE_ISOLATION), so passing an absent `tenantId` straight
     * through would silently widen the query back to the global lookup this method exists to
     * replace. "I could not work out which tenant to search" must answer "no user", never "here is
     * somebody else's".
     *
     * @param email
     * @param tenantId the tenant the lookup is restricted to
     * @returns the user with that email in that tenant, or null
     */
    getUserByEmailInTenant(email: string, tenantId: ID): Promise<IUser | null>;
    /**
     * GET user by email using social logins
     *
     * @param email
     * @returns
     */
    getOAuthLoginEmail(email: string): Promise<IUser>;
    /**
     * Checks if a user with the given email exists.
     * @param {string} email - The email of the user to check.
     * @returns {Promise<boolean>} - A promise that resolves to true if the user exists, otherwise false.
     */
    checkIfExistsEmail(email: string): Promise<boolean>;
    /**
     * Checks if a user with the given ID exists.
     * @param {string} id - The ID of the user to check.
     * @returns {Promise<boolean>} - A promise that resolves to true if the user exists, otherwise false.
     */
    checkIfExists(id: string): Promise<boolean>;
    /**
     * Checks if a user with the given third party ID exists.
     * @param {string} thirdPartyId - The third party ID of the user to check.
     * @returns {Promise<boolean>} - A promise that resolves to true if the user exists, otherwise false.
     */
    checkIfExistsThirdParty(thirdPartyId: string): Promise<boolean>;
    /**
     * Retrieves a user with the given ID if it exists.
     *
     * The id MUST be present. TypeORM silently omits an `undefined` (and, before
     * TYPEORM_INVALID_WHERE_VALUES_BEHAVIOR, a `null`) where value, so `findOneBy({ id: undefined })`
     * became `SELECT ... LIMIT 1` and returned an arbitrary user — the JWT strategy authenticated any
     * JWT_SECRET-signed token that had no `id` claim (invite / estimate / team-join / appointment /
     * magic-code tokens) as the first user in the table.
     *
     * @param {string} id - The ID of the user to retrieve.
     * @returns {Promise<User | undefined>} - A promise that resolves to the user if it exists, otherwise undefined.
     */
    getIfExists(id: string): Promise<User | undefined>;
    /**
     * Retrieves a user with the given third party ID if it exists.
     * @param {string} thirdPartyId - The third party ID of the user to retrieve.
     * @returns {Promise<User | undefined>} - A promise that resolves to the user if it exists, otherwise undefined.
     */
    getIfExistsThirdParty(thirdPartyId: string): Promise<User | undefined>;
    /**
     * Creates a new user.
     * @param {User} user - The user object to create.
     * @returns {Promise<InsertResult>} - A promise that resolves to the insert result.
     */
    createOne(user: User): Promise<InsertResult>;
    /**
     * Updates the password for a user.
     *
     * @param id - The ID of the user whose password is to be changed.
     * @param hash - The new hashed password to set for the user.
     * @returns A promise resolving to the updated user entity.
     * @throws ForbiddenException if the operation fails.
     */
    changePassword(id: ID, hash: string): Promise<UpdateResult | User>;
    /**
     * Updates the profile of a user.
     * Ensures the user has the necessary permissions and applies restrictions to role updates.
     *
     * @param id - The ID of the user to update.
     * @param entity - The user entity with updated data.
     * @returns The updated user entity.
     * @throws ForbiddenException if the user lacks the required permissions or attempts unauthorized updates.
     */
    updateProfile(id: ID | number, entity: User): Promise<IUser>;
    getAdminUsers(tenantId: string): Promise<User[]>;
    /**
     * Updates the preferred language of the current user.
     * @param {LanguagesEnum} preferredLanguage - The preferred language to update.
     * @returns {Promise<IUser | UpdateResult>} - A promise that resolves to the updated user or update result.
     */
    updatePreferredLanguage(preferredLanguage: LanguagesEnum): Promise<IUser | UpdateResult>;
    /**
     * Updates the preferred component layout of the current user.
     * @param {ComponentLayoutStyleEnum} preferredComponentLayout - The preferred component layout to update.
     * @returns {Promise<IUser | UpdateResult>} - A promise that resolves to the updated user or update result.
     */
    updatePreferredComponentLayout(preferredComponentLayout: ComponentLayoutStyleEnum): Promise<IUser | UpdateResult>;
    /**
     * Merges a per-feature patch into the current user's stored UI preferences and persists it.
     *
     * SHALLOW merge per top-level feature key: each key present in `patch` replaces that feature's
     * whole object (`null` removes it); other features stay untouched, so independent features
     * never clobber each other. Only the CURRENT user (`RequestContext.currentUserId()`) can be
     * written — the endpoint carries no id on purpose.
     *
     * @param patch - Feature-keyed objects to replace (see `IUserUiPreferencesUpdateInput`).
     * @returns The merged preferences object as now stored.
     * @throws BadRequestException on structurally invalid input or an oversized blob.
     * @throws NotFoundException when the current user row cannot be read.
     */
    updateUiPreferences(patch: IUserUiPreferencesUpdateInput): Promise<IUserUiPreferences>;
    /**
     * Sets the current refresh token for the user.
     *
     * @param refreshToken - The refresh token to set.
     * @param userId - The ID of the user for whom to set the refresh token.
     * @returns The update result from the database operation.
     */
    setCurrentRefreshToken(refreshToken: string, userId: ID): Promise<UpdateResult>;
    /**
     * Removes the refresh token from the database for the current user (logout device).
     *
     * @returns The update result from the database operation.
     */
    removeRefreshToken(): Promise<UpdateResult>;
    /**
     * Updates the last login timestamp for a user.
     *
     * @param userId - The ID of the user for whom to set the last login time.
     * @returns The update result from the database operation.
     */
    setUserLastLoginTimestamp(userId: ID): Promise<UpdateResult>;
    /**
     * Persist the user's last organization and/or team preference.
     *
     * Only writes to the database when at least one value is truthy,
     * and only includes truthy fields in the update payload to avoid
     * accidentally clearing existing preferences.
     *
     * @param userId - The ID of the user to update.
     * @param organizationId - Optional organization ID to set as last organization.
     * @param teamId - Optional team ID to set as last team.
     */
    setLastOrganizationAndTeam(userId: ID, organizationId?: ID, teamId?: ID): Promise<void>;
    /**
     * Atomically claims a user's email-verification code, enforcing single use.
     *
     * The code and its expiry stay in the WHERE clause, so the write is its own check: the first
     * caller nulls the code and gets 1, and a request racing it matches nothing and gets 0. Keeping
     * `codeExpireAt` in the predicate also closes the window where a lookup and a claim straddle
     * the expiry boundary, which a claim scoped only by id and code would let through.
     *
     * This deliberately goes straight to the repositories rather than through `update()`. Email
     * confirmation is a PUBLIC endpoint, and `TenantAwareCrudService.update` routes object criteria
     * to `findOneByWhereOptions`, which dereferences `RequestContext.currentUser().tenantId` — on an
     * unauthenticated request there is no current user, so that path throws. The tenant comes from
     * the verified payload instead, which is both safe here and stricter than an id-only claim.
     *
     * @param id - The user whose code is being claimed.
     * @param code - The verification code being consumed.
     * @param tenantId - The tenant the code was issued for.
     * @returns 1 if this call claimed the code, 0 if it was already used or has expired.
     */
    claimEmailVerificationCode(id: ID, code: string, tenantId: ID): Promise<number>;
    /**
     * Atomically claims the magic sign-in code for every user matching the given email and code.
     *
     * The code stays in the WHERE clause, which is what makes this the single-use claim rather
     * than mere cleanup: the first caller nulls the code and gets a non-zero row count, and any
     * request racing it matches nothing and gets 0. One email can exist in several tenants, so a
     * winning claim may cover more than one row — hence a count rather than a boolean.
     *
     * Callers MUST gate on the return value before handing out sign-in tokens. Treating this as
     * fire-and-forget cleanup lets two concurrent requests both authenticate off one code.
     *
     * @param email - The email address used for the sign-in.
     * @param code  - The magic code being consumed.
     * @returns The number of user rows claimed; 0 means the code was already consumed.
     */
    invalidateMagicCode(email: string, code: string): Promise<number>;
    /**
     * Get user if refresh token matches
     *
     * @param refreshToken
     * @param payload
     * @returns
     */
    getUserIfRefreshTokenMatches(refreshToken: string, payload: JwtPayload): Promise<User>;
    /**
     * Generates a hash from the provided password using PasswordHashService.
     *
     * @param password The password to hash.
     * @returns A promise resolving to the hashed password.
     */
    private getPasswordHash;
    /**
     * Refuses a payload that assigns a role the caller may not grant.
     *
     * @param roleIds Every role identifier in the payload — both the flat `roleId` and `role.id`.
     * @throws BadRequestException When an id does not resolve inside the caller's tenant.
     * @throws ForbiddenException When SUPER_ADMIN is requested without `SUPER_ADMIN_EDIT`.
     */
    assertCanAssignRoles(roleIds: Array<ID | undefined>): Promise<void>;
    /**
     * Resolves the name of a role of the caller's tenant from the database (by entity name, to avoid
     * a role -> user -> role import cycle). Returns undefined for an unknown / foreign role.
     *
     * @param roleId The role id to resolve.
     */
    resolveRoleName(roleId: ID): Promise<string | undefined>;
    /**
     * To permanently delete your account from your Gauzy app:
     *
     * @param userId
     * @param options
     * @returns
     */
    delete(userId: ID): Promise<DeleteResult>;
    /**
     * Batch-load users by IDs. The eager `image` relation automatically triggers
     * ImageAssetSubscriber and UserSubscriber afterEntityLoad hooks,
     * resolving fresh presigned URLs for user profile images.
     *
     * @param userIds - Array of user IDs to load.
     * @returns A Map of user ID to User entity (with fresh imageUrl).
     */
    findUsersByIds(userIds: ID[]): Promise<Map<ID, IUser>>;
}
