import { ID, LanguagesEnum, PermissionsEnum, RolesEnum } from '@gauzy/contracts';
import { Request, Response } from 'express';
import { ClsService } from 'nestjs-cls';
import { IAuthenticatedUser, SerializedRequestContext } from './types';
export declare class RequestContext {
    protected static clsService: ClsService;
    private static loggingEnabled;
    private readonly _id;
    private readonly _res;
    private readonly _req;
    private readonly _languageCode;
    /**
     * Gets the language code.
     *
     * @returns The language code.
     */
    get languageCode(): LanguagesEnum;
    /**
     * Gets the id.
     *
     * @returns The id.
     */
    get id(): ID;
    /**
     * Creates an instance of RequestContext.
     * @param options - An object containing optional parameters for initializing the instance.
     * @param options.id - Optional Request ID. If not provided, a random ID (UUID) is generated.
     * @param options.req - Optional Request object.
     * @param options.res - Optional Response object.
     * @param options.languageCode - Optional language code (enum) for the instance.
     * @param options.isAuthorized - Optional flag indicating whether the user is authorized.
     */
    constructor(options: {
        id?: ID;
        req?: Request;
        res?: Response;
        languageCode?: LanguagesEnum;
        isAuthorized?: boolean;
    });
    /**
     * Static method to set the context ID in the ClsService.
     *
     * @param cls The ClsService instance used to set the context ID.
     * @param id The ID to set in the ClsService context.
     */
    static setContextId(id: ID): void;
    /**
     * Static method to get the context ID from the ClsService.
     *
     * @param cls The ClsService instance used to retrieve the context ID.
     * @returns The context ID or undefined if not set.
     */
    static getContextId(): ID | undefined;
    /**
     * Sets the ClsService instance to be used by RequestContext.
     *
     * @param service - The ClsService instance to set.
     */
    static setClsService(service: ClsService): void;
    /**
     * Gets the current request context.
     *
     * @returns The current RequestContext instance.
     */
    static currentRequestContext(): RequestContext;
    /**
     * Deserializes a serialized request context object into a RequestContext instance.
     *
     * @param ctxObject - The serialized request context object.
     * @returns A new RequestContext instance.
     */
    static deserialize(ctxObject: SerializedRequestContext): RequestContext;
    /**
     * Creates a shallow copy of the current instance of the RequestContext class.
     * @returns A new instance of RequestContext with the same property values as the original.
     */
    copy(): RequestContext;
    /**
     * Gets the current request.
     *
     * @returns The current Request object or null if no context is available.
     */
    static currentRequest(): any;
    /**
     * Retrieves the current request's correlation id — TASK 9 (improvement roadmap, Unified
     * Observability and Correlation IDs).
     *
     * This is the SAME value as {@link getContextId} (`RequestContextMiddleware` already sets it
     * from an inbound `x-correlation-id` header, falling back to a generated UUID, and passes it
     * as `RequestContext`'s own `id` — which the constructor also stores under this same CLS key).
     * `currentCorrelationId()` exists so call sites that want "the id that ties this operation
     * together across logs/queue jobs" don't need to know that `getContextId()`/`setContextId()`
     * are the underlying storage — matching the naming of every other `current*` accessor here.
     *
     * `null` outside a request (e.g. on a queue worker thread, which never gets a `RequestContext`
     * — see `packages/plugins/docs/src/lib/knowledge/queue/docs-job.types.ts`'s documented hard
     * rule) rather than throwing, so a call site can use `?? undefined` unconditionally instead of
     * a try/catch.
     *
     * @returns The current correlation id, or `null` if there is no active request context.
     */
    static currentCorrelationId(): ID | null;
    /**
     * Retrieves the current tenant ID associated with the user in the RequestContext.
     * Returns the tenant ID if available, otherwise returns null.
     *
     * @returns {string | null} - The current tenant ID or null if not available.
     */
    static currentTenantId(): ID | null;
    /**
     * Retrieves the current user ID associated with the user in the RequestContext.
     * Returns the user ID if available, otherwise returns null.
     *
     * @returns {string | null} - The current user ID or null if not available.
     */
    static currentUserId(): ID | null;
    /**
     * Retrieves the current organization ID from the request context.
     *
     * The organizationId is injected into user.lastOrganizationId by jwt.strategy.ts
     * after validating that the user has access to the organization.
     *
     * @returns {ID | null} - The current organization ID or null if not available.
     */
    static currentOrganizationId(): ID | null;
    /**
     * Retrieves the current role ID associated with the user in the RequestContext.
     * Returns the role ID if available, otherwise returns null.
     *
     * @returns {string | null} - The current role ID or null if not available.
     */
    static currentRoleId(): ID | null;
    /**
     * Retrieves the name of the role the current user holds, as loaded from the database for THIS
     * request.
     *
     * `RegisterAuthorizationGuard` historically attached the role as a bare name, so both shapes are
     * accepted here.
     *
     * @returns {RolesEnum | null} - The current role name, or null when the user has no resolvable role.
     */
    static currentRoleName(): RolesEnum | null;
    /**
     * Retrieves the enabled permissions of the current user's role, as loaded from the database for
     * THIS request. Never the `permissions` claim of the access token.
     *
     * @returns {PermissionsEnum[]} - The granted permissions, or an empty array when none are known.
     */
    static currentPermissions(): PermissionsEnum[];
    /**
     * Retrieves the current employee ID from the request context.
     * @returns {string | null} - The current employee ID if available, otherwise null.
     */
    static currentEmployeeId(): string | null;
    /**
     * Retrieves the current user from the request context.
     * @param {boolean} throwError - Flag indicating whether to throw an error if user is not found.
     * @returns {IAuthenticatedUser | null} - The current user if found, otherwise null.
     */
    static currentUser(throwError?: boolean): IAuthenticatedUser | null;
    /**
     * Checks if the current user has a specific permission.
     * @param {PermissionsEnum} permission - The permission to check.
     * @param {boolean} throwError - Flag indicating whether to throw an error if permission is not granted.
     * @returns {boolean} - True if the user has the permission, otherwise false.
     */
    static hasPermission(permission: PermissionsEnum, throwError?: boolean): boolean;
    /**
     * Retrieves the language code from the headers of the current request.
     * @returns The language code (LanguagesEnum) extracted from the headers, or the default language (ENGLISH) if not found.
     */
    static getLanguageCode(): LanguagesEnum;
    /**
     * Checks if the current request context has the specified permissions.
     *
     * @param permissions - An array of permissions to check.
     * @param throwError - Whether to throw an HTTP 401 instead of returning `false`. This fires whenever the
     *                     check fails — for an authenticated caller who simply lacks it, not only when no
     *                     user is attached (the token-decoding implementation returned early for the former).
     * @returns True if the required permissions are found, otherwise false.
     */
    static hasPermissions(permissions: PermissionsEnum[], throwError?: boolean): boolean;
    /**
     * Checks if the current request context has any of the specified permissions.
     *
     * @param permissions - An array of permissions to check.
     * @param throwError - Whether to throw an HTTP 401 instead of returning `false`. This fires whenever the
     *                     check fails — for an authenticated caller who simply lacks it, not only when no
     *                     user is attached (the token-decoding implementation returned early for the former).
     * @returns True if any of the required permissions are found, otherwise false.
     */
    static hasAnyPermission(permissions: PermissionsEnum[], throwError?: boolean): boolean;
    /**
     * Extracts the current JWT token from the request context.
     *
     * @param throwError - Whether to throw an error if no token is found.
     * @returns The extracted token if found, otherwise null.
     */
    static currentToken(throwError?: boolean): any;
    /**
     * Checks if the current user has a specific role.
     * @param {RolesEnum} role - The role to check.
     * @param {boolean} throwError - Flag indicating whether to throw an error if the role is not granted.
     * @returns {boolean} - True if the user has the role, otherwise false.
     */
    static hasRole(role: RolesEnum, throwError?: boolean): boolean;
    /**
     * Checks if the current request context has any of the specified roles.
     *
     * @param roles - An array of roles to check.
     * @param throwError - Whether to throw an HTTP 401 instead of returning `false`. This fires whenever the
     *                     check fails — for an authenticated caller who simply lacks it, not only when no
     *                     user is attached (the token-decoding implementation returned early for the former).
     * @returns True if any of the required roles are found, otherwise false.
     */
    static hasRoles(roles: RolesEnum[], throwError?: boolean): boolean;
    /**
     * Checks if ip address is available in the request context and returns it, otherwise returns 'unknown-ip'.
     * @returns {string} - The IP address from the request context or 'unknown-ip' if not available.
     */
    static currentIp(): string;
    /**
     * Checks if user agent is available in the request context and returns it, otherwise returns 'unknown-user-agent'.
     * @returns {string} - The user agent from the request context or 'unknown-user-agent' if not available.
     */
    static currentUserAgent(): string;
}
