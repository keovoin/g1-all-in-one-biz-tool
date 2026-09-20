import { IAppIntegrationConfig } from '@gauzy/common';
import { IBasePerTenantEntityModel, IUser, IUserCodeInput, IUserEmailInput, IUserTokenInput } from '@gauzy/contracts';
import { EmailService } from './../email-send/email.service';
import { UserService } from './../user/user.service';
import { FeatureService } from './../feature/feature.service';
import { PasswordHashService } from '../password-hash/password-hash.service';
export declare class EmailConfirmationService {
    private readonly emailService;
    private readonly userService;
    private readonly featureFlagService;
    private readonly passwordHashService;
    private readonly logger;
    constructor(emailService: EmailService, userService: UserService, featureFlagService: FeatureService, passwordHashService: PasswordHashService);
    /**
     * Sends an email verification link and code to the user.
     *
     * @param user The user to send the verification email to.
     * @param integration Configuration for app integration.
     */
    sendEmailVerification(user: IUser, integration: IAppIntegrationConfig): Promise<void>;
    /**
     * Resend confirmation email link
     *
     */
    resendConfirmationLink(config: IAppIntegrationConfig): Promise<Object>;
    /**
     * Decode email confirmation token
     *
     * @param token
     * @returns
     */
    decodeConfirmationToken(token: IUserTokenInput['token']): Promise<IUser>;
    /**
     * Email confirmation by code
     *
     * @param payload
     * @returns
     */
    confirmationByCode(payload: IUserEmailInput & IUserCodeInput & IBasePerTenantEntityModel): Promise<IUser>;
    /**
     * Confirm user email
     *
     * @param user
     */
    confirmEmail(user: IUser): Promise<Object>;
}
