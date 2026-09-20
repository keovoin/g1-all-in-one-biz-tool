"use strict";
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const tslib_1 = require("tslib");
const auth_1 = require("@gauzy/auth");
const config_1 = require("@gauzy/config");
const constants_1 = require("@gauzy/constants");
const contracts_1 = require("@gauzy/contracts");
const utils_1 = require("@gauzy/utils");
const core_1 = require("@mikro-orm/core");
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const cqrs_1 = require("@nestjs/cqrs");
const jsonwebtoken_1 = require("jsonwebtoken");
const moment = require("moment");
const typeorm_1 = require("typeorm");
const underscore_1 = require("underscore");
const access_token_service_1 = require("../access-token/access-token.service");
const employee_service_1 = require("../employee/employee.service");
const type_orm_employee_repository_1 = require("../employee/repository/type-orm-employee.repository");
const mikro_orm_employee_repository_1 = require("../employee/repository/mikro-orm-employee.repository");
const event_bus_1 = require("../event-bus/event-bus");
const events_1 = require("../event-bus/events");
const password_hash_service_1 = require("../password-hash/password-hash.service");
const refresh_token_service_1 = require("../refresh-token/refresh-token.service");
const user_organization_services_1 = require("../user-organization/user-organization.services");
const mikro_orm_user_repository_1 = require("../user/repository/mikro-orm-user.repository");
const type_orm_user_repository_1 = require("../user/repository/type-orm-user.repository");
const user_service_1 = require("../user/user.service");
const context_1 = require("./../core/context");
const internal_1 = require("./../core/entities/internal");
const utils_2 = require("./../core/utils");
const database_helper_1 = require("./../database/database.helper");
const email_service_1 = require("./../email-send/email.service");
const import_record_1 = require("./../export-import/import-record");
const type_orm_organization_team_repository_1 = require("./../organization-team/repository/type-orm-organization-team.repository");
const mikro_orm_organization_team_repository_1 = require("./../organization-team/repository/mikro-orm-organization-team.repository");
const commands_1 = require("./../password-reset/commands");
const type_orm_password_reset_repository_1 = require("./../password-reset/repository/type-orm-password-reset.repository");
const mikro_orm_password_reset_repository_1 = require("./../password-reset/repository/mikro-orm-password-reset.repository");
const role_service_1 = require("./../role/role.service");
const email_confirmation_service_1 = require("./email-confirmation.service");
const social_account_service_1 = require("./social-account/social-account.service");
const verify_oauth_tokens_1 = require("./social-account/token-verification/verify-oauth-tokens");
const node_crypto_1 = require("node:crypto");
const redis_module_1 = require("../redis/redis.module");
const oauth_client_service_1 = require("./oauth-client/oauth-client.service");
const terms_acceptance_service_1 = require("../terms-acceptance/terms-acceptance.service");
const claim_criteria_1 = require("../shared/single-use/claim-criteria");
const login_attempt_service_1 = require("./login-attempt.service");
let AuthService = AuthService_1 = class AuthService extends auth_1.SocialAuthService {
    constructor(typeOrmUserRepository, mikroOrmUserRepository, typeOrmEmployeeRepository, mikroOrmEmployeeRepository, typeOrmOrganizationTeamRepository, mikroOrmOrganizationTeamRepository, emailConfirmationService, userService, employeeService, roleService, emailService, userOrganizationService, commandBus, httpService, socialAccountService, eventBus, cacheManager, redisClient, passwordHashService, refreshTokenService, accessTokenService, typeOrmPasswordResetRepository, mikroOrmPasswordResetRepository, oauthClientService, termsAcceptanceService, loginAttemptService) {
        super();
        this.typeOrmUserRepository = typeOrmUserRepository;
        this.mikroOrmUserRepository = mikroOrmUserRepository;
        this.typeOrmEmployeeRepository = typeOrmEmployeeRepository;
        this.mikroOrmEmployeeRepository = mikroOrmEmployeeRepository;
        this.typeOrmOrganizationTeamRepository = typeOrmOrganizationTeamRepository;
        this.mikroOrmOrganizationTeamRepository = mikroOrmOrganizationTeamRepository;
        this.emailConfirmationService = emailConfirmationService;
        this.userService = userService;
        this.employeeService = employeeService;
        this.roleService = roleService;
        this.emailService = emailService;
        this.userOrganizationService = userOrganizationService;
        this.commandBus = commandBus;
        this.httpService = httpService;
        this.socialAccountService = socialAccountService;
        this.eventBus = eventBus;
        this.cacheManager = cacheManager;
        this.redisClient = redisClient;
        this.passwordHashService = passwordHashService;
        this.refreshTokenService = refreshTokenService;
        this.accessTokenService = accessTokenService;
        this.typeOrmPasswordResetRepository = typeOrmPasswordResetRepository;
        this.mikroOrmPasswordResetRepository = mikroOrmPasswordResetRepository;
        this.oauthClientService = oauthClientService;
        this.termsAcceptanceService = termsAcceptanceService;
        this.loginAttemptService = loginAttemptService;
        // Get the type of the Object-Relational Mapping (ORM) used in the application.
        this.ormType = (0, utils_2.getORMType)();
        this.logger = new common_1.Logger(AuthService_1.name);
        /**
         * Authorization-code jti values already claimed by this process, used to make the non-Redis
         * token-exchange path single-use. Entries expire with the codes they guard. Deployments with
         * Redis wired use GETDEL instead and never touch this set.
         */
        this.consumedOAuthCodes = new Set();
    }
    /**
     * Serializes the provided entity based on the ORM type.
     * @param entity The entity to be serialized.
     * @returns The serialized entity.
     */
    serialize(entity) {
        if (this.ormType === utils_2.MultiORMEnum.MikroORM) {
            // If using MikroORM, use wrap(entity).toJSON() for serialization
            return (0, core_1.wrap)(entity).toJSON();
        }
        // If using other ORM types, return the entity as is
        return entity;
    }
    signOAuthAppPayload(payload, secret) {
        return (0, node_crypto_1.createHmac)('sha256', secret).update(payload).digest('base64url');
    }
    parseOAuthAppCode(code, secret) {
        const [version, payloadB64, sig] = code.split('.');
        if (version !== 'v1' || !payloadB64 || !sig) {
            throw new common_1.UnauthorizedException('Invalid authorization code');
        }
        const expectedSig = this.signOAuthAppPayload(payloadB64, secret);
        const sigBuf = Buffer.from(sig, 'base64url');
        const expectedBuf = Buffer.from(expectedSig, 'base64url');
        if (sigBuf.length !== expectedBuf.length || !(0, node_crypto_1.timingSafeEqual)(sigBuf, expectedBuf)) {
            throw new common_1.UnauthorizedException('Invalid authorization code signature');
        }
        let payload;
        try {
            const payloadJson = Buffer.from(payloadB64, 'base64url').toString();
            payload = JSON.parse(payloadJson);
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid authorization code payload');
        }
        if (!payload.jti || !payload.userId || !payload.tenantId || !payload.clientId || !payload.redirectUri) {
            throw new common_1.UnauthorizedException('Invalid authorization code payload');
        }
        return payload;
    }
    /**
     * Store a pending OAuth authorization request in cache.
     */
    async storeOAuthAppPendingRequest(request) {
        const cacheKey = `${AuthService_1.OAUTH_REQUEST_CACHE_PREFIX}${request.requestId}`;
        const value = JSON.stringify(request);
        if (this.redisClient) {
            await this.redisClient.set(cacheKey, value, { PX: AuthService_1.OAUTH_REQUEST_TTL_MS });
        }
        else {
            await this.cacheManager.set(cacheKey, value, AuthService_1.OAUTH_REQUEST_TTL_MS);
        }
    }
    /**
     * Retrieve a pending OAuth authorization request from cache.
     */
    async getOAuthAppPendingRequest(requestId) {
        const cacheKey = `${AuthService_1.OAUTH_REQUEST_CACHE_PREFIX}${requestId}`;
        let value;
        if (this.redisClient) {
            value = await this.redisClient.get(cacheKey);
        }
        else {
            value = (await this.cacheManager.get(cacheKey)) ?? null;
        }
        if (!value)
            return null;
        return JSON.parse(value);
    }
    /**
     * Delete a pending OAuth authorization request from cache.
     */
    async deleteOAuthAppPendingRequest(requestId) {
        const cacheKey = `${AuthService_1.OAUTH_REQUEST_CACHE_PREFIX}${requestId}`;
        if (this.redisClient) {
            await this.redisClient.del(cacheKey);
        }
        else {
            await this.cacheManager.del(cacheKey);
        }
    }
    /**
     * Map an `OAuthClient` registry row → the `OAuthAppConfig` view used
     * by the auth pipeline. Carries the `clientSecretHash` (NEVER plaintext)
     * because the `/token` exchange validates incoming secrets via
     * `OAuthClientService.validateClientSecret` (constant-time scrypt).
     */
    mapOAuthClientToConfig(client) {
        return {
            clientId: client.clientId,
            clientSecretHash: client.clientSecretHash ?? null,
            codeSecret: client.codeSecret,
            redirectUris: client.redirectUris ?? [],
            name: client.name,
            description: client.description ?? null,
            allowedScopes: client.allowedScopes ?? [],
            allowedGrantTypes: (client.allowedGrantTypes ?? []),
            pkceRequired: client.pkceRequired,
            accessTokenTtl: client.accessTokenTtl,
            tenantId: client.tenantId ?? null,
            clientType: client.clientType
        };
    }
    /**
     * Resolve an OAuth client by its public `clientId` from the
     * `oauth_clients` registry. Throws `NotFoundException` (mapped to
     * `400 invalid_client` by the controller) when the row does not
     * exist or is inactive. There is no env-var fallback — every
     * third-party app must be registered via `POST /oauth/clients`.
     */
    async resolveOAuthClient(clientId) {
        if (!clientId) {
            throw new common_1.BadRequestException('Invalid client_id');
        }
        const client = await this.oauthClientService.findByClientId(clientId);
        return this.mapOAuthClientToConfig(client);
    }
    async createOAuthAppAuthorizationCode(request) {
        const config = await this.resolveOAuthClient(request.clientId);
        // Verify the client is allowed for the requesting tenant
        // Global clients (tenantId=null) can be used by any tenant
        // Tenant-scoped clients can only be used by their owning tenant
        const requestTenantId = context_1.RequestContext.currentTenantId();
        if (config.tenantId && config.tenantId !== requestTenantId) {
            throw new common_1.BadRequestException('OAuth client is not available for this tenant');
        }
        // Enforce that the client is allowed to use the authorization_code grant
        if (config.allowedGrantTypes && config.allowedGrantTypes.length > 0
            && !config.allowedGrantTypes.includes('authorization_code')) {
            throw new common_1.BadRequestException('Client is not allowed to use authorization_code grant');
        }
        if (!this.isOAuthAppRedirectUriAllowed(request.redirectUri, config)) {
            throw new common_1.BadRequestException('Invalid redirect_uri');
        }
        // Always validate scopes - even when allowedScopes is empty,
        // the request should not specify scopes unless they're explicitly allowed
        if (request.scope) {
            const requested = request.scope.split(/\s+/).filter(Boolean);
            if (requested.length > 0) {
                // If client has no allowed scopes defined, reject all scope requests
                if (!config.allowedScopes || config.allowedScopes.length === 0) {
                    throw new common_1.BadRequestException('This client does not allow any scopes');
                }
                if (!requested.every((s) => config.allowedScopes.includes(s))) {
                    throw new common_1.BadRequestException('Requested scope is not allowed for this client');
                }
            }
        }
        const now = Math.floor(Date.now() / 1000);
        const jti = (0, node_crypto_1.randomBytes)(32).toString('base64url');
        const exp = now + AuthService_1.OAUTH_CODE_TTL_MS / 1000;
        const scope = request.scope ?? '';
        const payload = {
            jti,
            userId: request.userId,
            tenantId: request.tenantId,
            clientId: request.clientId,
            redirectUri: request.redirectUri,
            scope,
            exp
        };
        const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
        const signature = this.signOAuthAppPayload(payloadB64, config.codeSecret);
        const cacheKey = `${AuthService_1.OAUTH_CODE_CACHE_PREFIX}${jti}`;
        if (this.redisClient) {
            await this.redisClient.set(cacheKey, 'valid', { PX: AuthService_1.OAUTH_CODE_TTL_MS });
        }
        else {
            await this.cacheManager.set(cacheKey, 'valid', AuthService_1.OAUTH_CODE_TTL_MS);
        }
        return `v1.${payloadB64}.${signature}`;
    }
    async exchangeOAuthAppAuthorizationCode(request) {
        const config = await this.resolveOAuthClient(request.clientId);
        // Validate the presented client_secret against the per-client
        // scrypt hash from the registry. Public clients (null hash) will
        // fail here — PKCE for public clients is deferred to a later phase.
        const secretValid = await this.oauthClientService.validateClientSecret(config.clientSecretHash, request.clientSecret);
        if (!secretValid) {
            throw new common_1.UnauthorizedException('Invalid client credentials');
        }
        if (!this.isOAuthAppRedirectUriAllowed(request.redirectUri, config)) {
            throw new common_1.BadRequestException('Invalid redirect_uri');
        }
        const payload = this.parseOAuthAppCode(request.code, config.codeSecret);
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp <= now) {
            throw new common_1.UnauthorizedException('Authorization code expired');
        }
        if (payload.clientId !== request.clientId || payload.redirectUri !== request.redirectUri) {
            throw new common_1.UnauthorizedException('Authorization code mismatch');
        }
        // Single-use enforcement via atomic GETDEL (Redis) or get-then-del fallback
        const cacheKey = `${AuthService_1.OAUTH_CODE_CACHE_PREFIX}${payload.jti}`;
        let codeState;
        if (this.redisClient) {
            // Atomic get-and-delete: prevents race conditions in multi-instance deployments
            codeState = await this.redisClient.getDel(cacheKey);
        }
        else if (this.consumedOAuthCodes.has(payload.jti)) {
            // Already claimed by an exchange that is still in flight, or by one that completed.
            codeState = null;
        }
        else {
            // Non-Redis fallback, single instance only. `await get()` followed by `await del()` is
            // NOT single-use safe on its own: the await between them yields the event loop, so two
            // exchanges of the same code both observe it as live and both mint an access token —
            // exactly what RFC 6749 forbids. Node runs one thread, so a SYNCHRONOUS check-and-insert
            // is the atomic claim that the two-step cache dance cannot be. The claim is recorded
            // BEFORE the first await, which is what closes the window.
            this.consumedOAuthCodes.add(payload.jti);
            // The jti cannot be replayed past its own expiry (checked above), so the set only needs
            // to outlive the code itself. unref() keeps this timer from holding the process open.
            setTimeout(() => this.consumedOAuthCodes.delete(payload.jti), AuthService_1.OAUTH_CODE_TTL_MS).unref();
            try {
                codeState = (await this.cacheManager.get(cacheKey)) ?? null;
            }
            catch (error) {
                // The read failed, so this claim guards a code we never proved was live. Hand it
                // back, or a transient cache error would lock a legitimate first exchange out for
                // the code's whole lifetime.
                this.consumedOAuthCodes.delete(payload.jti);
                throw error;
            }
            await this.cacheManager.del(cacheKey);
        }
        if (!codeState) {
            throw new common_1.UnauthorizedException('Authorization code already used');
        }
        const accessToken = await this.getJwtAccessToken({
            id: payload.userId,
            tenantId: payload.tenantId
        });
        // Per-client `accessTokenTtl` is configured on the registry row but
        // `getJwtAccessToken` currently always signs with the global
        // `JWT_TOKEN_EXPIRATION_TIME`. Reporting the per-client TTL would
        // mislead clients into premature / late refreshes, so return the
        // actual JWT lifetime until TTL-aware signing lands.
        const expiresIn = Number(config_1.environment.JWT_TOKEN_EXPIRATION_TIME) || 86400;
        this.logger.log(`OAuth app token exchanged for userId=${payload.userId}, tenantId=${payload.tenantId}, expiresIn=${expiresIn}s`);
        return {
            accessToken,
            expiresIn,
            tokenType: 'Bearer',
            scope: payload.scope ?? ''
        };
    }
    /**
     * User Login Request
     *
     * @param email The user's email address
     * @param password The user's password
     * @returns A Promise that resolves to the authentication response or null
     */
    async login({ email, password }) {
        // Per-ACCOUNT brute-force control, checked before any credential work and OUTSIDE the catch
        // below (which rewrites every failure into a 401 — a lockout has to surface as a 429).
        // The @Throttle on the route is keyed on the client address; this counter is not, so
        // changing address between attempts no longer buys a fresh allowance.
        const attempt = await this.loginAttemptService.begin(login_attempt_service_1.LoginAttemptScope.PASSWORD, email);
        try {
            // Find ALL users by email
            const users = await this.userService.find({
                where: { email, isActive: true, isArchived: false, hash: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()) },
                relations: { role: true },
                order: { updatedAt: 'DESC' } // Order by update time, latest first
            });
            // If no users are found, throw an error
            if (!users || users.length === 0) {
                throw new common_1.UnauthorizedException();
            }
            // Validate each user individually to avoid cascade failures
            const userValidations = [];
            for (const user of users) {
                // Check password using PasswordHashService (supports bcrypt and scrypt)
                let isPasswordValid = false;
                try {
                    isPasswordValid = await this.passwordHashService.verify(password, user.hash);
                }
                catch (hashError) {
                    // We don't log "errors" below because we might have many such users whose passwords are different, really!
                    // console.error(`Password comparison failed for user ${user.id}: ${hashError.message}`);
                    continue; // Skip this user if hash verification fails
                }
                if (!isPasswordValid) {
                    continue; // Skip this user if password doesn't match
                }
                // Progressive password hash migration: rehash with new algorithm if needed
                if (this.passwordHashService.needsRehash(user.hash)) {
                    try {
                        const newHash = await this.passwordHashService.hash(password);
                        await this.userService.changePassword(user.id, newHash);
                    }
                    catch (rehashError) {
                        // Log but don't fail login if rehash fails
                        this.logger.warn(`Failed to rehash password for user ${user.id}: ${rehashError.message}`);
                    }
                }
                // Fetch employee record
                let employee = null;
                let isEmployeeValid = true;
                try {
                    employee = await this.employeeService.findOneByUserId(user.id);
                    // If employee exists, check if it's active and not archived
                    if (employee) {
                        isEmployeeValid = employee.isActive && !employee.isArchived;
                    }
                }
                catch (employeeError) {
                    if (employeeError instanceof common_1.NotFoundException) {
                        // missing employee is okay
                        employee = null;
                        isEmployeeValid = true;
                    }
                    else {
                        // real errors should still bubble up
                        throw employeeError;
                    }
                }
                // Only add to validations if both password and employee status are valid
                if (isEmployeeValid) {
                    userValidations.push({ user, employee });
                }
            }
            // If no valid users are found after validation, throw an error
            if (userValidations.length === 0) {
                throw new common_1.UnauthorizedException();
            }
            // Select the most recently updated user (already sorted by updatedAt DESC)
            const { user: selectedUser, employee } = userValidations[0];
            // Determine organization context for tokens
            let organizationId = employee?.organizationId || selectedUser.lastOrganizationId;
            // A non-employee user whose preference was never persisted (e.g. a freshly seeded
            // super admin) has neither source, and a token without an organization claim fails
            // every consumer of `RequestContext.currentOrganizationId()`. Fall back to the user's
            // first active organization membership and persist it so subsequent logins skip the
            // extra lookup. Best-effort: an unresolvable membership issues the token exactly as
            // before.
            if (!organizationId) {
                organizationId = await this.resolveDefaultOrganizationId(selectedUser.id, selectedUser.tenantId);
                if (organizationId) {
                    await this.userService.setLastOrganizationAndTeam(selectedUser.id, organizationId);
                }
            }
            // Generate both access and refresh tokens concurrently
            const [access_token, refresh_token] = await Promise.all([
                this.getJwtAccessToken(selectedUser, organizationId),
                this.getJwtRefreshToken(selectedUser, organizationId)
            ]);
            // Update user's refresh token and last login timestamp concurrently
            await Promise.all([
                this.userService.setCurrentRefreshToken(refresh_token, selectedUser.id),
                this.userService.setUserLastLoginTimestamp(selectedUser.id)
            ]);
            // Credentials were good: forget the streak that preceded them.
            await attempt.succeed();
            return {
                user: new internal_1.User({
                    ...selectedUser,
                    ...(employee && { employee })
                }),
                token: access_token,
                refresh_token: refresh_token
            };
        }
        catch (error) {
            // Log the error with a timestamp and the error message for debugging
            this.logger.error(`Login failed at ${new Date().toISOString()}: ${error.message}`);
            // Every rejection of the credentials themselves is raised above as UnauthorizedException, and
            // only those count against the account. Anything else (a database or token-signing error) says
            // nothing about the password, and counting it would let an outage lock real users out.
            if (error instanceof common_1.UnauthorizedException) {
                await attempt.fail();
            }
            else {
                await attempt.release();
            }
            throw new common_1.UnauthorizedException();
        }
    }
    /**
     * Last-resort organization scope for a token: the user's first active `UserOrganization`
     * membership.
     *
     * Only consulted when both `employee.organizationId` and `user.lastOrganizationId` are null
     * (a non-employee user — e.g. a freshly seeded super admin — whose preference was never
     * persisted), so the common login paths never pay for the extra query. Runs outside an
     * authenticated request context, which is why the tenant is pinned explicitly in the `where`.
     * Defensive by contract: any lookup failure resolves to null and the token is issued without
     * an organization claim, exactly as it was before this fallback existed.
     *
     * @param userId The user to resolve a membership for.
     * @param tenantId The tenant the membership must belong to.
     * @returns The organization id of the user's first active membership, or null.
     */
    async resolveDefaultOrganizationId(userId, tenantId) {
        try {
            const userOrganization = await this.userOrganizationService.findOneByOptions({
                where: { userId, tenantId, isActive: true, isArchived: false },
                order: { createdAt: 'ASC' }
            });
            return userOrganization?.organizationId ?? null;
        }
        catch {
            // `findOneByOptions` throws when no membership exists — no membership, no claim.
            return null;
        }
    }
    /**
     * Whether `userId` holds an active, non-archived membership of `organizationId` —
     * the same criteria `switchOrganization` enforces before scoping a token.
     *
     * Used to vet a CLIENT-REQUESTED organization before it may become the token's
     * `organizationId` claim: the server-persisted preferences never pass through here.
     *
     * @param userId The user whose membership is checked.
     * @param organizationId The requested organization.
     * @param tenantId The tenant the membership must belong to.
     * @returns True when an active membership backs the request.
     */
    async hasActiveOrganizationMembership(userId, organizationId, tenantId) {
        try {
            const membership = await this.userOrganizationService.findOneByOptions({
                where: { userId, organizationId, tenantId, isActive: true, isArchived: false }
            });
            return !!membership;
        }
        catch {
            // `findOneByOptions` throws when no membership exists.
            return false;
        }
    }
    /**
     * Authenticate a user by email and password and return user workspaces.
     *
     * @param email - The user's email.
     * @param password - The user's password.
     * @returns A promise that resolves to a response with user workspaces.
     * @throws UnauthorizedException if authentication fails.
     */
    async signinWorkspacesByEmailPassword(input, includeTeams) {
        const { email, password } = input;
        // Same per-account control as `login()`: this route verifies the very same password.
        const attempt = await this.loginAttemptService.begin(login_attempt_service_1.LoginAttemptScope.PASSWORD, email);
        /** Fetching users matching the query */
        let allUsers;
        try {
            allUsers = await this.userService.find({
                where: [
                    {
                        email,
                        isActive: true,
                        isArchived: false,
                        hash: (0, typeorm_1.Not)((0, typeorm_1.IsNull)())
                    }
                ],
                relations: { tenant: true },
                order: { createdAt: 'DESC' }
            });
        }
        catch (error) {
            // No verdict on the password: give the slot back rather than counting a failure.
            await attempt.release();
            throw error;
        }
        // Filter users based on password match using async verification
        const validatedUsers = [];
        for (const user of allUsers) {
            try {
                const isValid = await this.passwordHashService.verify(password, user.hash);
                if (isValid) {
                    validatedUsers.push(user);
                    // Progressive password hash migration
                    if (this.passwordHashService.needsRehash(user.hash)) {
                        try {
                            const newHash = await this.passwordHashService.hash(password);
                            await this.userService.changePassword(user.id, newHash);
                        }
                        catch (rehashError) {
                            this.logger.warn(`Failed to rehash password for user ${user.id}: ${rehashError.message}`);
                        }
                    }
                }
            }
            catch (error) {
                // Continue to next user if verification fails
                continue;
            }
        }
        let users = validatedUsers;
        if (users.length === 0) {
            await attempt.fail();
            throw new common_1.UnauthorizedException();
        }
        await attempt.succeed();
        const code = (0, utils_1.generateAlphaNumericCode)();
        const codeExpireAt = moment().add(config_1.environment.MAGIC_CODE_EXPIRATION_TIME, 'seconds').toDate();
        // Update all users with a single query
        const ids = users.map((user) => user.id);
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM:
                await this.mikroOrmUserRepository.nativeUpdate({ id: { $in: ids }, email, isActive: true, isArchived: false }, { code, codeExpireAt });
                break;
            case utils_2.MultiORMEnum.TypeORM:
                await this.typeOrmUserRepository.update({ id: (0, typeorm_1.In)(ids), email, isActive: true, isArchived: false }, { code, codeExpireAt });
                break;
            default:
                throw new Error(`ORM type not implemented: ${this.ormType}`);
        }
        // Determining the response based on the number of matching users
        const response = await this.createUserSigninWorkspaceResponse({
            users,
            code,
            email,
            includeTeams
        });
        if (response.total_workspaces > 0) {
            // Invalidate the code immediately after successful validation.
            // The signed JWT workspace tokens are the proof of auth from here on.
            await this.userService.invalidateMagicCode(email, code);
            return response;
        }
        else {
            this.logger.warn('Signin workspace failed: no matching workspaces found');
            throw new common_1.UnauthorizedException();
        }
    }
    /**
     * Verify OAuth token when signin with social media from Ever Teams
     *
     * @param provider The provider used with user for signin
     * @param token The token generated by OAuth provider from Ever Teams frontend
     * @returns A promise resolved by the provider name and the account ID, both decode from the token
     * @throws A bad request if the provider used by user is not supported
     */
    async verifyOAuthToken(provider, token) {
        switch (provider) {
            case contracts_1.ProviderEnum.GOOGLE:
                return (0, verify_oauth_tokens_1.verifyGoogleToken)(this.httpService, token);
            case contracts_1.ProviderEnum.GITHUB:
                return (0, verify_oauth_tokens_1.verifyGithubToken)(this.httpService, token);
            case contracts_1.ProviderEnum.TWITTER:
                return (0, verify_oauth_tokens_1.verifyTwitterToken)(this.httpService, token);
            case contracts_1.ProviderEnum.FACEBOOK:
                return (0, verify_oauth_tokens_1.verifyFacebookToken)(this.httpService, token);
            default:
                throw new common_1.BadRequestException('Unsupported provider');
        }
    }
    /**
     * Check if any user with the given provider infos exists
     * This function is used to facilitate the GauzyAdapter in Ever Teams try to create new Users or only signin them

     * @param input An object that contains the provider name and the provider Account ID
     * @returns A promise that resolves to a boolean specifying if the user exists or not
     */
    async socialSignupCheckIfUserExistsBySocial(input) {
        const user = await this.socialAccountService.findUserBySocialId(input);
        if (!user)
            return { isUserExists: false };
        return { isUserExists: true };
    }
    /**
     * Authenticate a user by email from social media and return user workspaces.
     *
     * @param email - The user's email.
     * @param password - The user's password.
     * @returns A promise that resolves to a response with user workspaces.
     * @throws UnauthorizedException if authentication fails.
     */
    async signinWorkspacesByEmailSocial(input, includeTeams) {
        const { provider: inputProvider, token } = input;
        const providerData = await this.verifyOAuthToken(inputProvider, token);
        const { email, id: providerAccountId, provider } = providerData;
        const socialAccount = await this.socialAccountService.findAccountByProvider({ provider, providerAccountId });
        /** Fetching users matching the query */
        let users = await this.userService.find({
            where: [
                {
                    email,
                    isActive: true,
                    isArchived: false
                }
            ],
            relations: { tenant: true },
            order: { createdAt: 'DESC' }
        });
        if (users.length === 0) {
            throw new common_1.UnauthorizedException();
        }
        if (!socialAccount) {
            await Promise.all(users.map(async (user) => {
                return await this.socialAccountService.registerSocialAccount({
                    provider,
                    providerAccountId,
                    userId: user.id,
                    user,
                    tenantId: user.tenantId,
                    tenant: user.tenant
                });
            }));
        }
        const code = (0, utils_1.generateAlphaNumericCode)();
        const codeExpireAt = moment().add(config_1.environment.MAGIC_CODE_EXPIRATION_TIME, 'seconds').toDate();
        // Update all users with a single query
        const ids = users.map((user) => user.id);
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM:
                await this.mikroOrmUserRepository.nativeUpdate({ id: { $in: ids }, email, isActive: true, isArchived: false }, { code, codeExpireAt });
                break;
            case utils_2.MultiORMEnum.TypeORM:
                await this.typeOrmUserRepository.update({ id: (0, typeorm_1.In)(ids), email, isActive: true, isArchived: false }, { code, codeExpireAt });
                break;
            default:
                throw new Error(`ORM type not implemented: ${this.ormType}`);
        }
        // Determining the response based on the number of matching users
        const response = await this.createUserSigninWorkspaceResponse({
            users,
            code,
            email,
            includeTeams
        });
        if (response.total_workspaces > 0) {
            return response;
        }
        else {
            this.logger.warn('Social signin workspace failed: no matching workspaces found');
            throw new common_1.UnauthorizedException();
        }
    }
    /**
     * This method links a user to an oAuth account when signin/signup with a social media provider
     *
     * @param input The body request that contains the token to be verified and the provider name
     * @returns A promise that resolved with  an account creation
     */
    async linkUserToSocialAccount(input) {
        try {
            const { provider: inputProvider, token } = input;
            const providerData = await this.verifyOAuthToken(inputProvider, token);
            const { email, id, provider } = providerData;
            const user = await this.userService.getUserByEmail(email);
            if (!user) {
                throw new common_1.BadRequestException('User for these credentials could not be found');
            }
            return await this.socialAccountService.registerSocialAccount({
                provider,
                providerAccountId: id,
                userId: user.id,
                user,
                tenantId: user.tenantId,
                tenant: user.tenant
            });
        }
        catch (error) {
            throw new common_1.BadRequestException('User for these credentials could not be found');
        }
    }
    /**
     * Generate a JWT token for the given user.
     *
     * @param user - The user object for which to generate the token.
     * @returns The JWT token as a string.
     */
    generateToken(user, code) {
        const payload = {
            userId: user.id,
            email: user.email,
            tenantId: user.tenant ? user.tenantId : null,
            code
        };
        return (0, jsonwebtoken_1.sign)(payload, config_1.environment.JWT_SECRET, {
            expiresIn: `${config_1.environment.JWT_TOKEN_EXPIRATION_TIME}s`
        });
    }
    /**
     * Initiates the process to request a password reset.
     *
     * @param request - The reset password request object containing the email address.
     * @param languageCode - The language code used for email communication.
     * @param originUrl - Optional parameter representing the origin URL of the request.
     * @returns A Promise that resolves to a boolean indicating the success of the password reset request
     *          or throws a BadRequestException in case of failure.
     */
    async requestResetPassword(request, languageCode, originUrl) {
        try {
            const { email } = request;
            // Fetch users with specific criteria
            const users = await this.fetchUsers(email);
            // If no users found, silently succeed to prevent user enumeration
            if (users.length === 0) {
                return true;
            }
            // Initialize an array to store reset links along with tenant and user information
            const tenantUsersMap = [];
            // Iterate through users and generate reset links
            for await (const user of users) {
                const { email, tenantId } = user;
                // Generate a dedicated password-reset token (NOT a full access token)
                const token = (0, jsonwebtoken_1.sign)({
                    purpose: 'password-reset',
                    id: user.id,
                    tenantId: tenantId || null
                }, config_1.environment.JWT_SECRET, { expiresIn: '10m' } // Short-lived: 10 minutes
                );
                // Proceed if a valid token and email are obtained
                if (!!token && !!email) {
                    try {
                        // Invalidate all existing password-reset records for this user/email/tenant
                        const deleteWhere = { email, ...(tenantId ? { tenantId } : {}) };
                        switch (this.ormType) {
                            case utils_2.MultiORMEnum.MikroORM:
                                await this.mikroOrmPasswordResetRepository.nativeDelete(deleteWhere);
                                break;
                            case utils_2.MultiORMEnum.TypeORM:
                                await this.typeOrmPasswordResetRepository.delete(deleteWhere);
                                break;
                            default:
                                throw new Error(`ORM type not implemented: ${this.ormType}`);
                        }
                        // Create a new password reset request and generate a reset link
                        await this.commandBus.execute(new commands_1.PasswordResetCreateCommand({
                            email,
                            tenantId,
                            token
                        }));
                        // Initialize Base URL
                        let baseURL = `${config_1.environment.clientBaseUrl}/#/auth/reset-password`;
                        // Generate the reset link using the helper function
                        const resetLink = this.generateResetLink(baseURL, token, email, tenantId);
                        // Add the reset link, tenant, and user to the tenantUsersMap array
                        tenantUsersMap.push({ resetLink, tenant: user.tenant ?? undefined, user });
                    }
                    catch (error) {
                        throw new common_1.BadRequestException('Forgot password request failed!');
                    }
                }
            }
            // If there is only one user, send a password reset email
            if (users.length === 1) {
                const [user] = users;
                const [tenantUserMap] = tenantUsersMap;
                if (tenantUserMap) {
                    const { resetLink } = tenantUserMap;
                    this.emailService.requestPassword(user, resetLink, languageCode, originUrl);
                }
            }
            else {
                // If multiple users are found, send a multi-tenant password reset email
                this.emailService.multiTenantResetPassword(email, tenantUsersMap, languageCode, originUrl);
            }
            // Return success status
            return true;
        }
        catch (error) {
            // Throw a BadRequestException in case of failure
            throw new common_1.BadRequestException('Forgot password request failed!');
        }
    }
    /**
     * Generates a password reset link.
     *
     * @param baseURL The base URL for the reset password page.
     * @param token The token generated for the password reset.
     * @param email The email of the user.
     * @param tenantId The tenant ID (optional).
     * @returns The password reset link.
     */
    generateResetLink(baseURL, token, email, tenantId) {
        // Initialize an object to store query parameters
        const params = { token, email };
        // Add tenantId to the reset link only if it's available
        if (tenantId) {
            params['tenantId'] = tenantId;
        }
        // Convert query params object to a string
        const queryString = (0, utils_1.buildQueryString)(params);
        // Combine base URL with query params
        return `${baseURL}?${queryString}`;
    }
    /**
     * Fetch users from the repository based on specific criteria.
     *
     * @param {string} email - The user's email address.
     * @returns {Promise<User[]>} A Promise that resolves to an array of User objects.
     */
    async fetchUsers(email) {
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const { where, mikroOptions } = (0, utils_2.parseTypeORMFindToMikroOrm)({
                    where: { email, isActive: true, isArchived: false },
                    relations: { tenant: true, role: true }
                });
                return (await this.mikroOrmUserRepository.find(where, mikroOptions));
            }
            case utils_2.MultiORMEnum.TypeORM:
                return await this.typeOrmUserRepository.find({
                    where: { email, isActive: true, isArchived: false },
                    relations: { tenant: true, role: true }
                });
            default:
                throw new Error(`ORM type not implemented: ${this.ormType}`);
        }
    }
    /**
     * Atomically consumes a password-reset record, enforcing single use.
     *
     * The record is claimed with one conditional DELETE keyed on its primary key.
     * Whichever concurrent request wins the row lock deletes it and sees
     * `affected === 1`; every other request finds the row already gone and sees
     * `affected === 0`. Because the claim and the check are the same statement,
     * there is no window between them for a second request to slip through.
     *
     * This has to be a single statement rather than a lock-then-act pair:
     * `SELECT ... FOR UPDATE` throws `LockNotSupportedOnGivenDriverError` on
     * better-sqlite3 under TypeORM, and knex silently drops the lock clause for
     * sqlite under MikroORM — so pessimistic locking is not portable across the
     * databases we support, and better-sqlite3 is the default `DB_TYPE`.
     *
     * `affected` is a real row count on every driver reachable here (postgres
     * `rowCount`, mysql `affectedRows`, better-sqlite3 `changes`; MongoDB is
     * rejected at config time), so treating anything other than 1 as a lost race
     * fails closed.
     *
     * @param record - The password reset record to consume.
     * @returns `true` if this call claimed the record, `false` if it was already used.
     */
    async consumePasswordResetToken(record) {
        // `id` is optional on IPasswordReset. A loaded record always has one, but an undefined value
        // would widen the criteria and delete every row in the table, so refuse rather than risk it.
        if (!record?.id) {
            return false;
        }
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const affected = await this.mikroOrmPasswordResetRepository.nativeDelete((0, claim_criteria_1.passwordResetConsumeWhere)(record.id));
                return affected === 1;
            }
            case utils_2.MultiORMEnum.TypeORM: {
                const { affected } = await this.typeOrmPasswordResetRepository.delete((0, claim_criteria_1.passwordResetConsumeWhere)(record.id));
                return affected === 1;
            }
            default:
                throw new Error(`ORM type not implemented: ${this.ormType}`);
        }
    }
    /**
     * Resets the user's password based on a valid password reset token.
     *
     * @param request - The request object containing the new password and the reset token.
     * @returns A boolean indicating whether the password reset was successful.
     * @throws {BadRequestException} - If the password reset fails due to an invalid, expired or already-used token, or if there is an issue updating the password.
     */
    async resetPassword(request) {
        try {
            const { password, token } = request;
            // Validate the password reset token
            const record = await this.commandBus.execute(new commands_1.PasswordResetGetCommand({ token }));
            if (record.expired) {
                throw new common_1.BadRequestException('Password Reset Failed: Token has expired.');
            }
            // Verify the token and extract user information
            // Validate the purpose claim to ensure this is a dedicated password-reset token
            const decoded = (0, jsonwebtoken_1.verify)(token, config_1.environment.JWT_SECRET);
            // Reject tokens without the password-reset purpose claim
            if (decoded.purpose !== 'password-reset') {
                throw new common_1.BadRequestException('Password Reset Failed: Invalid token type.');
            }
            const { id, tenantId } = decoded;
            // Fetch the user by ID and tenant
            const user = await this.userService.findOneByIdString(id, {
                where: { tenantId },
                relations: { tenant: true }
            });
            if (!user) {
                throw new common_1.NotFoundException('Password Reset Failed.');
            }
            // Claim the token BEFORE changing anything. The record was only read above, so up to
            // this point two requests carrying the same token are still running side by side; the
            // conditional delete is what picks a single winner. Doing it after changePassword — as
            // this flow used to — meant both requests passed validation and both reset the password,
            // with the last writer silently deciding the final credential.
            if (!(await this.consumePasswordResetToken(record))) {
                throw new common_1.BadRequestException('Password Reset Failed: Token has already been used.');
            }
            // Hash the new password using PasswordHashService and update it for the user
            const hash = await this.passwordHashService.hash(password);
            await this.userService.changePassword(user.id, hash);
            // Sweep up any other password-reset records for this user. The consumed record is already
            // gone; this only clears leftovers, so a failure here is not worth failing the reset over.
            try {
                const deleteWhere = { email: user.email, ...(tenantId ? { tenantId } : {}) };
                switch (this.ormType) {
                    case utils_2.MultiORMEnum.MikroORM:
                        await this.mikroOrmPasswordResetRepository.nativeDelete(deleteWhere);
                        break;
                    case utils_2.MultiORMEnum.TypeORM:
                        await this.typeOrmPasswordResetRepository.delete(deleteWhere);
                        break;
                    default:
                        throw new Error(`ORM type not implemented: ${this.ormType}`);
                }
            }
            catch (deleteError) {
                // Log but don't fail the password reset if cleanup fails
                this.logger.warn(`Failed to clean up password-reset records for ${user.email}: ${deleteError?.message}`);
            }
            return true;
        }
        catch (error) {
            this.logger.error(`Password reset failed: ${error?.message}`);
            throw new common_1.BadRequestException('Password Reset Failed.');
        }
    }
    /**
     * Builds the Employee row that `featureAsEmployee` asks for, from fields this function OWNS.
     *
     * The registration input used to be spread wholesale (`create({ ...input, user, tenant… })`).
     * `register()` is the shared sink for three public routes, so on the invite paths `input` IS the
     * request body — and TypeORM's `repository.create()` copies every non-virtual column it finds on
     * a plain object, the PRIMARY KEY included. A body of
     * `{ featureAsEmployee: true, id: "<a victim's employee uuid>" }` therefore produced an entity
     * carrying that id, and `save()` with a primary key present is an UPDATE: the victim's employee
     * row was re-pointed at the attacker's brand-new user (and at the invite's tenant and
     * organization), after which the issued JWT carried the victim's `employeeId`. The repository is
     * a plain `Repository<Employee>`, so none of the tenant-aware create guards applied.
     *
     * Listing the fields costs nothing on the legitimate path: `RegisterUserDTO` whitelists
     * `/auth/register` down to user / password / confirmPassword / organizationId / createdByUserId
     * / featureAsEmployee / terms, and `createdByUserId` is the only one of those that is an
     * Employee column at all.
     *
     * @param input The registration input.
     * @param user The user row that was just created — the employee is always attached to THAT user.
     * @param tenantId The trusted tenant.
     * @param organizationId The trusted organization.
     * @returns A payload that can only ever describe a new employee row.
     */
    buildEmployeeRegistrationPayload(input, user, tenantId, organizationId) {
        return {
            user,
            tenantId,
            tenant: { id: tenantId },
            organizationId,
            organization: { id: organizationId },
            // Already reduced to the authenticated caller (or deleted) in step 1.
            ...(input.createdByUserId ? { createdByUserId: input.createdByUserId } : {})
        };
    }
    /**
     * Refuses an employee entity that already names an existing row.
     *
     * Registration only ever CREATES. `save()` on an entity that carries a primary key is an UPDATE,
     * so an id reaching this point means either a bug or a body field that found its way back into
     * the payload — neither is something to silently write over somebody else's record.
     *
     * @param employee The entity about to be persisted.
     */
    assertEmployeeRowIsNew(employee) {
        if (employee?.id) {
            throw new common_1.ForbiddenException('Registration cannot modify an existing employee record');
        }
    }
    /**
     * Shared method involved in
     * 1. Sign up
     * 2. Addition of new user to organization
     * 3. User invite accept scenario
     *
     * @param input
     * @param languageCode
     * @returns
     */
    async register(input, languageCode) {
        let tenant = input.user.tenant;
        const { organizationId } = input;
        // -1. This is a CREATION sink reachable from public routes (/auth/register, /invite/accept,
        // /invite/contact) whose bodies are attacker-controlled. Strip everything that identifies or
        // privileges an EXISTING account before the payload is spread into create()/save():
        // a body `user.id` would turn the save into an UPDATE of that row (account takeover), and
        // hash / verification / token columns must only ever be derived server-side.
        if (input.user) {
            const { id: _id, hash: _hash, emailVerifiedAt: _emailVerifiedAt, emailToken: _emailToken, code: _code, codeExpireAt: _codeExpireAt, refreshToken: _refreshToken, ...safeUser } = input.user;
            input.user = safeUser;
        }
        // 0. Validate the terms acceptance BEFORE anything irreversible happens.
        //
        // The register form gates its submit button on a hard-required terms
        // checkbox, and until now the value went nowhere: no field on the DTO,
        // no column, no row. The invite-acceptance form had the identical
        // defect. Checking the claims here — ahead of user creation — means a
        // missing, malformed or unpublished claim rejects the registration
        // outright rather than leaving a half-created account behind. The check
        // is pure and synchronous (no storage, no clock, no network), so it is
        // cheap enough for the hot path.
        if ((0, utils_1.isNotEmpty)(input.terms)) {
            this.termsAcceptanceService.assertClaimsArePublished(input.terms);
        }
        // 0.1 Keep the flat `roleId` column consistent with the `role` relation.
        //
        // Every privileged user-creation path funnels through here, and the entity carries both a
        // `role` relation and a `roleId` FK column that wins when the row is persisted. Callers that
        // resolve a trusted role server-side (invite accept, organization-contact accept, employee
        // create) set only `role`, so a caller-supplied `roleId` left in the spread below would
        // override it and escalate the new account. Where a trusted role object is present it is the
        // single source of truth; where it is absent, `roleId` has already been authorized upstream.
        if (input.user?.role?.id) {
            input.user.roleId = input.user.role.id;
        }
        // 1. If createdByUserId is provided, get the creating user and use their tenant — but only when
        // it names the AUTHENTICATED caller. On the public invite routes the field is attacker-controlled
        // and used to override the invite's tenant with any user's tenant (cross-tenant registration).
        const authenticatedUserId = context_1.RequestContext.currentUserId();
        if (input.createdByUserId && (!authenticatedUserId || String(input.createdByUserId) !== String(authenticatedUserId))) {
            delete input.createdByUserId;
        }
        if (input.createdByUserId) {
            const creatingUser = await this.userService.findOneByIdString(input.createdByUserId, {
                relations: {
                    tenant: true
                }
            });
            tenant = creatingUser.tenant;
        }
        // Keep the flat FK consistent with the trusted tenant relation (mirrors the roleId pin above).
        if (tenant?.id && input.user) {
            input.user.tenantId = tenant.id;
        }
        // 1.1 Decide whether this registration is allowed to mint an Employee profile at all.
        //
        // `featureAsEmployee` is a PRIVILEGED field: on `/auth/register` it requires an
        // ADMIN/SUPER_ADMIN JWT (RegisterAuthorizationGuard). The invite routes reach this same
        // function through the command bus, so that guard never runs for them — and they do not need
        // the flag either: `InviteAcceptEmployeeHandler` and `InviteAcceptCandidateHandler` create
        // the employee/candidate row themselves, from the invitation. Honouring a body-supplied flag
        // here let an invitee of ANY role self-provision an employee profile with attacker-chosen
        // `allowManualTime` / `allowModifyTime` / `allowDeleteTime` / `billRateValue` /
        // `isTrackingEnabled`.
        const featureAsEmployee = !!input.featureAsEmployee && !input.inviteId;
        // 2. Register new user
        let user;
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const userEntity = this.mikroOrmUserRepository.create({
                    ...input.user,
                    tenant,
                    ...(input.password ? { hash: await this.passwordHashService.hash(input.password) } : {})
                });
                await this.mikroOrmUserRepository.persistAndFlush(userEntity);
                user = this.serialize(userEntity);
                // 3. Create employee for specific user
                if (featureAsEmployee) {
                    const empEntity = this.mikroOrmEmployeeRepository.create(this.buildEmployeeRegistrationPayload(input, userEntity, tenant.id, organizationId));
                    this.assertEmployeeRowIsNew(empEntity);
                    await this.mikroOrmEmployeeRepository.persistAndFlush(empEntity);
                }
                // 4. Email is automatically verified after accepting an invitation
                if (input.inviteId) {
                    await this.mikroOrmUserRepository.nativeUpdate(user.id, {
                        emailVerifiedAt: (0, utils_2.freshTimestamp)()
                    });
                }
                // 5. Find the latest registered user with role
                const { where, mikroOptions } = (0, utils_2.parseTypeORMFindToMikroOrm)({
                    where: { id: user.id },
                    relations: { role: true }
                });
                user = (await this.mikroOrmUserRepository.findOne(where, mikroOptions));
                break;
            }
            case utils_2.MultiORMEnum.TypeORM: {
                const entity = this.typeOrmUserRepository.create({
                    ...input.user,
                    tenant,
                    ...(input.password ? { hash: await this.passwordHashService.hash(input.password) } : {})
                });
                user = await this.typeOrmUserRepository.save(entity);
                // 3. Create employee for specific user
                if (featureAsEmployee) {
                    const employee = this.typeOrmEmployeeRepository.create(this.buildEmployeeRegistrationPayload(input, user, tenant.id, organizationId));
                    this.assertEmployeeRowIsNew(employee);
                    await this.typeOrmEmployeeRepository.save(employee);
                }
                // 4. Email is automatically verified after accepting an invitation
                if (input.inviteId) {
                    await this.typeOrmUserRepository.update(user.id, {
                        emailVerifiedAt: (0, utils_2.freshTimestamp)()
                    });
                }
                // 5. Find the latest registered user with role
                user = await this.typeOrmUserRepository.findOne({
                    where: { id: user.id },
                    relations: { role: true }
                });
                break;
            }
            default:
                throw new Error(`ORM type not implemented: ${this.ormType}`);
        }
        // 5b. Record the terms acceptance, now that the user has an id.
        //
        // This is the whole point of the change: the tick becomes a row that
        // says which document, at which version, of which exact text (pinned by
        // sha256 to the published legal corpus), in which language, and by what
        // mechanism. `method` distinguishes the two paths that reach this
        // function — a checkbox during signup and a checkbox on an invite
        // acceptance are legally different events, and "we can't tell which
        // happened" is not a position worth defending.
        //
        // Failures are logged and swallowed deliberately. The claims were
        // already validated against the corpus in step 0, so anything that goes
        // wrong here is an infrastructure fault, and by this point the user row
        // exists: throwing would abandon a created account and send the person
        // back to a form that will now tell them their email is taken. The
        // write is idempotent, so a retry is safe.
        if ((0, utils_1.isNotEmpty)(input.terms)) {
            try {
                const request = context_1.RequestContext.currentRequest();
                await this.termsAcceptanceService.record(user.id, input.terms, {
                    tenantId: tenant?.id ?? null,
                    method: input.inviteId ? 'invite-accept' : 'signup-checkbox',
                    // `hashIp` salts and digests this; the address itself is
                    // never stored. Without TERMS_IP_SALT nothing is recorded.
                    ip: request?.ip ?? null,
                    userAgent: request?.headers?.['user-agent'] ?? null
                });
            }
            catch (error) {
                this.logger.error(`Failed to record terms acceptance for user ${user.id}: ${error instanceof Error ? error.message : String(error)}`, error instanceof Error ? error.stack : undefined);
            }
        }
        // 6. If organizationId is provided, add the user to the organization
        if ((0, utils_1.isNotEmpty)(input.organizationId)) {
            await this.userOrganizationService.addUserToOrganization(user, input.organizationId);
        }
        // 7. Create Import Records while migrating for a relative user
        if (input.isImporting && input.sourceId) {
            this.commandBus.execute(new import_record_1.ImportRecordUpdateOrCreateCommand({
                entityType: this.typeOrmUserRepository.metadata.tableName,
                sourceId: input.sourceId,
                destinationId: user.id
            }));
        }
        // Extract integration information
        let integration = (0, underscore_1.pick)(input, [
            'appName',
            'appLogo',
            'appSignature',
            'appLink',
            'appEmailConfirmationUrl',
            'companyLink',
            'companyName'
        ]);
        // 8. If the user's email is not verified, send an email verification
        if (!user.emailVerifiedAt) {
            this.emailConfirmationService.sendEmailVerification(user, integration);
        }
        // Publish the account registration event
        const ctx = context_1.RequestContext.currentRequestContext();
        const event = new events_1.AccountRegistrationEvent(ctx, user); // ToDo: Send a welcome email to user from events
        await this.eventBus.publish(event);
        // 9. Send a welcome email to the user
        this.emailService.welcomeUser(input.user, languageCode, input.organizationId, input.originalUrl, integration);
        return user;
    }
    /**
     *
     * @param id
     * @param thirdPartyId
     * @returns
     */
    async getAuthenticatedUser(id, thirdPartyId) {
        return thirdPartyId ? this.userService.getIfExistsThirdParty(thirdPartyId) : this.userService.getIfExists(id);
    }
    /**
     *
     * @param token
     * @returns
     */
    async isAuthenticated(token) {
        try {
            const { id, thirdPartyId } = await this.accessTokenService.verify(token);
            if (thirdPartyId) {
                return this.userService.checkIfExistsThirdParty(thirdPartyId);
            }
            return this.userService.checkIfExists(id);
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.JsonWebTokenError || error instanceof common_1.UnauthorizedException) {
                return false;
            }
            return false;
        }
    }
    /**
     * Check if the current user has any of the specified roles
     *
     * @param roles Array of role names to check against
     * @returns A promise that resolves to true if the user has one of the specified roles, false otherwise
     */
    async hasRole(roles = []) {
        try {
            // Get the current role ID from the request context
            const currentRoleId = context_1.RequestContext.currentRoleId();
            // Retrieve the role associated with the current user
            const role = await this.roleService.findOneByIdString(currentRoleId);
            // Check if the role has any of the specified roles
            return role ? roles.includes(role.name) : false;
        }
        catch (err) {
            if (err instanceof jsonwebtoken_1.JsonWebTokenError) {
                return false;
            }
        }
    }
    /**
     * Check if the current user has any of the specified permissions
     *
     * @param permissions Array of permissions to check against
     * @returns A promise that resolves to true if the user has one of the specified permissions, false otherwise
     */
    async hasPermissions(permissions = []) {
        try {
            // Get the current role ID from the request context
            const roleId = context_1.RequestContext.currentRoleId();
            //	Check if the role has any of the specified permissions
            const count = await this.roleService.countBy({
                id: roleId,
                isActive: true,
                isArchived: false,
                rolePermissions: {
                    permission: (0, typeorm_1.In)(permissions),
                    enabled: true,
                    isActive: true,
                    isArchived: false
                }
            });
            return count > 0;
        }
        catch (error) {
            return false;
        }
    }
    /**
     *
     * @param emails
     * @returns
     */
    async validateOAuthLoginEmail(emails) {
        let response = {
            success: false,
            authData: { jwt: null, userId: null }
        };
        try {
            for (const { value, verified } of emails) {
                // Skip unverified emails to prevent account takeover via unverified OAuth addresses
                if (!verified)
                    continue;
                const userExist = await this.userService.checkIfExistsEmail(value);
                if (userExist) {
                    const user = await this.userService.getOAuthLoginEmail(value);
                    const token = await this.getJwtAccessToken(user);
                    response = {
                        success: true,
                        authData: { jwt: token, userId: user.id }
                    };
                    // Break the loop and return the response
                    return response;
                }
            }
            return response;
        }
        catch (err) {
            throw new common_1.InternalServerErrorException('validateOAuthLoginEmail', err.message);
        }
    }
    /**
     * Generates a JWT access token for a given user.
     *
     * This function takes a partial user object, primarily the user's ID,
     * and retrieves the user's details including their role and permissions.
     * It then constructs a JWT payload and generates a token.
     * If the user does not exist, an error is thrown.
     *
     * @param request A partial IUser object, mainly containing the user's ID.
     * @param organizationId Optional organization ID to use for finding the employee.
     *                       If not provided, uses RequestContext.currentOrganizationId().
     * @returns A Promise that resolves to a JWT access token string.
     * @throws Throws an UnauthorizedException if the user is not found or if there is an issue in token generation.
     */
    async getJwtAccessToken(request, organizationId, metadata) {
        const tenantId = request.tenantId || context_1.RequestContext.currentTenantId();
        try {
            // Validate that the request contains a user ID
            if (!request.id) {
                throw new Error('User ID is missing in the request.');
            }
            this.logger.debug(`Request getJwtAccessToken with Id: ${request.id}`);
            // Extract the user ID from the request
            const userId = request.id;
            // Retrieve the user's data using Multi-ORM pattern to bypass tenant filtering
            let user;
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM: {
                    const { where, mikroOptions } = (0, utils_2.parseTypeORMFindToMikroOrm)({
                        where: {
                            id: userId,
                            tenantId,
                            isActive: true,
                            isArchived: false
                        },
                        relations: { role: { rolePermissions: true } },
                        order: { createdAt: 'DESC' }
                    });
                    user = (await this.mikroOrmUserRepository.findOne(where, mikroOptions));
                    break;
                }
                case utils_2.MultiORMEnum.TypeORM: {
                    user = await this.typeOrmUserRepository.findOne({
                        where: {
                            id: userId,
                            tenantId,
                            isActive: true,
                            isArchived: false
                        },
                        relations: { role: { rolePermissions: true } },
                        order: { createdAt: 'DESC' }
                    });
                    break;
                }
                default:
                    throw new Error(`Method not implemented for ORM type: ${this.ormType}`);
            }
            // Throw an error if the user is not found
            if (!user) {
                this.logger.error(`User not found: ${request.id}`);
                throw new common_1.UnauthorizedException();
            }
            // Retrieve the employee details associated with the user.
            // Query directly via repository to bypass TenantAwareCrudService which forces RequestContext.currentTenantId().
            // This ensures correct employee lookup when tenantId differs from RequestContext (e.g. workspace switch).
            let employee = null;
            const employeeAccessWhere = {
                userId: user.id,
                tenantId,
                isActive: true,
                isArchived: false,
                ...(organizationId && { organizationId })
            };
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM: {
                    const parsed = (0, utils_2.parseTypeORMFindToMikroOrm)({ where: employeeAccessWhere });
                    employee = (await this.mikroOrmEmployeeRepository.findOne(parsed.where, parsed.mikroOptions));
                    break;
                }
                case utils_2.MultiORMEnum.TypeORM: {
                    employee = await this.typeOrmEmployeeRepository.findOne({ where: employeeAccessWhere });
                    break;
                }
                default:
                    throw new Error(`Method not implemented for ORM type: ${this.ormType}`);
            }
            // Create a payload for the JWT token
            const payload = {
                id: user.id,
                tenantId: user.tenantId ?? null,
                organizationId: organizationId ?? employee?.organizationId ?? null,
                employeeId: employee ? employee.id : null,
                role: user.role ? user.role.name : null,
                permissions: user.role?.rolePermissions?.filter((rp) => rp.enabled).map((rp) => rp.permission) ?? null,
                ipAddress: context_1.RequestContext.currentIp(),
                userAgent: context_1.RequestContext.currentUserAgent(),
                ...(metadata?.clientId && { clientId: metadata.clientId })
            };
            // Generate the JWT access token using the payload
            return this.accessTokenService.generate(userId, payload);
        }
        catch (error) {
            // Log and rethrow any errors encountered during the process
            this.logger.error('Error while generating JWT access token:', error?.message);
            throw new common_1.UnauthorizedException();
        }
    }
    /**
     * Generates a JWT refresh token for a given user.
     *
     * This function takes a user object and constructs a JWT payload with the user's
     * ID, email, tenant ID, and role. It then generates a refresh token based on this payload.
     *
     * @param user A partial IUser object containing at least the user's ID, email, and role.
     * @param organizationId Optional organization ID to include in the token.
     * @param metadata Optional metadata to include in the token payload.
     * @returns A Promise that resolves to a JWT refresh token string.
     * @throws Logs an error and throws an exception if the token generation fails.
     */
    async getJwtRefreshToken(user, organizationId, metadata) {
        try {
            // Ensure the user object contains the necessary information
            if (!user.id || !user.email) {
                throw new Error('User ID or email is missing.');
            }
            // Construct the JWT payload with organization context
            const payload = {
                id: user.id,
                email: user.email,
                tenantId: user.tenantId || null,
                organizationId: organizationId || user.lastOrganizationId || null,
                role: user.role ? user.role.name : null,
                ipAddress: context_1.RequestContext.currentIp(),
                userAgent: context_1.RequestContext.currentUserAgent(),
                ...(metadata?.clientId && { clientId: metadata.clientId })
            };
            return this.refreshTokenService.generate(user.id, payload);
        }
        catch (error) {
            this.logger.error('Error while generating JWT refresh token:', error?.message);
            throw new common_1.UnauthorizedException('Unable to generate refresh token');
        }
    }
    /**
     * Rotates the JWT refresh token for a given user.
     *
     * This function takes an existing refresh token, validates it, and generates a new refresh token with updated payload information.
     * It ensures that the user information is up-to-date and includes organization context if provided.
     *
     * @param token The existing JWT refresh token to be rotated.
     * @param user A partial IUser object containing at least the user's ID, email, and role.
     * @param organizationId Optional organization ID to include in the new token.
     * @param metadata Optional metadata to include in the token payload.
     * @returns A Promise that resolves to a new JWT refresh token string.
     * @throws Logs an error and throws an exception if the token rotation fails.
     */
    async rotateRefreshToken(token, user, organizationId, metadata) {
        try {
            // Ensure the user object contains the necessary information
            if (!user.id || !user.email) {
                throw new Error('User ID or email is missing.');
            }
            // Construct the JWT payload with organization context
            const payload = {
                id: user.id,
                email: user.email,
                tenantId: user.tenantId || null,
                organizationId: organizationId || user.lastOrganizationId || null,
                role: user.role ? user.role.name : null,
                ipAddress: context_1.RequestContext.currentIp(),
                userAgent: context_1.RequestContext.currentUserAgent(),
                ...(metadata?.clientId && { clientId: metadata.clientId })
            };
            return this.refreshTokenService.rotate(token, payload);
        }
        catch (error) {
            this.logger.error('Error while rotating JWT refresh token:', error?.message);
            throw new common_1.UnauthorizedException('Unable to rotate refresh token');
        }
    }
    /**
     * Get JWT access token from JWT refresh token
     *
     * Extracts the organization context from the refresh token to maintain
     * the user's organization selection across token refreshes.
     *
     * Note: The refresh token is organization-specific (contains organizationId).
     * When refreshing, the new access token will use the same organization context.
     * To switch organizations, use the /auth/switch-organization endpoint instead.
     *
     * @returns {Promise<{ token: string, refresh_token: string } | null>}
     */
    async getAccessTokenFromRefreshToken() {
        try {
            // Get the current user from the request context
            const user = context_1.RequestContext.currentUser();
            // If no user is found, return null
            if (!user)
                return null;
            // Extract organizationId from the current token (refresh token context)
            // This ensures the new access token maintains the organization context
            const organizationId = context_1.RequestContext.currentOrganizationId() || user.lastOrganizationId;
            // Get and return the JWT access token for the user with organization context
            const [access_token, refresh_token] = await Promise.all([
                this.getJwtAccessToken(user, organizationId),
                this.getJwtRefreshToken(user, organizationId)
            ]);
            // Update the user's current refresh token in the database
            await this.userService.setCurrentRefreshToken(refresh_token, user.id);
            // Return both the new access token and refresh token
            return { token: access_token, refresh_token };
        }
        catch (error) {
            // If the error is an UnauthorizedException or subclass, re-throw it so controllers return 401
            if (error instanceof common_1.UnauthorizedException ||
                (error && typeof error.status === 'number' && error.status === 401)) {
                throw error;
            }
            // Otherwise, log and return null for non-auth/internal errors
            this.logger.error('Error while retrieving JWT access token from refresh token:', error?.message);
            return null;
        }
    }
    /**
     * Rotates the JWT tokens for the current user.
     *
     * @param token - The current refresh token.
     * @param metadata - Optional metadata to include in the token payload.
     * @returns {Promise<ITokenPair | null>} - The new access and refresh tokens, or null if an error occurs.
     */
    async rotateTokens(token, metadata) {
        try {
            // Get the current user from the request context
            const user = context_1.RequestContext.currentUser();
            // If no user is found, return null
            if (!user)
                return null;
            // Extract organizationId from the current token (refresh token context)
            // This ensures the new access token maintains the organization context
            const organizationId = context_1.RequestContext.currentOrganizationId() || user.lastOrganizationId;
            // Get and return the JWT access token for the user with organization context
            // Generate the access token first (non-destructive). Only rotate the refresh token after
            // successful access-token generation to avoid revoking the old refresh token if
            // access-token generation fails.
            const access_token = await this.getJwtAccessToken(user, organizationId, metadata);
            const refresh_token = await this.rotateRefreshToken(token, user, organizationId, metadata);
            // Update the user's current refresh token in the database
            await this.userService.setCurrentRefreshToken(refresh_token, user.id);
            // Return both the new access token and refresh token
            return { token: access_token, refresh_token };
        }
        catch (error) {
            // If the error is an UnauthorizedException or subclass, re-throw it so controllers return 401
            if (error instanceof common_1.UnauthorizedException ||
                (error && typeof error.status === 'number' && error.status === 401)) {
                throw error;
            }
            // Otherwise, log and return null for non-auth/internal errors
            this.logger.error('Error while retrieving JWT access token from refresh token:', error?.message);
            return null;
        }
    }
    /**
     * Sends a unique authentication code to the user's email for workspace sign-in.
     *
     * @param input - User email input along with partial app integration configuration.
     * @param locale - Language/locale for email content.
     * @returns {Promise<void>} - A promise indicating the completion of the operation.
     */
    async sendWorkspaceSigninCode(input, locale) {
        const { email } = input;
        // Check if the email is provided
        if (!email) {
            this.logger.warn('Magic login code request rejected: email is required');
            return;
        }
        try {
            // Count the number of users with the given email
            let count;
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM:
                    count = await this.mikroOrmUserRepository.count({ email });
                    break;
                case utils_2.MultiORMEnum.TypeORM:
                    count = await this.typeOrmUserRepository.countBy({ email });
                    break;
                default:
                    throw new Error(`ORM type not implemented: ${this.ormType}`);
            }
            // If no user found with the email, return
            if (count === 0) {
                // Silently succeed to prevent user enumeration
                this.logger.debug('Magic login code request: no matching users found');
                return;
            }
            // Generate a random alphanumeric code
            let magicCode;
            let isDemoCode = false;
            // Check if the environment variable 'DEMO' is set to 'true' and the Node.js environment is set to 'development'
            const IS_DEMO = process.env.DEMO === 'true' && process.env.NODE_ENV === 'development';
            this.logger.debug(`Auth Is Demo: ${IS_DEMO}`);
            // If it's a demo environment, handle special cases
            if (IS_DEMO) {
                const demoEmployeeEmail = config_1.environment.demoCredentialConfig?.employeeEmail || 'employee@ever.co';
                const demoAdminEmail = config_1.environment.demoCredentialConfig?.adminEmail || 'local.admin@ever.co';
                this.logger.debug(`Demo Employee Email: ${demoEmployeeEmail}`);
                this.logger.debug(`Demo Admin Email: ${demoAdminEmail}`);
                // Check the value of the 'email' variable against certain demo email addresses
                if (email === demoEmployeeEmail || email === demoAdminEmail) {
                    magicCode = constants_1.DEMO_PASSWORD_LESS_MAGIC_CODE || config_1.environment.demoCredentialConfig?.employeePassword;
                    isDemoCode = true;
                }
            }
            if (!isDemoCode) {
                magicCode = (0, utils_1.generateAlphaNumericCode)();
            }
            // Calculate the expiration time for the code
            const codeExpireAt = moment()
                .add(config_1.environment.MAGIC_CODE_EXPIRATION_TIME || 600, 'seconds')
                .toDate();
            // Update each user record individually (not blanket-update all users sharing the email)
            // This prevents cross-tenant magic code leaking
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM: {
                    const users = await this.mikroOrmUserRepository.find({ email }, { fields: ['id'] });
                    for (const user of users) {
                        await this.mikroOrmUserRepository.nativeUpdate(user.id, { code: magicCode, codeExpireAt });
                    }
                    break;
                }
                case utils_2.MultiORMEnum.TypeORM: {
                    const users = await this.typeOrmUserRepository.find({
                        where: { email },
                        select: {
                            id: true
                        }
                    });
                    for (const user of users) {
                        await this.typeOrmUserRepository.update(user.id, { code: magicCode, codeExpireAt });
                    }
                    break;
                }
                default:
                    throw new Error(`ORM type not implemented: ${this.ormType}`);
            }
            // Do NOT log the magic code — sensitive credential
            this.logger.debug(`Magic code sent for email: ${email}, expires at: ${codeExpireAt}`);
            // If it's not a demo code, send the magic code to the user's email
            if (!isDemoCode) {
                // Extract integration information
                let appIntegration = (0, underscore_1.pick)(input, [
                    'appName',
                    'appLogo',
                    'appSignature',
                    'appLink',
                    'companyLink',
                    'companyName',
                    'appMagicSignUrl'
                ]);
                // Override the default config by merging in the provided values.
                const integration = (0, utils_1.deepMerge)(config_1.environment.appIntegrationConfig, appIntegration);
                let magicLink;
                if (integration.appMagicSignUrl) {
                    magicLink = `${integration.appMagicSignUrl}?email=${email}&code=${magicCode}`;
                }
                // Do NOT log the magic link — contains sensitive code
                this.logger.debug(`Magic link generated for email: ${email}`);
                // Send the magic code to the user's email
                await this.emailService.sendMagicLoginCode({
                    email,
                    magicCode,
                    magicLink,
                    locale,
                    integration
                });
            }
        }
        catch (error) {
            this.logger.error(`Error while sending workspace magic login code: ${error?.message}`);
        }
    }
    /**
     * Validate a magic code and return the available workspaces for the user.
     *
     * The magic code is invalidated immediately after validation so it cannot
     * be replayed. A short-lived signed JWT is returned per workspace — that
     * JWT is the proof of authentication for the subsequent
     * `workspaceSigninVerifyToken` call.
     *
     * @param payload - The user email and magic code input.
     * @param includeTeams - Whether to include team information in the workspace response.
     * @returns The user sign-in workspace response.
     */
    async signinWorkspacesByMagicCode(payload, includeTeams) {
        // The magic code is six alphanumeric characters, so the per-account counter is the control
        // that actually bounds guessing here. Checked outside the catch, which turns everything
        // into a 401.
        const attempt = await this.loginAttemptService.begin(login_attempt_service_1.LoginAttemptScope.MAGIC_CODE, payload?.email);
        try {
            const { email, code } = payload;
            // Check for missing email or code
            if (!email || !code) {
                throw new common_1.UnauthorizedException();
            }
            // Find users matching the criteria
            let users;
            // Build the shared lookup criteria once, reused by both ORM adapters
            const where = {
                email,
                code,
                codeExpireAt: (0, typeorm_1.MoreThanOrEqual)(new Date()),
                isActive: true,
                isArchived: false
            };
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM: {
                    const { where: mikroWhere, mikroOptions } = (0, utils_2.parseTypeORMFindToMikroOrm)({
                        where,
                        relations: { tenant: true }
                    });
                    users = (await this.mikroOrmUserRepository.find(mikroWhere, mikroOptions));
                    break;
                }
                case utils_2.MultiORMEnum.TypeORM: {
                    users = await this.typeOrmUserRepository.find({ where, relations: { tenant: true } });
                    break;
                }
                default:
                    throw new Error(`ORM type not implemented: ${this.ormType}`);
            }
            // Build the workspace response based on the matching users
            const response = await this.createUserSigninWorkspaceResponse({
                users,
                code,
                email,
                includeTeams
            });
            // Return the response if there are matching workspaces
            if (response.total_workspaces > 0) {
                // Claim the code before releasing the workspace tokens. The lookup above only READ
                // it, so two requests carrying the same code are still running side by side here;
                // the conditional update is what picks a winner, because its WHERE clause still
                // contains the code and the loser therefore matches zero rows. Invalidating without
                // checking the count — as this used to — meant both requests were handed valid
                // signed workspace tokens from a single single-use code.
                const claimed = await this.userService.invalidateMagicCode(email, code);
                if (claimed === 0) {
                    throw new common_1.UnauthorizedException();
                }
                await attempt.succeed();
                return response;
            }
            throw new common_1.UnauthorizedException();
        }
        catch (error) {
            // A wrong, expired or already-claimed code is raised above as UnauthorizedException; only
            // that counts against the account. A lookup or claim that failed for infrastructure reasons
            // says nothing about the code.
            if (error instanceof common_1.UnauthorizedException) {
                await attempt.fail();
            }
            else {
                await attempt.release();
            }
            throw new common_1.UnauthorizedException();
        }
    }
    /**
     * Verify a workspace signin JWT and issue access/refresh tokens.
     *
     * The magic code was already validated and invalidated by
     * `signinWorkspacesByMagicCode`. The signed JWT (verified via
     * `JWT_SECRET` with a short expiry) is the sole proof of
     * authentication here — no DB code check is needed.
     *
     * @param input - The user email and token input.
     * @returns An object containing user information and tokens.
     */
    async workspaceSigninVerifyToken(input) {
        try {
            const { email, token, lastOrganizationId, lastTeamId } = input;
            // Check for missing email or token
            if (!email || !token) {
                throw new common_1.UnauthorizedException();
            }
            // Verify and decode the JWT token
            const payload = this.verifyToken(token);
            if (typeof payload !== 'object') {
                throw new common_1.UnauthorizedException();
            }
            const { userId, tenantId } = payload;
            // The magic code was already consumed by signinWorkspacesByMagicCode.
            // The signed JWT is the proof of auth — verify identity and account status only.
            const where = {
                id: userId,
                email,
                tenantId,
                isActive: true,
                isArchived: false
            };
            // Look up the user with role relation
            let user;
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM: {
                    const parsed = (0, utils_2.parseTypeORMFindToMikroOrm)({ where, relations: { role: true } });
                    user = (await this.mikroOrmUserRepository.findOneOrFail(parsed.where, parsed.mikroOptions));
                    break;
                }
                case utils_2.MultiORMEnum.TypeORM: {
                    user = await this.typeOrmUserRepository.findOneOrFail({ where, relations: { role: true } });
                    break;
                }
                default:
                    throw new Error(`ORM type not implemented: ${this.ormType}`);
            }
            // Retrieve the employee details associated with the user
            const employee = await this.employeeService.findOneByUserId(user.id);
            // Check if the employee is active and not archived
            if (employee && (!employee.isActive || employee.isArchived)) {
                throw new common_1.UnauthorizedException();
            }
            // Determine organization context for tokens. The REQUESTED organization is a
            // client-supplied hint, not an entitlement: unlike the server-persisted fallbacks
            // it must be backed by an active membership (the same criteria `switchOrganization`
            // enforces) before it may scope the token — otherwise any workspace-token holder
            // could mint a token claiming a sibling organization of the tenant. An unbacked
            // hint (e.g. a stale client cache after the membership was revoked) falls back to
            // the persisted values instead of failing the whole signin.
            let organizationId = user.lastOrganizationId ?? employee?.organizationId;
            if (lastOrganizationId &&
                (await this.hasActiveOrganizationMembership(user.id, lastOrganizationId, user.tenantId))) {
                organizationId = lastOrganizationId;
            }
            // Same backfill as `login()`: a non-employee user with no persisted preference gets
            // their first active organization membership so the token carries a usable scope.
            // `setLastOrganizationAndTeam` below persists whatever is resolved here.
            if (!organizationId) {
                organizationId = await this.resolveDefaultOrganizationId(user.id, user.tenantId);
            }
            // Generate access and refresh tokens concurrently
            const [accessToken, refreshToken] = await Promise.all([
                this.getJwtAccessToken(user, organizationId),
                this.getJwtRefreshToken(user, organizationId)
            ]);
            await Promise.all([
                // Store refresh token and update login metadata concurrently
                this.userService.setCurrentRefreshToken(refreshToken, user.id),
                this.userService.setUserLastLoginTimestamp(user.id),
                // Persist the resolved organization/team preference so the DB stays
                // in sync with whatever value was embedded in the tokens above.
                this.userService.setLastOrganizationAndTeam(user.id, organizationId, lastTeamId)
            ]);
            return {
                user: new internal_1.User({
                    ...user,
                    ...(employee && { employee })
                }),
                token: accessToken,
                refresh_token: refreshToken
            };
        }
        catch (error) {
            if (error?.name === 'TokenExpiredError') {
                throw new common_1.BadRequestException('JWT token has been expired.');
            }
            this.logger.error(`Error while signin workspace for specific tenant: ${error?.message}`);
            throw new common_1.UnauthorizedException(error?.message);
        }
    }
    /**
     * Verify the JWT token and return the payload.
     * @param token - The JWT token to verify.
     * @returns The token payload or throws an error.
     */
    verifyToken(token) {
        try {
            return (0, jsonwebtoken_1.verify)(token, config_1.environment.JWT_SECRET);
        }
        catch (error) {
            if (error?.name === 'TokenExpiredError') {
                throw new common_1.BadRequestException('JWT token has expired.');
            }
            this.logger.error(`Error while verifying JWT token: ${error?.message}`);
            throw new common_1.UnauthorizedException(error?.message);
        }
    }
    /**
     * Get teams for a user within a specific tenant.
     *
     * @param tenantId The ID of the tenant.
     * @param userId The ID of the user.
     * @param employeeId The ID of the employee (optional).
     *
     * @returns A Promise that resolves to an array of IOrganizationTeam objects.
     */
    async getTeamsForUser(tenantId, userId, employeeId) {
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const knex = this.mikroOrmOrganizationTeamRepository.getKnex();
                const alias = 'organization_team';
                let sq = knex(alias)
                    .select([
                    knex.raw((0, database_helper_1.prepareSQLQuery)(`"${alias}"."id" AS "team_id"`)),
                    knex.raw((0, database_helper_1.prepareSQLQuery)(`"${alias}"."name" AS "team_name"`)),
                    knex.raw((0, database_helper_1.prepareSQLQuery)(`"${alias}"."logo" AS "team_logo"`)),
                    knex.raw((0, database_helper_1.prepareSQLQuery)(`COALESCE(COUNT("team_member"."id"), 0) AS "team_member_count"`)),
                    knex.raw((0, database_helper_1.prepareSQLQuery)(`"${alias}"."profile_link" AS "profile_link"`)),
                    knex.raw((0, database_helper_1.prepareSQLQuery)(`"${alias}"."prefix" AS "prefix"`))
                ])
                    .innerJoin('organization_team_employee AS team_member', `team_member.organizationTeamId`, `${alias}.id`)
                    .where(`${alias}.tenantId`, tenantId)
                    .andWhere(`${alias}.isActive`, true)
                    .andWhere(`${alias}.isArchived`, false);
                // Sub Query: only assigned teams for specific organizations
                const orgSubQuery = knex('user_organization')
                    .select('user_organization.organizationId')
                    .where('user_organization.isActive', true)
                    .andWhere('user_organization.isArchived', false)
                    .andWhere('user_organization.userId', userId)
                    .andWhere('user_organization.tenantId', tenantId)
                    .distinct();
                sq = sq.whereIn(`${alias}.organizationId`, orgSubQuery);
                // Sub Query: only assigned teams for a specific employee
                const teamSubQuery = knex('organization_team_employee')
                    .select('organization_team_employee.organizationTeamId')
                    .where('organization_team_employee.isActive', true)
                    .andWhere('organization_team_employee.isArchived', false)
                    .andWhere('organization_team_employee.tenantId', tenantId)
                    .whereIn('organization_team_employee.organizationId', orgSubQuery);
                if ((0, utils_1.isNotEmpty)(employeeId)) {
                    teamSubQuery.andWhere('organization_team_employee.employeeId', employeeId);
                }
                sq = sq.whereIn(`${alias}.id`, teamSubQuery);
                sq = sq.groupBy(`${alias}.id`).orderBy(`${alias}.createdAt`, 'desc');
                return (await knex.raw(sq.toString())).rows || (await sq);
            }
            case utils_2.MultiORMEnum.TypeORM: {
                const query = this.typeOrmOrganizationTeamRepository.createQueryBuilder('organization_team');
                query.innerJoin(`organization_team_employee`, `team_member`, (0, database_helper_1.prepareSQLQuery)('"team_member"."organizationTeamId" = "organization_team"."id"'));
                query.select([
                    (0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."id" AS "team_id"`),
                    (0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."name" AS "team_name"`),
                    (0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."logo" AS "team_logo"`),
                    (0, database_helper_1.prepareSQLQuery)(`COALESCE(COUNT("team_member"."id"), 0) AS "team_member_count"`),
                    (0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."profile_link" AS "profile_link"`),
                    (0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."prefix" AS "prefix"`)
                ]);
                query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."tenantId" = :tenantId`), { tenantId });
                query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."isActive" = :isActive`), { isActive: true });
                query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."isArchived" = :isArchived`), { isArchived: false });
                // Sub Query to get only assigned teams for specific organizations
                const orgSubQuery = (cb) => {
                    const subQuery = cb
                        .subQuery()
                        .select((0, database_helper_1.prepareSQLQuery)('"user_organization"."organizationId"'))
                        .from('user_organization', 'user_organization');
                    subQuery.andWhere((0, database_helper_1.prepareSQLQuery)(`"${subQuery.alias}"."isActive" = :isActive`), { isActive: true });
                    subQuery.andWhere((0, database_helper_1.prepareSQLQuery)(`"${subQuery.alias}"."isArchived" = :isArchived`), { isArchived: false });
                    subQuery.andWhere((0, database_helper_1.prepareSQLQuery)(`"${subQuery.alias}"."userId" = :userId`), { userId });
                    subQuery.andWhere((0, database_helper_1.prepareSQLQuery)(`"${subQuery.alias}"."tenantId" = :tenantId`), { tenantId });
                    return subQuery.distinct(true).getQuery();
                };
                // Sub Query to get only assigned teams for specific organizations
                query.andWhere((cb) => {
                    return (0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationId" IN ` + orgSubQuery(cb));
                });
                // Sub Query to get only assigned teams for a specific employee for specific tenant
                query.andWhere((cb) => {
                    const subQuery = cb
                        .subQuery()
                        .select((0, database_helper_1.prepareSQLQuery)('"organization_team_employee"."organizationTeamId"'))
                        .from('organization_team_employee', 'organization_team_employee');
                    subQuery.andWhere((0, database_helper_1.prepareSQLQuery)(`"${subQuery.alias}"."isActive" = :isActive`), { isActive: true });
                    subQuery.andWhere((0, database_helper_1.prepareSQLQuery)(`"${subQuery.alias}"."isArchived" = :isArchived`), { isArchived: false });
                    subQuery.andWhere((0, database_helper_1.prepareSQLQuery)(`"${subQuery.alias}"."tenantId" = :tenantId`), { tenantId });
                    if ((0, utils_1.isNotEmpty)(employeeId)) {
                        subQuery.andWhere((0, database_helper_1.prepareSQLQuery)(`"${subQuery.alias}"."employeeId" = :employeeId`), { employeeId });
                    }
                    // Sub Query to get only assigned teams for specific organizations
                    subQuery.andWhere((cb) => {
                        return (0, database_helper_1.prepareSQLQuery)(`"${subQuery.alias}"."organizationId" IN ` + orgSubQuery(cb));
                    });
                    return (0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."id" IN ` + subQuery.distinct(true).getQuery());
                });
                query.addGroupBy((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."id"`));
                query.orderBy((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."createdAt"`), 'DESC');
                return await query.getRawMany();
            }
            default:
                throw new Error(`ORM type not implemented: ${this.ormType}`);
        }
    }
    /**
     * Creates workspace response objects for a list of users.
     *
     * @param {Object} params - The parameters.
     * @param {IUser[]} params.users - The list of users.
     * @param {string} params.email - The email address.
     * @param {string} params.code - The code for workspace signin.
     * @param {boolean} params.includeTeams - Flag to include teams in the response.
     * @returns {Promise<IUserSigninWorkspaceResponse>} A promise that resolves to the workspace response.
     */
    async createUserSigninWorkspaceResponse({ users, email, code, includeTeams }) {
        // Build all workspace responses concurrently — each user is independent
        const workspaces = await Promise.all(users.map((user) => this.createWorkspace(user, code, includeTeams)));
        return {
            workspaces,
            confirmed_email: email,
            show_popup: workspaces.length > 1,
            total_workspaces: workspaces.length
        };
    }
    /**
     * Creates a workspace response object for a given user.
     *
     * @param user The user object of type IUser.
     * @param code The code used for generating the user token.
     * @param includeTeams Flag indicating whether to include team information in the response.
     * @returns A promise that resolves to the workspace response object of type IWorkspaceResponse.
     */
    async createWorkspace(user, code, includeTeams) {
        const tenantId = user.tenant ? user.tenantId : null;
        const employeeId = await this.employeeService.findEmployeeIdByUserId(user.id);
        const workspace = {
            user: this.createUserObject(user),
            token: this.generateToken(user, code)
        };
        if (includeTeams) {
            try {
                const teams = await this.getTeamsForUser(tenantId, user.id, employeeId);
                workspace['current_teams'] = teams;
            }
            catch (error) {
                this.logger.error(`Error while getting specific teams for specific tenant: ${error?.message}`);
                // Optionally, you might want to handle the error more explicitly here.
            }
        }
        return workspace;
    }
    /**
     * Creates a new User object from a given IUser object.
     *
     * @param user The IUser object to be transformed.
     * @returns A new User object with properties mapped from the IUser object.
     */
    createUserObject(user) {
        return new internal_1.User({
            id: user.id,
            email: user.email || null, // Sets email to null if it's undefined
            name: user.name || null, // Sets name to null if it's undefined
            imageUrl: user.imageUrl || null, // Sets imageUrl to null if it's undefined
            lastTeamId: user.lastTeamId || null, // Sets lastTeam id to null if it's undefined
            lastLoginAt: user.lastLoginAt || null, // Sets last logout timestamp to null if it's undefined
            tenant: user.tenant
                ? new internal_1.Tenant({
                    id: user.tenant.id, // Assuming tenantId is a direct property of tenant
                    name: user.tenant.name || '', // Defaulting to an empty string if name is undefined
                    logo: user.tenant.logo || '' // Defaulting to an empty string if logo is undefined
                })
                : null // Sets tenant to null if user.tenant is undefined
        });
    }
    /**
     * Get all workspaces (tenants) that the current authenticated user has access to.
     *
     * @param includeTeams Flag indicating whether to include team information in the response.
     * @returns A promise that resolves to the user signin workspace response.
     */
    async getUserWorkspaces(includeTeams = false) {
        try {
            // Get the current authenticated user
            const currentUser = context_1.RequestContext.currentUser();
            if (!currentUser || !currentUser.email) {
                throw new common_1.UnauthorizedException('User not authenticated');
            }
            const email = currentUser.email;
            // Find all users with the same email across different tenants using Multi-ORM pattern
            let users;
            const options = {
                where: { email, isActive: true, isArchived: false, tenantId: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()) },
                relations: { tenant: true },
                order: { createdAt: 'DESC' }
            };
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM: {
                    const { where, mikroOptions } = (0, utils_2.parseTypeORMFindToMikroOrm)(options);
                    users = (await this.mikroOrmUserRepository.find(where, mikroOptions));
                    break;
                }
                case utils_2.MultiORMEnum.TypeORM: {
                    users = await this.typeOrmUserRepository.find(options);
                    break;
                }
                default:
                    throw new Error(`Method not implemented for ORM type: ${this.ormType}`);
            }
            if (users.length === 0) {
                throw new common_1.UnauthorizedException('No workspaces found for user');
            }
            // Create workspace response using existing logic
            const response = await this.createUserSigninWorkspaceResponse({
                users: users.map((user) => this.serialize(user)),
                code: '', // Empty code - not needed for authenticated workspace retrieval
                email,
                includeTeams
            });
            return response;
        }
        catch (error) {
            this.logger.error(`Error while getting user workspaces: ${error?.message}`);
            throw new common_1.UnauthorizedException('Failed to retrieve user workspaces');
        }
    }
    /**
     * Switch the current user to a different workspace (tenant).
     *
     * @param tenantId The ID of the tenant to switch to.
     * @returns A promise that resolves to the authentication response with new tokens or null if switching fails.
     * @throws UnauthorizedException when user is not authenticated or doesn't have access to the workspace.
     * @throws NotFoundException when the target workspace doesn't exist.
     */
    async switchWorkspace(tenantId) {
        try {
            // Get the current authenticated user
            const currentUser = context_1.RequestContext.currentUser();
            if (!currentUser || !currentUser.email) {
                throw new common_1.UnauthorizedException('User not authenticated');
            }
            const email = currentUser.email;
            // Find the user in the target tenant using Multi-ORM pattern
            let user;
            const where = { email, tenantId, isActive: true, isArchived: false };
            const relations = { role: true, tenant: true };
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM: {
                    const parsed = (0, utils_2.parseTypeORMFindToMikroOrm)({ where, relations });
                    user = (await this.mikroOrmUserRepository.findOne(parsed.where, parsed.mikroOptions));
                    break;
                }
                case utils_2.MultiORMEnum.TypeORM: {
                    user = await this.typeOrmUserRepository.findOne({ where, relations });
                    break;
                }
                default:
                    throw new Error(`Method not implemented for ORM type: ${this.ormType}`);
            }
            if (!user) {
                throw new common_1.UnauthorizedException('User does not have access to this workspace');
            }
            // Retrieve the employee details associated with the user in the TARGET workspace.
            // We cannot use employeeService.findOneByUserId() here because TenantAwareCrudService
            // forcefully applies RequestContext.currentUser().tenantId, which is still the OLD workspace
            // during a switch. Instead, query the repository directly with the explicit target tenantId.
            let employee = null;
            const employeeWhere = { userId: user.id, tenantId, isActive: true, isArchived: false };
            const employeeRelations = { organization: true };
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM: {
                    const parsed = (0, utils_2.parseTypeORMFindToMikroOrm)({ where: employeeWhere, relations: employeeRelations });
                    employee = (await this.mikroOrmEmployeeRepository.findOne(parsed.where, parsed.mikroOptions));
                    break;
                }
                case utils_2.MultiORMEnum.TypeORM: {
                    employee = await this.typeOrmEmployeeRepository.findOne({ where: employeeWhere, relations: employeeRelations });
                    break;
                }
                default:
                    throw new Error(`Method not implemented for ORM type: ${this.ormType}`);
            }
            // Determine organization context for tokens
            const organizationId = employee?.organizationId || user.lastOrganizationId;
            // Generate new access and refresh tokens for the target workspace
            const [access_token, refresh_token] = await Promise.all([
                this.getJwtAccessToken(user, organizationId),
                this.getJwtRefreshToken(user, organizationId)
            ]);
            // Store the current refresh token with the user.
            // We cannot use userService.setCurrentRefreshToken() here because TenantAwareCrudService.update()
            // runs a findOneByWhereOptions guard scoped to RequestContext.currentTenantId() (the OLD workspace),
            // which won't find a user whose tenantId is the TARGET workspace. Update directly via repository.
            const hashedRefreshToken = refresh_token
                ? await this.passwordHashService.hash(refresh_token)
                : refresh_token;
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM:
                    await this.mikroOrmUserRepository.nativeUpdate({ id: user.id, tenantId }, { refreshToken: hashedRefreshToken });
                    break;
                case utils_2.MultiORMEnum.TypeORM:
                    await this.typeOrmUserRepository.update({ id: user.id, tenantId }, { refreshToken: hashedRefreshToken });
                    break;
            }
            // Update the last login timestamp
            await this.userService.setUserLastLoginTimestamp(user.id);
            // Return the authentication response
            return {
                user: new internal_1.User({
                    ...this.serialize(user),
                    ...(employee && { employee })
                }),
                token: access_token,
                refresh_token: refresh_token
            };
        }
        catch (error) {
            this.logger.error(`Error while switching workspace: ${error?.message}`);
            // Re-throw known exceptions for better error handling in the frontend
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            // For unexpected errors, return null to maintain backward compatibility
            return null;
        }
    }
    /**
     * Switch the current user to a different organization within the same workspace.
     *
     * @param organizationId The ID of the organization to switch to.
     * @returns A promise that resolves to the authentication response with new tokens or null if switching fails.
     * @throws UnauthorizedException when user is not authenticated or doesn't have access to the organization.
     */
    async switchOrganization(organizationId) {
        try {
            // Get the current authenticated user
            const currentUser = context_1.RequestContext.currentUser();
            if (!currentUser || !currentUser.id) {
                throw new common_1.UnauthorizedException('User not authenticated');
            }
            const tenantId = context_1.RequestContext.currentTenantId();
            if (!tenantId) {
                throw new common_1.UnauthorizedException('Tenant context not found');
            }
            // Verify the user has access to this organization
            const userOrganization = await this.userOrganizationService.findOneByOptions({
                where: {
                    userId: currentUser.id,
                    organizationId,
                    tenantId,
                    isActive: true,
                    isArchived: false
                }
            });
            if (!userOrganization) {
                throw new common_1.UnauthorizedException('User does not have access to this organization');
            }
            // Retrieve the user with role permissions
            let user;
            const where = {
                id: currentUser.id,
                tenantId,
                isActive: true,
                isArchived: false
            };
            const relations = { role: { rolePermissions: true } };
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM: {
                    const parsed = (0, utils_2.parseTypeORMFindToMikroOrm)({ where, relations });
                    user = (await this.mikroOrmUserRepository.findOne(parsed.where, parsed.mikroOptions));
                    break;
                }
                case utils_2.MultiORMEnum.TypeORM: {
                    user = await this.typeOrmUserRepository.findOne({ where, relations });
                    break;
                }
                default:
                    throw new Error(`Method not implemented for ORM type: ${this.ormType}`);
            }
            if (!user) {
                throw new common_1.UnauthorizedException('User not found');
            }
            // Retrieve the employee details for the target organization
            const employee = await this.employeeService.findOneByUserId(user.id, organizationId);
            // Check if the employee is active and not archived (if employee exists)
            if (employee && (!employee.isActive || employee.isArchived)) {
                throw new common_1.UnauthorizedException('Employee account is not active in this organization');
            }
            // Update user's last organization and reflect it in the user object
            await this.userService.update(user.id, { lastOrganizationId: organizationId });
            user.lastOrganizationId = organizationId;
            // Generate new access and refresh tokens with the new organization context
            const [access_token, refresh_token] = await Promise.all([
                this.getJwtAccessToken(user, organizationId),
                this.getJwtRefreshToken(user, organizationId)
            ]);
            // Store the current refresh token with the user
            await this.userService.setCurrentRefreshToken(refresh_token, user.id);
            // Return the authentication response
            return {
                user: new internal_1.User({
                    ...this.serialize(user),
                    ...(employee && { employee })
                }),
                token: access_token,
                refresh_token: refresh_token
            };
        }
        catch (error) {
            this.logger.error(`Error while switching organization: ${error?.message}`);
            // Re-throw known exceptions for better error handling in the frontend
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            // For unexpected errors, return null to maintain backward compatibility
            return null;
        }
    }
    /**
     * Logs out the user by revoking the provided refresh token.
     *
     * This function attempts to revoke the refresh token associated with the user.
     * It also removes the refresh token from the user's record in the database. Any errors during these operations
     * are logged but do not prevent the logout process from completing.
     *
     * @param refreshToken The refresh token to be revoked. This is optional as the function will attempt to revoke the current access token regardless.
     */
    async logout(refreshToken) {
        const reason = 'User initiated logout';
        const currentToken = context_1.RequestContext.currentToken();
        const currentUserId = context_1.RequestContext.currentUserId();
        const revocations = [
            this.userService.removeRefreshToken().catch((error) => {
                // Log the error but do not throw it, as we want to proceed with logout even if this fails
                common_1.Logger.error('Error while removing refresh token from user record:', error?.message);
            })
        ];
        if (refreshToken) {
            revocations.push(this.refreshTokenService.revoke(refreshToken, reason, currentUserId).catch((error) => {
                // Log the error but do not throw it, as we want to proceed with logout even if this fails
                common_1.Logger.error('Error while revoking refresh token:', error?.message);
            }));
        }
        if (currentToken) {
            revocations.push(this.accessTokenService.revoke(currentToken, reason, currentUserId).catch((error) => {
                // Log the error but do not throw it, as we want to proceed with logout even if this fails
                common_1.Logger.error('Error while revoking access token:', error?.message);
            }));
        }
        await Promise.allSettled(revocations);
    }
};
exports.AuthService = AuthService;
AuthService.OAUTH_CODE_CACHE_PREFIX = 'oauth_app_code:';
AuthService.OAUTH_CODE_TTL_MS = 10 * 60 * 1000;
AuthService.OAUTH_REQUEST_CACHE_PREFIX = 'oauth_app_request:';
AuthService.OAUTH_REQUEST_TTL_MS = 10 * 60 * 1000;
exports.AuthService = AuthService = AuthService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(16, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    tslib_1.__param(17, (0, common_1.Optional)()),
    tslib_1.__param(17, (0, common_1.Inject)(redis_module_1.EVER_REDIS_CLIENT)),
    tslib_1.__metadata("design:paramtypes", [type_orm_user_repository_1.TypeOrmUserRepository,
        mikro_orm_user_repository_1.MikroOrmUserRepository,
        type_orm_employee_repository_1.TypeOrmEmployeeRepository,
        mikro_orm_employee_repository_1.MikroOrmEmployeeRepository,
        type_orm_organization_team_repository_1.TypeOrmOrganizationTeamRepository,
        mikro_orm_organization_team_repository_1.MikroOrmOrganizationTeamRepository,
        email_confirmation_service_1.EmailConfirmationService,
        user_service_1.UserService,
        employee_service_1.EmployeeService,
        role_service_1.RoleService,
        email_service_1.EmailService,
        user_organization_services_1.UserOrganizationService,
        cqrs_1.CommandBus,
        axios_1.HttpService,
        social_account_service_1.SocialAccountService,
        event_bus_1.EventBus, Object, void 0, password_hash_service_1.PasswordHashService,
        refresh_token_service_1.RefreshTokenService,
        access_token_service_1.AccessTokenService,
        type_orm_password_reset_repository_1.TypeOrmPasswordResetRepository,
        mikro_orm_password_reset_repository_1.MikroOrmPasswordResetRepository,
        oauth_client_service_1.OAuthClientService,
        terms_acceptance_service_1.TermsAcceptanceService,
        login_attempt_service_1.LoginAttemptService])
], AuthService);
//# sourceMappingURL=auth.service.js.map