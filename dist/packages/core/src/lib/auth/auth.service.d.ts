import { SocialAuthService, OAuthAppAuthorizationRequest, OAuthAppTokenRequest, OAuthAppTokenResponse, OAuthAppConfig, OAuthAppPendingRequest } from '@gauzy/auth';
import { IAppIntegrationConfig } from '@gauzy/common';
import { IAuthResponse, IChangePasswordRequest, ID, ILastOrganization, ILastTeam, IResetPasswordRequest, ISocialAccount, ISocialAccountBase, ISocialAccountExistUser, ISocialAccountLogin, ITokenPair, IUser, IUserCodeInput, IUserEmailInput, IUserLoginInput, IUserRegistrationInput, IUserSigninWorkspaceResponse, IUserTokenInput, IUserLoginInput as IUserWorkspaceSigninInput, LanguagesEnum, PermissionsEnum } from '@gauzy/contracts';
import { HttpService } from '@nestjs/axios';
import { BadRequestException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CommandBus } from '@nestjs/cqrs';
import { AccessTokenService } from '../access-token/access-token.service';
import { IAccessTokenMetadata } from '../access-token/type.token';
import { EmployeeService } from '../employee/employee.service';
import { TypeOrmEmployeeRepository } from '../employee/repository/type-orm-employee.repository';
import { MikroOrmEmployeeRepository } from '../employee/repository/mikro-orm-employee.repository';
import { EventBus } from '../event-bus/event-bus';
import { PasswordHashService } from '../password-hash/password-hash.service';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { IRefreshTokenMetadata } from '../refresh-token/type.token';
import { UserOrganizationService } from '../user-organization/user-organization.services';
import { MikroOrmUserRepository } from '../user/repository/mikro-orm-user.repository';
import { TypeOrmUserRepository } from '../user/repository/type-orm-user.repository';
import { UserService } from '../user/user.service';
import { User } from './../core/entities/internal';
import { EmailService } from './../email-send/email.service';
import { TypeOrmOrganizationTeamRepository } from './../organization-team/repository/type-orm-organization-team.repository';
import { MikroOrmOrganizationTeamRepository } from './../organization-team/repository/mikro-orm-organization-team.repository';
import { TypeOrmPasswordResetRepository } from './../password-reset/repository/type-orm-password-reset.repository';
import { MikroOrmPasswordResetRepository } from './../password-reset/repository/mikro-orm-password-reset.repository';
import { RoleService } from './../role/role.service';
import { EmailConfirmationService } from './email-confirmation.service';
import { SocialAccountService } from './social-account/social-account.service';
import { createClient } from 'redis';
import { OAuthClientService } from './oauth-client/oauth-client.service';
import { TermsAcceptanceService } from '../terms-acceptance/terms-acceptance.service';
import { LoginAttemptService } from './login-attempt.service';
export declare class AuthService extends SocialAuthService {
    private readonly typeOrmUserRepository;
    private readonly mikroOrmUserRepository;
    private readonly typeOrmEmployeeRepository;
    private readonly mikroOrmEmployeeRepository;
    private readonly typeOrmOrganizationTeamRepository;
    private readonly mikroOrmOrganizationTeamRepository;
    private readonly emailConfirmationService;
    private readonly userService;
    private readonly employeeService;
    private readonly roleService;
    private readonly emailService;
    private readonly userOrganizationService;
    private readonly commandBus;
    private readonly httpService;
    private readonly socialAccountService;
    private readonly eventBus;
    private readonly cacheManager;
    private readonly redisClient;
    private readonly passwordHashService;
    private readonly refreshTokenService;
    private readonly accessTokenService;
    private readonly typeOrmPasswordResetRepository;
    private readonly mikroOrmPasswordResetRepository;
    private readonly oauthClientService;
    private readonly termsAcceptanceService;
    private readonly loginAttemptService;
    private readonly ormType;
    private readonly logger;
    private static readonly OAUTH_CODE_CACHE_PREFIX;
    private static readonly OAUTH_CODE_TTL_MS;
    private static readonly OAUTH_REQUEST_CACHE_PREFIX;
    private static readonly OAUTH_REQUEST_TTL_MS;
    /**
     * Authorization-code jti values already claimed by this process, used to make the non-Redis
     * token-exchange path single-use. Entries expire with the codes they guard. Deployments with
     * Redis wired use GETDEL instead and never touch this set.
     */
    private readonly consumedOAuthCodes;
    constructor(typeOrmUserRepository: TypeOrmUserRepository, mikroOrmUserRepository: MikroOrmUserRepository, typeOrmEmployeeRepository: TypeOrmEmployeeRepository, mikroOrmEmployeeRepository: MikroOrmEmployeeRepository, typeOrmOrganizationTeamRepository: TypeOrmOrganizationTeamRepository, mikroOrmOrganizationTeamRepository: MikroOrmOrganizationTeamRepository, emailConfirmationService: EmailConfirmationService, userService: UserService, employeeService: EmployeeService, roleService: RoleService, emailService: EmailService, userOrganizationService: UserOrganizationService, commandBus: CommandBus, httpService: HttpService, socialAccountService: SocialAccountService, eventBus: EventBus, cacheManager: Cache, redisClient: ReturnType<typeof createClient> | null, passwordHashService: PasswordHashService, refreshTokenService: RefreshTokenService, accessTokenService: AccessTokenService, typeOrmPasswordResetRepository: TypeOrmPasswordResetRepository, mikroOrmPasswordResetRepository: MikroOrmPasswordResetRepository, oauthClientService: OAuthClientService, termsAcceptanceService: TermsAcceptanceService, loginAttemptService: LoginAttemptService);
    /**
     * Serializes the provided entity based on the ORM type.
     * @param entity The entity to be serialized.
     * @returns The serialized entity.
     */
    private serialize;
    private signOAuthAppPayload;
    private parseOAuthAppCode;
    /**
     * Store a pending OAuth authorization request in cache.
     */
    storeOAuthAppPendingRequest(request: OAuthAppPendingRequest): Promise<void>;
    /**
     * Retrieve a pending OAuth authorization request from cache.
     */
    getOAuthAppPendingRequest(requestId: string): Promise<OAuthAppPendingRequest | null>;
    /**
     * Delete a pending OAuth authorization request from cache.
     */
    deleteOAuthAppPendingRequest(requestId: string): Promise<void>;
    /**
     * Map an `OAuthClient` registry row → the `OAuthAppConfig` view used
     * by the auth pipeline. Carries the `clientSecretHash` (NEVER plaintext)
     * because the `/token` exchange validates incoming secrets via
     * `OAuthClientService.validateClientSecret` (constant-time scrypt).
     */
    private mapOAuthClientToConfig;
    /**
     * Resolve an OAuth client by its public `clientId` from the
     * `oauth_clients` registry. Throws `NotFoundException` (mapped to
     * `400 invalid_client` by the controller) when the row does not
     * exist or is inactive. There is no env-var fallback — every
     * third-party app must be registered via `POST /oauth/clients`.
     */
    resolveOAuthClient(clientId: string): Promise<OAuthAppConfig>;
    createOAuthAppAuthorizationCode(request: OAuthAppAuthorizationRequest): Promise<string>;
    exchangeOAuthAppAuthorizationCode(request: OAuthAppTokenRequest): Promise<OAuthAppTokenResponse>;
    /**
     * User Login Request
     *
     * @param email The user's email address
     * @param password The user's password
     * @returns A Promise that resolves to the authentication response or null
     */
    login({ email, password }: IUserLoginInput): Promise<IAuthResponse | null>;
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
    private resolveDefaultOrganizationId;
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
    private hasActiveOrganizationMembership;
    /**
     * Authenticate a user by email and password and return user workspaces.
     *
     * @param email - The user's email.
     * @param password - The user's password.
     * @returns A promise that resolves to a response with user workspaces.
     * @throws UnauthorizedException if authentication fails.
     */
    signinWorkspacesByEmailPassword(input: IUserWorkspaceSigninInput, includeTeams: boolean): Promise<IUserSigninWorkspaceResponse>;
    /**
     * Verify OAuth token when signin with social media from Ever Teams
     *
     * @param provider The provider used with user for signin
     * @param token The token generated by OAuth provider from Ever Teams frontend
     * @returns A promise resolved by the provider name and the account ID, both decode from the token
     * @throws A bad request if the provider used by user is not supported
     */
    private verifyOAuthToken;
    /**
     * Check if any user with the given provider infos exists
     * This function is used to facilitate the GauzyAdapter in Ever Teams try to create new Users or only signin them

     * @param input An object that contains the provider name and the provider Account ID
     * @returns A promise that resolves to a boolean specifying if the user exists or not
     */
    socialSignupCheckIfUserExistsBySocial(input: ISocialAccountBase): Promise<ISocialAccountExistUser>;
    /**
     * Authenticate a user by email from social media and return user workspaces.
     *
     * @param email - The user's email.
     * @param password - The user's password.
     * @returns A promise that resolves to a response with user workspaces.
     * @throws UnauthorizedException if authentication fails.
     */
    signinWorkspacesByEmailSocial(input: ISocialAccountLogin, includeTeams: boolean): Promise<IUserSigninWorkspaceResponse>;
    /**
     * This method links a user to an oAuth account when signin/signup with a social media provider
     *
     * @param input The body request that contains the token to be verified and the provider name
     * @returns A promise that resolved with  an account creation
     */
    linkUserToSocialAccount(input: ISocialAccountLogin): Promise<ISocialAccount>;
    /**
     * Generate a JWT token for the given user.
     *
     * @param user - The user object for which to generate the token.
     * @returns The JWT token as a string.
     */
    private generateToken;
    /**
     * Initiates the process to request a password reset.
     *
     * @param request - The reset password request object containing the email address.
     * @param languageCode - The language code used for email communication.
     * @param originUrl - Optional parameter representing the origin URL of the request.
     * @returns A Promise that resolves to a boolean indicating the success of the password reset request
     *          or throws a BadRequestException in case of failure.
     */
    requestResetPassword(request: IResetPasswordRequest, languageCode: LanguagesEnum, originUrl?: string): Promise<boolean | BadRequestException>;
    /**
     * Generates a password reset link.
     *
     * @param baseURL The base URL for the reset password page.
     * @param token The token generated for the password reset.
     * @param email The email of the user.
     * @param tenantId The tenant ID (optional).
     * @returns The password reset link.
     */
    generateResetLink(baseURL: string, token: string, email: string, tenantId?: ID): string;
    /**
     * Fetch users from the repository based on specific criteria.
     *
     * @param {string} email - The user's email address.
     * @returns {Promise<User[]>} A Promise that resolves to an array of User objects.
     */
    fetchUsers(email: IUserEmailInput['email']): Promise<IUser[]>;
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
    private consumePasswordResetToken;
    /**
     * Resets the user's password based on a valid password reset token.
     *
     * @param request - The request object containing the new password and the reset token.
     * @returns A boolean indicating whether the password reset was successful.
     * @throws {BadRequestException} - If the password reset fails due to an invalid, expired or already-used token, or if there is an issue updating the password.
     */
    resetPassword(request: IChangePasswordRequest): Promise<boolean>;
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
    private buildEmployeeRegistrationPayload;
    /**
     * Refuses an employee entity that already names an existing row.
     *
     * Registration only ever CREATES. `save()` on an entity that carries a primary key is an UPDATE,
     * so an id reaching this point means either a bug or a body field that found its way back into
     * the payload — neither is something to silently write over somebody else's record.
     *
     * @param employee The entity about to be persisted.
     */
    private assertEmployeeRowIsNew;
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
    register(input: IUserRegistrationInput & Partial<IAppIntegrationConfig>, languageCode: LanguagesEnum): Promise<User>;
    /**
     *
     * @param id
     * @param thirdPartyId
     * @returns
     */
    getAuthenticatedUser(id: string, thirdPartyId?: string): Promise<User>;
    /**
     *
     * @param token
     * @returns
     */
    isAuthenticated(token: string): Promise<boolean>;
    /**
     * Check if the current user has any of the specified roles
     *
     * @param roles Array of role names to check against
     * @returns A promise that resolves to true if the user has one of the specified roles, false otherwise
     */
    hasRole(roles?: string[]): Promise<boolean>;
    /**
     * Check if the current user has any of the specified permissions
     *
     * @param permissions Array of permissions to check against
     * @returns A promise that resolves to true if the user has one of the specified permissions, false otherwise
     */
    hasPermissions(permissions?: PermissionsEnum[]): Promise<boolean>;
    /**
     *
     * @param emails
     * @returns
     */
    validateOAuthLoginEmail(emails: Array<{
        value: string;
        verified: boolean;
    }>): Promise<{
        success: boolean;
        authData: {
            jwt: string;
            userId: string;
        };
    }>;
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
    getJwtAccessToken(request: Partial<IUser>, organizationId?: ID, metadata?: IAccessTokenMetadata): Promise<string>;
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
    getJwtRefreshToken(user: Partial<IUser>, organizationId?: ID, metadata?: IRefreshTokenMetadata): Promise<string>;
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
    rotateRefreshToken(token: string, user: Partial<IUser>, organizationId?: ID, metadata?: IRefreshTokenMetadata): Promise<string>;
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
    getAccessTokenFromRefreshToken(): Promise<{
        token: string;
        refresh_token: string;
    } | null>;
    /**
     * Rotates the JWT tokens for the current user.
     *
     * @param token - The current refresh token.
     * @param metadata - Optional metadata to include in the token payload.
     * @returns {Promise<ITokenPair | null>} - The new access and refresh tokens, or null if an error occurs.
     */
    rotateTokens(token: string, metadata?: IRefreshTokenMetadata): Promise<ITokenPair | null>;
    /**
     * Sends a unique authentication code to the user's email for workspace sign-in.
     *
     * @param input - User email input along with partial app integration configuration.
     * @param locale - Language/locale for email content.
     * @returns {Promise<void>} - A promise indicating the completion of the operation.
     */
    sendWorkspaceSigninCode(input: IUserEmailInput & Partial<IAppIntegrationConfig>, locale: LanguagesEnum): Promise<void>;
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
    signinWorkspacesByMagicCode(payload: IUserEmailInput & IUserCodeInput, includeTeams: boolean): Promise<IUserSigninWorkspaceResponse>;
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
    workspaceSigninVerifyToken(input: IUserEmailInput & IUserTokenInput & ILastOrganization & ILastTeam): Promise<IAuthResponse | null>;
    /**
     * Verify the JWT token and return the payload.
     * @param token - The JWT token to verify.
     * @returns The token payload or throws an error.
     */
    private verifyToken;
    /**
     * Get teams for a user within a specific tenant.
     *
     * @param tenantId The ID of the tenant.
     * @param userId The ID of the user.
     * @param employeeId The ID of the employee (optional).
     *
     * @returns A Promise that resolves to an array of IOrganizationTeam objects.
     */
    private getTeamsForUser;
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
    private createUserSigninWorkspaceResponse;
    /**
     * Creates a workspace response object for a given user.
     *
     * @param user The user object of type IUser.
     * @param code The code used for generating the user token.
     * @param includeTeams Flag indicating whether to include team information in the response.
     * @returns A promise that resolves to the workspace response object of type IWorkspaceResponse.
     */
    private createWorkspace;
    /**
     * Creates a new User object from a given IUser object.
     *
     * @param user The IUser object to be transformed.
     * @returns A new User object with properties mapped from the IUser object.
     */
    private createUserObject;
    /**
     * Get all workspaces (tenants) that the current authenticated user has access to.
     *
     * @param includeTeams Flag indicating whether to include team information in the response.
     * @returns A promise that resolves to the user signin workspace response.
     */
    getUserWorkspaces(includeTeams?: boolean): Promise<IUserSigninWorkspaceResponse>;
    /**
     * Switch the current user to a different workspace (tenant).
     *
     * @param tenantId The ID of the tenant to switch to.
     * @returns A promise that resolves to the authentication response with new tokens or null if switching fails.
     * @throws UnauthorizedException when user is not authenticated or doesn't have access to the workspace.
     * @throws NotFoundException when the target workspace doesn't exist.
     */
    switchWorkspace(tenantId: ID): Promise<IAuthResponse | null>;
    /**
     * Switch the current user to a different organization within the same workspace.
     *
     * @param organizationId The ID of the organization to switch to.
     * @returns A promise that resolves to the authentication response with new tokens or null if switching fails.
     * @throws UnauthorizedException when user is not authenticated or doesn't have access to the organization.
     */
    switchOrganization(organizationId: ID): Promise<IAuthResponse | null>;
    /**
     * Logs out the user by revoking the provided refresh token.
     *
     * This function attempts to revoke the refresh token associated with the user.
     * It also removes the refresh token from the user's record in the database. Any errors during these operations
     * are logged but do not prevent the logout process from completing.
     *
     * @param refreshToken The refresh token to be revoked. This is optional as the function will attempt to revoke the current access token regardless.
     */
    logout(refreshToken?: string): Promise<void>;
}
