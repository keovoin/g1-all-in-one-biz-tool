import { IAuthResponse, IOrganizationCreateInput, IUserSigninWorkspaceResponse } from '@gauzy/contracts';
import { AuthService } from '../auth';
import { ErrorHandlingService } from '../notification';
import { Store } from '../store';
import { TenantService } from '../tenant';
import { OrganizationsService } from '../organizations';
import { UsersService } from '../users';
import { WorkspaceSyncService } from './workspace-sync.service';
import * as i0 from "@angular/core";
/**
 * Service to handle workspace authentication flows and user onboarding.
 * Centralizes complex authentication logic that was previously duplicated across components.
 */
export declare class WorkspaceAuthService {
    private readonly _authService;
    private readonly _errorHandlingService;
    private readonly _store;
    private readonly _tenantService;
    private readonly _organizationsService;
    private readonly _usersService;
    private readonly _workspaceSyncService;
    constructor(_authService: AuthService, _errorHandlingService: ErrorHandlingService, _store: Store, _tenantService: TenantService, _organizationsService: OrganizationsService, _usersService: UsersService, _workspaceSyncService: WorkspaceSyncService);
    /**
     * Get new access token using refresh token stored in _store
     */
    getAccessTokenFromRefreshToken(): Promise<void>;
    /**
     * Handle complete user onboarding flow for workspace creation.
     * Flow: signup → signin (get token) → create tenant → refresh token → create organization
     *
     * @param organization Organization creation input data
     * @param userRegistrationData User registration data (firstName, lastName, password, confirmPassword)
     * @param confirmedEmail The confirmed email from magic code flow
     * @returns Promise<void>
     */
    onboardUser(organization: IOrganizationCreateInput, userRegistrationData: {
        firstName: string;
        lastName: string;
        password: string;
        confirmPassword: string;
    }, confirmedEmail: string): Promise<void>;
    /**
     * Updates workspace states after successful authentication or creation.
     *
     * @param selectedTenantId The ID of the tenant to mark as selected
     */
    private updateWorkspaceStates;
    /**
     * Updates the store with workspace authentication data.
     * This is a centralized method for consistent store updates across components.
     *
     * @param response The authentication response containing user and token data
     * @returns Promise<void> to wait for complete store update
     */
    updateStoreWithWorkspaceData(response: IAuthResponse): Promise<void>;
    /**
     * Handles workspace sign-in using token.
     * Centralizes the workspace sign-in logic that was duplicated across components.
     *
     * @param email The confirmed email
     * @param token The workspace token
     * @returns Promise<void> - resolves when store is fully updated
     * @throws Error if signin fails
     */
    signInWorkspaceByToken(email: string, token: string): Promise<void>;
    /**
     * Sends magic code for workspace authentication.
     * Centralizes the code sending logic that was duplicated across components.
     *
     * @param email The email to send the code to
     * @returns Promise<unknown>
     */
    sendSigninCode(email: string): Promise<unknown>;
    /**
     * Confirms the sign-in code and returns workspace information.
     * Centralizes the code confirmation logic that was duplicated across components.
     *
     * @param email The email address
     * @param code The verification code
     * @returns Promise<IUserSigninWorkspaceResponse>
     */
    confirmSignInByCode(email: string, code: string): Promise<IUserSigninWorkspaceResponse>;
    static ɵfac: i0.ɵɵFactoryDeclaration<WorkspaceAuthService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<WorkspaceAuthService>;
}
