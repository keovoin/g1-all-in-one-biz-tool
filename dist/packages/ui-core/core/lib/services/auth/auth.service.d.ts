import { HttpClient } from '@angular/common/http';
import { IAuthResponse, IUser, IUserCodeInput, IUserEmailInput, IUserLoginInput, IUserRegistrationInput, IUserSigninWorkspaceResponse, IUserTokenInput, ITermsAcceptanceDocument, PermissionsEnum, RolesEnum } from '@gauzy/contracts';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class AuthService {
    private readonly http;
    constructor(http: HttpClient);
    isAuthenticated(): Promise<boolean>;
    confirmEmail(body: IUserEmailInput & IUserTokenInput): Observable<Object>;
    login(loginInput: IUserLoginInput): Observable<IAuthResponse>;
    /**
     * Sign in to workspaces with the provided input.
     *
     * @param input - The input containing user login information.
     * @returns An observable of the response for signing in to workspaces.
     */
    findWorkspaces(input: IUserLoginInput): Observable<IUserSigninWorkspaceResponse>;
    /**
     *
     */
    sendSigninCode(input: IUserEmailInput): Observable<IUserEmailInput>;
    /**
     *
     */
    confirmSignInByCode(input: IUserEmailInput & IUserCodeInput): Observable<IUserSigninWorkspaceResponse>;
    /**
     * Sign in to a specific tenant workspace using the provided input.
     *
     * @param input - The input containing user email and token.
     * @returns An observable of the response for signing in to the specific tenant workspace.
     */
    signinWorkspaceByToken(input: IUserEmailInput & IUserTokenInput): Observable<IAuthResponse>;
    /**
     * Logout API Route
     *
     * @returns
     */
    doLogout(refreshToken: string): Observable<boolean>;
    register(input: IUserRegistrationInput): Observable<IUser>;
    /**
     * The legal documents a new account must accept, as currently published.
     *
     * Fetched rather than hard-coded so the version and the sha256 the user is
     * shown are the ones the server will accept — and so the object that gates
     * the submit button is the same object that gets posted back. Hard-coding a
     * version in the client is how a checkbox ends up meaning nothing.
     */
    getRequiredTermsDocuments(locale?: string): Observable<ITermsAcceptanceDocument[]>;
    requestPassword(requestPasswordInput: any): Observable<{
        id?: string;
        token?: string;
    }>;
    resetPassword(resetPasswordInput: any): Observable<Object>;
    /**
     * Checks if the current user has the specified roles.
     *
     * @param {RolesEnum[]} roles - An array of roles to check.
     * @return {Observable<boolean>} An observable that emits a boolean indicating whether the user has the specified roles.
     */
    hasRole(roles: RolesEnum[]): Observable<boolean>;
    /**
     * Checks if the user has the specified permissions.
     *
     * @param {...PermissionsEnum[]} permissions - The permissions to check.
     * @return {Observable<boolean>} An observable that emits a boolean indicating whether the user has the specified permissions.
     */
    hasPermissions(...permissions: PermissionsEnum[]): Observable<boolean>;
    /**
     * GET access token from refresh token
     *
     * @param refresh_token
     * @returns
     */
    refreshToken(refresh_token: string): Promise<{
        token: string;
        refresh_token: string;
    } | null>;
    /**
     * Get all workspaces (tenants) that the current authenticated user has access to.
     *
     * @param includeTeams - Whether to include teams in the response (default: false).
     * @returns An observable of the user signin workspace response.
     */
    getUserWorkspaces(includeTeams?: boolean): Observable<IUserSigninWorkspaceResponse>;
    /**
     * Switch the current user to a different workspace (tenant).
     *
     * @param tenantId - The ID of the tenant to switch to.
     * @returns An observable of the authentication response with new tokens or null if switching fails.
     */
    switchWorkspace(tenantId: string): Observable<IAuthResponse | null>;
    /**
     * Switch the current user to a different organization within the same workspace.
     *
     * @param organizationId - The ID of the organization to switch to.
     * @returns An observable of the authentication response with new tokens or null if switching fails.
     */
    switchOrganization(organizationId: string): Observable<IAuthResponse | null>;
    static ɵfac: i0.ɵɵFactoryDeclaration<AuthService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AuthService>;
}
