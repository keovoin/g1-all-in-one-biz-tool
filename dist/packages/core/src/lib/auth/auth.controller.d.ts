import { BadRequestException } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { IAuthResponse, ISocialAccount, ISocialAccountExistUser, ITokenPair, IUserSigninWorkspaceResponse, LanguagesEnum } from '@gauzy/contracts';
import { User as IUser } from '../user/user.entity';
import { ChangePasswordRequestDTO, ResetPasswordRequestDTO } from './../password-reset/dto';
import { RegisterUserDTO, UserEmailDTO, UserLoginDTO, UserSigninWorkspaceDTO } from './../user/dto';
import { AuthService } from './auth.service';
import { HasPermissionsQueryDTO, HasRoleQueryDTO, RefreshTokenDto, SwitchOrganizationDTO, SwitchWorkspaceDTO, WorkspaceSigninDTO, WorkspaceSigninEmailVerifyDTO } from './dto';
import { FindUserBySocialLoginDTO, SocialLoginBodyRequestDTO } from './social-account/dto';
export declare class AuthController {
    private readonly authService;
    private readonly commandBus;
    constructor(authService: AuthService, commandBus: CommandBus);
    /**
     * Check if the user is authenticated.
     *
     * @returns
     */
    authenticated(): Promise<boolean>;
    /**
     * Check if the user has a specific role.
     *
     * @param query - Query parameters containing roles.
     * @returns
     */
    hasRole(query: HasRoleQueryDTO): Promise<boolean>;
    /**
     * Check if the user has specific permissions.
     *
     * @param query - Query parameters containing permissions.
     * @returns
     */
    hasPermissions(query: HasPermissionsQueryDTO): Promise<boolean>;
    /**
     * Register a new user.
     *
     * @param input - User registration data.
     * @param languageCode - Language code.
     * @param origin - Origin
     * @returns
     */
    register(input: RegisterUserDTO, languageCode: LanguagesEnum, origin: string): Promise<IUser>;
    /**
     * User login.
     *
     * @param input - User login data.
     * @returns
     */
    login(input: UserLoginDTO): Promise<IAuthResponse | null>;
    /**
     * Sign in workspaces by email and password.
     *
     * @param input - User sign-in data.
     * @returns
     */
    signinWorkspacesByPassword(input: UserSigninWorkspaceDTO): Promise<IUserSigninWorkspaceResponse>;
    /**
     * Check if any user with the given provider infos exists

     * @param input An object that contains the provider name and the provider Account ID
     * @returns A promise that resolves to a boolean specifying if the user exists or not
     */
    socialSignupCheckIfUserExistsBySocial(input: FindUserBySocialLoginDTO): Promise<ISocialAccountExistUser>;
    /**
     * Sign in workspaces by email social media.
     *
     * @param input - User sign-in data.
     * @returns
     */
    signinWorkspacesBySocial(input: SocialLoginBodyRequestDTO): Promise<IUserSigninWorkspaceResponse>;
    linkUserToSocialAccount(input: SocialLoginBodyRequestDTO): Promise<ISocialAccount>;
    /**
     * Send a workspace sign-in code by email.
     *
     * @param entity - User email data.
     * @param locale - Language code.
     * @returns
     */
    sendWorkspaceSigninCode(entity: UserEmailDTO, locale: LanguagesEnum): Promise<any>;
    /**
     * Confirm workspace sign-in by email code.
     *
     * @param input - Workspace sign-in email verification data.
     * @returns
     */
    signinWorkspacesByMagicCode(input: WorkspaceSigninEmailVerifyDTO): Promise<IUserSigninWorkspaceResponse>;
    /**
     * Sign in to a workspace by token.
     *
     * @param input - Workspace sign-in data.
     * @returns
     */
    signinWorkspaceByToken(input: WorkspaceSigninDTO): Promise<IAuthResponse | null>;
    /**
     * Reset the user's password.
     *
     * @param request - Password change request data.
     * @returns
     */
    resetPassword(request: ChangePasswordRequestDTO): Promise<boolean>;
    /**
     * Request a password reset.
     *
     * @param body - Password reset request data.
     * @param origin - Origin Request Header.
     * @param languageCode - Language code.
     * @returns
     */
    requestPassword(body: ResetPasswordRequestDTO, origin: string, languageCode: LanguagesEnum): Promise<boolean | BadRequestException>;
    /**
     * Logout the user by revoking the provided refresh token and the current access token. If no refresh token is provided, it will attempt to revoke the current access token only. Any errors during the revocation process are logged but do not prevent the logout from completing.
     *
     * @param refreshToken The refresh token to be revoked. This is optional as the function will attempt to revoke the current access token regardless.
     * @returns void
     */
    logout(refreshToken?: string): Promise<void>;
    /**
     * Refresh the access token using a refresh token.
     *
     * @param input - Refresh token data.
     * @returns
     */
    refreshToken(input: RefreshTokenDto): Promise<ITokenPair | null>;
    /**
     * Get all workspaces (tenants) that the current authenticated user has access to.
     *
     * @param includeTeams - Whether to include teams in the response (default: false).
     * @returns A promise that resolves to the user signin workspace response.
     */
    getUserWorkspaces(includeTeams?: string): Promise<IUserSigninWorkspaceResponse>;
    /**
     * Switch the current user to a different workspace (tenant).
     *
     * @param input - Switch workspace data containing tenant ID.
     * @returns A promise that resolves to the authentication response with new tokens or null if switching fails.
     */
    switchWorkspace(input: SwitchWorkspaceDTO): Promise<IAuthResponse | null>;
    /**
     * Switch to a different organization within the current workspace
     */
    switchOrganization(input: SwitchOrganizationDTO): Promise<IAuthResponse | null>;
}
