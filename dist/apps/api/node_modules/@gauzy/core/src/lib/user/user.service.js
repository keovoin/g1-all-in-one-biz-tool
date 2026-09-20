"use strict";
// Modified code from https://github.com/xmlking/ngx-starter-kit.
// MIT License, see https://github.com/xmlking/ngx-starter-kit/blob/develop/LICENSE
// Copyright (c) 2018 Sumanth Chinthagunta
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const moment = require("moment");
const contracts_1 = require("@gauzy/contracts");
const config_1 = require("@gauzy/config");
const utils_1 = require("@gauzy/utils");
const database_helper_1 = require("./../database/database.helper");
const crud_1 = require("./../core/crud");
const context_1 = require("./../core/context");
const utils_2 = require("./../core/utils");
const employee_service_1 = require("../employee/employee.service");
const task_service_1 = require("../tasks/task.service");
const mikro_orm_user_repository_1 = require("./repository/mikro-orm-user.repository");
const type_orm_user_repository_1 = require("./repository/type-orm-user.repository");
const user_entity_1 = require("./user.entity");
const default_protected_users_1 = require("./default-protected-users");
const ui_preferences_util_1 = require("./ui-preferences.util");
const password_hash_service_1 = require("../password-hash/password-hash.service");
const role_assignment_helper_1 = require("./role-assignment.helper");
const claim_criteria_1 = require("../shared/single-use/claim-criteria");
/**
 * The account-status predicate every authentication path applies.
 *
 * `login()` and `getJwtAccessToken()` filter on it at issuance and, since GHSA-3cgp-wmrg-4fqg,
 * `JwtStrategy.validate()` re-applies it on every request. `checkIfExists` / `checkIfExistsThirdParty`
 * back `GET /auth/authenticated`, which is the call the web and desktop clients use to decide whether a
 * session is still good — without the predicate that endpoint kept answering `true` for a deactivated or
 * archived account while every other endpoint answered 401.
 */
const ACTIVE_ACCOUNT = { isActive: true, isArchived: false };
let UserService = class UserService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmUserRepository, mikroOrmUserRepository, _employeeService, _taskService, _passwordHashService) {
        super(typeOrmUserRepository, mikroOrmUserRepository);
        this.typeOrmUserRepository = typeOrmUserRepository;
        this.mikroOrmUserRepository = mikroOrmUserRepository;
        this._employeeService = _employeeService;
        this._taskService = _taskService;
        this._passwordHashService = _passwordHashService;
    }
    /**
     * Returns the total number of users without any filters/options.
     * Uses the underlying ORM repositories directly.
     */
    async countAll() {
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM:
                return await this.mikroOrmUserRepository.count();
            case utils_2.MultiORMEnum.TypeORM:
            default:
                return await this.typeOrmUserRepository.count();
        }
    }
    /**
     * Get the count of users and the number of users who logged in during the last 30 days.
     *
     * @returns {Promise<UserStats>} - A promise that resolves to an object containing user statistics.
     */
    async getUserStats() {
        try {
            const [count, lastMonthActiveUsers] = await Promise.all([
                this.count(), // Get the total number of users
                this.getMonthlyActiveUsers() // Get the number of users active in the last 30 days
            ]);
            return {
                count, // The total number of users
                lastMonthActiveUsers // The number of active users in the last month
            };
        }
        catch (error) {
            console.error('Error fetching user stats:', error);
            throw new Error(`Failed to retrieve user statistics: ${error.message}`);
        }
    }
    /**
     * Get the count of users who logged in during the last 30 days.
     *
     * @returns {Promise<number>} - The count of active users
     */
    async getMonthlyActiveUsers() {
        try {
            // Calculate the date 30 days ago
            const lastLoginAt = moment().subtract(30, 'days').toDate();
            // Use the count method to fetch the count of users with lastLoginAt within the last 30 days
            return await super.count({
                where: { lastLoginAt: (0, typeorm_1.MoreThan)(lastLoginAt) }
            });
        }
        catch (error) {
            // Handle error, log it, or throw a custom exception
            console.error('Error fetching monthly active users:', error);
            throw new Error('Unable to retrieve monthly active users count.');
        }
    }
    /**
     * Fetches the logged-in user's details along with associated employee details if requested.
     *
     * @param options Options for the findMeUser method.
     * @returns A promise resolving to the user details.
     */
    async findMeUser(options) {
        let employee;
        // Check if there are relations to include and remove 'employee' from them if present.
        if (options.relations && options.relations.length > 0) {
            const index = options.relations.indexOf('employee');
            if (index > -1) {
                options.relations.splice(index, 1); // Removing 'employee' to handle it separately
            }
        }
        // Fetch the user along with requested relations (excluding employee).
        const user = await this.findMe(options.relations);
        console.log('findMe found User with Id:', user.id);
        // Fetch employee details if 'includeEmployee' is true
        if (options.includeEmployee) {
            const relations = options.includeOrganization ? { organization: true } : [];
            employee = await this._employeeService.findOneByUserId(user.id, undefined, {
                relations: (0, utils_2.parseFindOptionsRelations)(relations)
            });
        }
        // Return user data combined with employee data, if it exists.
        return new user_entity_1.User({
            ...user,
            ...(employee && { employee }) // Conditionally add employee info to the response
        });
    }
    /**
     * Retrieves details of the currently logged-in user, including specified relations.
     *
     * @param relations An array of strings indicating which relations of the user to include.
     * @returns A Promise resolving to the IUser object with the desired relations.
     */
    async findMe(relations = []) {
        try {
            // Get the current user's ID from the RequestContext
            const userId = context_1.RequestContext.currentUserId();
            // Fetch and return the user's details based on the provided relations
            return await this.findOneByIdString(userId, { relations });
        }
        catch (error) {
            // Log the error for debugging purposes
            console.error('Error in findMe:', error);
        }
    }
    /**
     * Marked email as verified for user
     *
     * @param id
     * @returns
     */
    async markEmailAsVerified(id) {
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM:
                return await this.mikroOrmRepository.nativeUpdate({ id }, {
                    emailVerifiedAt: (0, utils_2.freshTimestamp)(),
                    emailToken: null,
                    code: null,
                    codeExpireAt: null
                });
            case utils_2.MultiORMEnum.TypeORM:
                return await this.typeOrmRepository.update({ id }, {
                    emailVerifiedAt: (0, utils_2.freshTimestamp)(),
                    emailToken: null,
                    code: null,
                    codeExpireAt: null
                });
            default:
                throw new Error(`Not implemented for ${this.ormType}`);
        }
    }
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
    async getUserByEmail(email) {
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM:
                return await this.mikroOrmRepository.findOne({ email });
            case utils_2.MultiORMEnum.TypeORM:
                return await this.typeOrmRepository.findOneBy({ email });
            default:
                throw new Error(`Not implemented for ${this.ormType}`);
        }
    }
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
    async getUserByEmailInTenant(email, tenantId) {
        if (!email || !tenantId) {
            return null;
        }
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM:
                return await this.mikroOrmRepository.findOne({ email, tenantId });
            case utils_2.MultiORMEnum.TypeORM:
                return await this.typeOrmRepository.findOneBy({ email, tenantId });
            default:
                throw new Error(`Not implemented for ${this.ormType}`);
        }
    }
    /**
     * GET user by email using social logins
     *
     * @param email
     * @returns
     */
    async getOAuthLoginEmail(email) {
        try {
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM:
                    return await this.mikroOrmRepository.findOneOrFail({ email });
                case utils_2.MultiORMEnum.TypeORM:
                    return await this.typeOrmRepository.findOneByOrFail({ email });
                default:
                    throw new Error(`Not implemented for ${this.ormType}`);
            }
        }
        catch (error) {
            throw new common_1.NotFoundException(`The requested record was not found`);
        }
    }
    /**
     * Checks if a user with the given email exists.
     * @param {string} email - The email of the user to check.
     * @returns {Promise<boolean>} - A promise that resolves to true if the user exists, otherwise false.
     */
    async checkIfExistsEmail(email) {
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM:
                return !!(await this.mikroOrmRepository.findOne({ email }));
            case utils_2.MultiORMEnum.TypeORM:
                return !!(await this.typeOrmRepository.findOneBy({ email }));
            default:
                throw new Error(`Not implemented for ${this.ormType}`);
        }
    }
    /**
     * Checks if a user with the given ID exists.
     * @param {string} id - The ID of the user to check.
     * @returns {Promise<boolean>} - A promise that resolves to true if the user exists, otherwise false.
     */
    async checkIfExists(id) {
        // An empty id must never reach the repository: `findOneBy({ id: undefined })` drops the predicate
        // and returns the FIRST user row (see getIfExists) — for the JWT strategy that meant any token
        // signed with JWT_SECRET but carrying no `id` claim authenticated as that user.
        if (!id) {
            return false;
        }
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM:
                return !!(await this.mikroOrmRepository.findOne({ id, ...ACTIVE_ACCOUNT }));
            case utils_2.MultiORMEnum.TypeORM:
                return !!(await this.typeOrmRepository.findOneBy({ id, ...ACTIVE_ACCOUNT }));
            default:
                throw new Error(`Not implemented for ${this.ormType}`);
        }
    }
    /**
     * Checks if a user with the given third party ID exists.
     * @param {string} thirdPartyId - The third party ID of the user to check.
     * @returns {Promise<boolean>} - A promise that resolves to true if the user exists, otherwise false.
     */
    async checkIfExistsThirdParty(thirdPartyId) {
        if (!thirdPartyId) {
            return false;
        }
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM:
                return !!(await this.mikroOrmRepository.findOne({ thirdPartyId, ...ACTIVE_ACCOUNT }));
            case utils_2.MultiORMEnum.TypeORM:
                return !!(await this.typeOrmRepository.findOneBy({ thirdPartyId, ...ACTIVE_ACCOUNT }));
            default:
                throw new Error(`Not implemented for ${this.ormType}`);
        }
    }
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
    async getIfExists(id) {
        if (!id) {
            return undefined;
        }
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM:
                return await this.mikroOrmUserRepository.findOne({ id });
            case utils_2.MultiORMEnum.TypeORM:
                return await this.typeOrmRepository.findOneBy({ id });
            default:
                throw new Error(`Not implemented for ${this.ormType}`);
        }
    }
    /**
     * Retrieves a user with the given third party ID if it exists.
     * @param {string} thirdPartyId - The third party ID of the user to retrieve.
     * @returns {Promise<User | undefined>} - A promise that resolves to the user if it exists, otherwise undefined.
     */
    async getIfExistsThirdParty(thirdPartyId) {
        if (!thirdPartyId) {
            return undefined;
        }
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM:
                return await this.mikroOrmUserRepository.findOne({ thirdPartyId });
            case utils_2.MultiORMEnum.TypeORM:
                return await this.typeOrmRepository.findOneBy({ thirdPartyId });
            default:
                throw new Error(`Not implemented for ${this.ormType}`);
        }
    }
    /**
     * Creates a new user.
     * @param {User} user - The user object to create.
     * @returns {Promise<InsertResult>} - A promise that resolves to the insert result.
     */
    async createOne(user) {
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const entity = this.mikroOrmRepository.create(user, { partial: true, managed: true });
                await this.mikroOrmRepository.persistAndFlush(entity);
                const result = new typeorm_1.InsertResult();
                result.identifiers = [{ id: entity.id }];
                result.generatedMaps = [{ id: entity.id }];
                result.raw = entity;
                return result;
            }
            case utils_2.MultiORMEnum.TypeORM:
                return await this.typeOrmRepository.insert(user);
            default:
                throw new Error(`Not implemented for ${this.ormType}`);
        }
    }
    /**
     * Updates the password for a user.
     *
     * @param id - The ID of the user whose password is to be changed.
     * @param hash - The new hashed password to set for the user.
     * @returns A promise resolving to the updated user entity.
     * @throws ForbiddenException if the operation fails.
     */
    async changePassword(id, hash) {
        try {
            // Update only the password hash for the user
            return await this.update(id, { hash });
        }
        catch (error) {
            // Throw a ForbiddenException if any error occurs
            throw new common_1.ForbiddenException('Failed to update the password.');
        }
    }
    /**
     * Updates the profile of a user.
     * Ensures the user has the necessary permissions and applies restrictions to role updates.
     *
     * @param id - The ID of the user to update.
     * @param entity - The user entity with updated data.
     * @returns The updated user entity.
     * @throws ForbiddenException if the user lacks the required permissions or attempts unauthorized updates.
     */
    async updateProfile(id, entity) {
        // The path id is authoritative. Every check below authorizes THIS id, and save() persists the
        // entity's id — a body `id` (the update DTO is not whitelisted) must never re-point the write to
        // another user (e.g. overwrite the SUPER_ADMIN's password hash from a PROFILE_EDIT account).
        entity.id = id;
        // Retrieve the current user's role ID from the RequestContext
        const currentRoleId = context_1.RequestContext.currentRoleId();
        const currentUserId = context_1.RequestContext.currentUserId();
        // Ensure the user has the appropriate permissions
        if (context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.PROFILE_EDIT) &&
            !context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.ORG_USERS_EDIT)) {
            // Users can only edit their own profile
            if (currentUserId !== id) {
                throw new common_1.ForbiddenException();
            }
        }
        let user;
        try {
            // Fetch the user by ID if the ID is a string
            if (typeof id == 'string') {
                user = await this.findOneByIdString(id, { relations: { role: true } });
            }
            // Restrict updates to Super Admin role without appropriate permission
            if (user.role.name === contracts_1.RolesEnum.SUPER_ADMIN) {
                if (!context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.SUPER_ADMIN_EDIT)) {
                    throw new common_1.ForbiddenException();
                }
            }
            // Restrict updates to Super Admin role without appropriate permission
            if (user.role.name === contracts_1.RolesEnum.SUPER_ADMIN) {
                if (!context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.SUPER_ADMIN_EDIT)) {
                    throw new common_1.ForbiddenException();
                }
            }
            // Restrict users from updating their own role.
            // Check BOTH the nested `role` object and the flat `roleId` field INDEPENDENTLY, otherwise a
            // user could escalate their own privileges (e.g. to SUPER_ADMIN). `role?.id ?? roleId` is not
            // enough: a crafted body could send an empty `role: { id: '' }` (non-nullish) to mask a
            // privileged `roleId` and slip through. Reject if any provided role identifier differs from the
            // caller's current role.
            // Compare as strings: `id` is typed `ID | number`, so a numeric-equivalent value must not
            // slip past the self-update check on a strict `===`.
            if (String(currentUserId) === String(id)) {
                const requestedRoleIds = [entity.role?.id, entity.roleId].filter((roleId) => (0, utils_1.isNotEmpty)(roleId));
                if (requestedRoleIds.some((roleId) => String(roleId) !== String(currentRoleId))) {
                    throw new common_1.ForbiddenException();
                }
            }
            else {
                // Updating SOMEONE ELSE: granting SUPER_ADMIN is reserved to callers who may edit super
                // admins (the same boundary the register handler and invite creation enforce). The role is
                // resolved from the database — never from a client-supplied role name.
                await this.assertCanAssignRoles([entity.role?.id, entity.roleId]);
            }
            // Update password hash if provided
            if (entity['hash']) {
                entity['hash'] = await this.getPasswordHash(entity['hash']);
            }
            // Save the updated user entity
            await this.save(entity);
            // Return the updated user
            return await this.findOneByWhereOptions({
                id: id,
                tenantId: context_1.RequestContext.currentTenantId()
            });
        }
        catch (error) {
            throw new common_1.ForbiddenException();
        }
    }
    async getAdminUsers(tenantId) {
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const items = await this.mikroOrmRepository.find({ tenantId, role: { name: { $in: [contracts_1.RolesEnum.SUPER_ADMIN, contracts_1.RolesEnum.ADMIN] } } }, { populate: ['role'] });
                return items.map((entity) => this.serialize(entity));
            }
            case utils_2.MultiORMEnum.TypeORM:
                // typeorm-v1: the legacy `join` find-option was removed. The nested `where` on the
                // `role` relation already produces the join needed to filter by `role.name`, so the
                // explicit `leftJoin` is redundant.
                return await this.typeOrmRepository.find({
                    where: {
                        tenantId,
                        role: {
                            name: (0, typeorm_1.In)([contracts_1.RolesEnum.SUPER_ADMIN, contracts_1.RolesEnum.ADMIN])
                        }
                    }
                });
            default:
                throw new Error(`Not implemented for ${this.ormType}`);
        }
    }
    /**
     * Updates the preferred language of the current user.
     * @param {LanguagesEnum} preferredLanguage - The preferred language to update.
     * @returns {Promise<IUser | UpdateResult>} - A promise that resolves to the updated user or update result.
     */
    async updatePreferredLanguage(preferredLanguage) {
        try {
            const userId = context_1.RequestContext.currentUserId();
            return await this.update(userId, { preferredLanguage });
        }
        catch (err) {
            throw new common_1.NotFoundException(`The record was not found`, err);
        }
    }
    /**
     * Updates the preferred component layout of the current user.
     * @param {ComponentLayoutStyleEnum} preferredComponentLayout - The preferred component layout to update.
     * @returns {Promise<IUser | UpdateResult>} - A promise that resolves to the updated user or update result.
     */
    async updatePreferredComponentLayout(preferredComponentLayout) {
        try {
            const userId = context_1.RequestContext.currentUserId();
            return await this.update(userId, { preferredComponentLayout });
        }
        catch (err) {
            throw new common_1.NotFoundException(`The record was not found`, err);
        }
    }
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
    async updateUiPreferences(patch) {
        const userId = context_1.RequestContext.currentUserId();
        let clean;
        try {
            clean = (0, ui_preferences_util_1.sanitizeUiPreferencesPatch)(patch);
        }
        catch (error) {
            throw new common_1.BadRequestException(error?.message ?? 'Invalid uiPreferences patch');
        }
        let user;
        try {
            // TenantAwareCrudService scopes the lookup to the caller's tenant.
            user = await this.findOneByIdString(userId);
        }
        catch (err) {
            throw new common_1.NotFoundException(`The record was not found`, err);
        }
        const merged = (0, ui_preferences_util_1.mergeUiPreferences)(user.uiPreferences, clean);
        try {
            (0, ui_preferences_util_1.assertUiPreferencesSize)(merged);
        }
        catch (error) {
            throw new common_1.BadRequestException(error?.message);
        }
        // `repository.update()` bypasses entity subscribers, so the SQLite text column must be
        // serialized here (same rule as `ActivityLogService.create`). Postgres/MySQL drivers
        // serialize json/jsonb columns themselves.
        const value = (0, config_1.isSqlite)() || (0, config_1.isBetterSqlite3)() ? JSON.stringify(merged) : merged;
        await this.update(userId, { uiPreferences: value });
        return merged;
    }
    /**
     * Sets the current refresh token for the user.
     *
     * @param refreshToken - The refresh token to set.
     * @param userId - The ID of the user for whom to set the refresh token.
     * @returns The update result from the database operation.
     */
    async setCurrentRefreshToken(refreshToken, userId) {
        // Hash the refresh token using PasswordHashService if provided
        const hashedToken = refreshToken ? await this._passwordHashService.hash(refreshToken) : refreshToken;
        // Scope update by both userId and tenantId for multi-tenant safety.
        // When tenantId is available, pass as FindOptionsWhere for scoped lookup.
        // Otherwise pass userId as string so TenantAwareCrudService.update() uses
        // findOneByIdString (which handles null RequestContext safely).
        const tenantId = context_1.RequestContext.currentTenantId();
        const criteria = tenantId ? { id: userId, tenantId } : userId;
        // Update the user's refresh token
        return (await this.update(criteria, { refreshToken: hashedToken }));
    }
    /**
     * Removes the refresh token from the database for the current user (logout device).
     *
     * @returns The update result from the database operation.
     */
    async removeRefreshToken() {
        const userId = context_1.RequestContext.currentUserId();
        const tenantId = context_1.RequestContext.currentTenantId();
        const criteria = tenantId ? { id: userId, tenantId } : { id: userId };
        return (await this.update(criteria, { refreshToken: null }));
    }
    /**
     * Updates the last login timestamp for a user.
     *
     * @param userId - The ID of the user for whom to set the last login time.
     * @returns The update result from the database operation.
     */
    async setUserLastLoginTimestamp(userId) {
        const lastLoginAt = new Date();
        const id = userId;
        // Update the last login time
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM:
                const updatedRow = await this.mikroOrmRepository.nativeUpdate({ id }, { lastLoginAt });
                return { affected: updatedRow };
            case utils_2.MultiORMEnum.TypeORM:
                return await this.typeOrmRepository.update({ id }, { lastLoginAt });
            default:
                throw new Error(`Not implemented for ${this.ormType}`);
        }
    }
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
    async setLastOrganizationAndTeam(userId, organizationId, teamId) {
        console.log(`[setLastOrganizationAndTeam] Called for user ${userId}, organizationId=${organizationId}, teamId=${teamId}`);
        // Build a partial payload containing only the truthy values
        const partialEntity = {
            ...(organizationId && { lastOrganizationId: organizationId }),
            ...(teamId && { lastTeamId: teamId })
        };
        // Skip the DB call if there is nothing to update
        if (Object.keys(partialEntity).length === 0) {
            console.log('[setLastOrganizationAndTeam] Nothing to update, skipping DB call');
            return;
        }
        try {
            console.log(`[setLastOrganizationAndTeam] Updating user ${userId} with payload:`, partialEntity);
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM:
                    await this.mikroOrmRepository.nativeUpdate({ id: userId }, partialEntity);
                    break;
                case utils_2.MultiORMEnum.TypeORM:
                    await this.typeOrmRepository.update({ id: userId }, partialEntity);
                    break;
                default:
                    throw new Error(`Not implemented for ${this.ormType}`);
            }
            console.log(`[setLastOrganizationAndTeam] Successfully updated preferences for user ${userId}`);
        }
        catch (error) {
            console.error(`[setLastOrganizationAndTeam] Error while updating preferences for user ${userId}:`, error);
        }
    }
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
    async claimEmailVerificationCode(id, code, tenantId) {
        const now = new Date();
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM:
                return await this.mikroOrmUserRepository.nativeUpdate((0, claim_criteria_1.emailVerificationClaimWhereMikroOrm)(id, code, tenantId, now), { code: null, codeExpireAt: null });
            case utils_2.MultiORMEnum.TypeORM: {
                const { affected } = await this.typeOrmUserRepository.update((0, claim_criteria_1.emailVerificationClaimWhere)(id, code, tenantId, now), { code: null, codeExpireAt: null });
                return affected ?? 0;
            }
            default:
                throw new Error(`ORM type not implemented: ${this.ormType}`);
        }
    }
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
    async invalidateMagicCode(email, code) {
        // Common criteria and payload shared by both ORM adapters
        const where = (0, claim_criteria_1.magicCodeClaimWhere)(email, code);
        const update = { code: null, codeExpireAt: null };
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM:
                return await this.mikroOrmUserRepository.nativeUpdate(where, update);
            case utils_2.MultiORMEnum.TypeORM: {
                const { affected } = await this.typeOrmUserRepository.update(where, update);
                return affected ?? 0;
            }
            default:
                throw new Error(`ORM type not implemented: ${this.ormType}`);
        }
    }
    /**
     * Get user if refresh token matches
     *
     * @param refreshToken
     * @param payload
     * @returns
     */
    async getUserIfRefreshTokenMatches(refreshToken, payload) {
        try {
            const { id, email, tenantId, role } = payload;
            let user;
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM: {
                    const where = { id, email };
                    if ((0, utils_1.isNotEmpty)(tenantId))
                        where.tenantId = tenantId;
                    if ((0, utils_1.isNotEmpty)(role))
                        where.role = { name: role };
                    user = (await this.mikroOrmRepository.findOneOrFail(where, {
                        populate: ['role'],
                        orderBy: { createdAt: 'DESC' }
                    }));
                    break;
                }
                case utils_2.MultiORMEnum.TypeORM: {
                    const query = this.typeOrmRepository.createQueryBuilder('user');
                    // typeorm-v1: the legacy `join` find-option was removed. Use an explicit query-builder
                    // left join so the raw `"role"."name" = :role` filter below can resolve the alias.
                    query.leftJoin('user.role', 'role');
                    query.where((qb) => {
                        qb.andWhere(new typeorm_1.Brackets((web) => {
                            web.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."id" = :id`), { id });
                            web.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."email" = :email`), { email });
                        }));
                        qb.andWhere(new typeorm_1.Brackets((web) => {
                            if ((0, utils_1.isNotEmpty)(tenantId)) {
                                web.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."tenantId" = :tenantId`), { tenantId });
                            }
                            if ((0, utils_1.isNotEmpty)(role)) {
                                web.andWhere((0, database_helper_1.prepareSQLQuery)(`"role"."name" = :role`), { role });
                            }
                        }));
                        qb.orderBy((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."createdAt"`), 'DESC');
                    });
                    user = await query.getOneOrFail();
                    break;
                }
                default:
                    throw new Error(`Not implemented for ${this.ormType}`);
            }
            const isRefreshTokenMatching = await this._passwordHashService.verify(refreshToken, user.refreshToken);
            if (isRefreshTokenMatching) {
                return user;
            }
            else {
                throw new common_1.UnauthorizedException();
            }
        }
        catch (error) {
            throw new common_1.UnauthorizedException();
        }
    }
    /**
     * Generates a hash from the provided password using PasswordHashService.
     *
     * @param password The password to hash.
     * @returns A promise resolving to the hashed password.
     */
    async getPasswordHash(password) {
        return this._passwordHashService.hash(password);
    }
    /**
     * Refuses a payload that assigns a role the caller may not grant.
     *
     * @param roleIds Every role identifier in the payload — both the flat `roleId` and `role.id`.
     * @throws BadRequestException When an id does not resolve inside the caller's tenant.
     * @throws ForbiddenException When SUPER_ADMIN is requested without `SUPER_ADMIN_EDIT`.
     */
    async assertCanAssignRoles(roleIds) {
        // EVERY candidate is checked, not just the first: the entity carries both a `role` relation and a
        // flat `roleId` column, and the RELATION wins when the row is persisted — so a body sending a
        // harmless `roleId` next to a privileged `role: { id }` must not validate the harmless one.
        const candidates = roleIds.filter((roleId) => (0, utils_1.isNotEmpty)(roleId));
        const canEditSuperAdmin = context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.SUPER_ADMIN_EDIT);
        for (const roleId of candidates) {
            (0, role_assignment_helper_1.assertRoleAssignmentAllowed)(await this.resolveRoleName(roleId), canEditSuperAdmin);
        }
    }
    /**
     * Resolves the name of a role of the caller's tenant from the database (by entity name, to avoid
     * a role -> user -> role import cycle). Returns undefined for an unknown / foreign role.
     *
     * @param roleId The role id to resolve.
     */
    async resolveRoleName(roleId) {
        if (!roleId) {
            return undefined;
        }
        const tenantId = context_1.RequestContext.currentTenantId();
        // Fail CLOSED with no tenant context. `...(tenantId ? { tenantId } : {})` would drop the
        // predicate entirely and resolve roles across every tenant in the database — the caller then
        // gets a name for a role it has no claim to, and the SUPER_ADMIN gate reads as satisfied.
        // An unresolved name makes `assertRoleAssignmentAllowed` throw, which is the safe outcome.
        if (!tenantId) {
            return undefined;
        }
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const role = await this.mikroOrmRepository
                    .getEntityManager()
                    .findOne('Role', { id: roleId, tenantId });
                return role?.name;
            }
            case utils_2.MultiORMEnum.TypeORM:
            default: {
                const role = await this.typeOrmRepository.manager.findOne('Role', {
                    where: { id: roleId, tenantId }
                });
                return role?.name;
            }
        }
    }
    /**
     * To permanently delete your account from your Gauzy app:
     *
     * @param userId
     * @param options
     * @returns
     */
    async delete(userId) {
        const currentUserId = context_1.RequestContext.currentUserId();
        // If user don't have enough permission (CHANGE_SELECTED_EMPLOYEE).
        if (!context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE)) {
            // If user try to delete someone other user account, just denied the request.
            if (currentUserId != userId) {
                throw new common_1.ForbiddenException('You can not delete account for other users!');
            }
        }
        // Get user first to check email for demo protection
        const user = await this.findOneByIdString(userId);
        if (!user) {
            throw new common_1.ForbiddenException('User not found for this ID!');
        }
        // In demo environment, prevent deletion of default users
        (0, default_protected_users_1.validateUserDeletion)(user.email);
        try {
            // TODO: Unassign all the task assigned to this user
            // Best to raise some event and handle it in the subscriber that remove tasks!
            const employee = await this._employeeService.findOneByUserId(user.id);
            if (employee) {
                await this._taskService.unassignEmployeeFromTeamTasks(employee.id);
            }
            return await super.delete(userId);
        }
        catch (error) {
            throw new common_1.ForbiddenException(error?.message);
        }
    }
    /**
     * Batch-load users by IDs. The eager `image` relation automatically triggers
     * ImageAssetSubscriber and UserSubscriber afterEntityLoad hooks,
     * resolving fresh presigned URLs for user profile images.
     *
     * @param userIds - Array of user IDs to load.
     * @returns A Map of user ID to User entity (with fresh imageUrl).
     */
    async findUsersByIds(userIds) {
        if (!userIds.length) {
            return new Map();
        }
        const users = await this.find({
            where: { id: (0, typeorm_1.In)(userIds) },
            relations: { image: true }
        });
        return new Map(users.map((user) => [user.id, user]));
    }
};
exports.UserService = UserService;
exports.UserService = UserService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_user_repository_1.TypeOrmUserRepository,
        mikro_orm_user_repository_1.MikroOrmUserRepository,
        employee_service_1.EmployeeService,
        task_service_1.TaskService,
        password_hash_service_1.PasswordHashService])
], UserService);
//# sourceMappingURL=user.service.js.map