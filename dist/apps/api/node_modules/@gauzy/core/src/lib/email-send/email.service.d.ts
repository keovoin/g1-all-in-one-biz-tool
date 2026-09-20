import { IAppIntegrationConfig } from '@gauzy/common';
import { IInviteEmployeeModel, IInviteUserModel, IOrganization, IOrganizationContact, LanguagesEnum, IJoinEmployeeModel, ITimesheet, IEmailHistory, IUser, IInvite, IInviteTeamMemberModel, IOrganizationTeam, IOrganizationTeamJoinRequest, IResendEmailInput, ITenant, ID } from '@gauzy/contracts';
import { EmailSendService } from './../email-send/email-send.service';
import { TypeOrmEmailHistoryRepository } from './../email-history/repository/type-orm-email-history.repository';
import { TypeOrmEmailTemplateRepository } from './../email-template/repository/type-orm-email-template.repository';
import { TypeOrmOrganizationRepository } from './../organization/repository/type-orm-organization.repository';
export declare class EmailService {
    readonly typeOrmEmailHistoryRepository: TypeOrmEmailHistoryRepository;
    readonly typeOrmEmailTemplateRepository: TypeOrmEmailTemplateRepository;
    readonly typeOrmOrganizationRepository: TypeOrmOrganizationRepository;
    readonly emailSendService: EmailSendService;
    constructor(typeOrmEmailHistoryRepository: TypeOrmEmailHistoryRepository, typeOrmEmailTemplateRepository: TypeOrmEmailTemplateRepository, typeOrmOrganizationRepository: TypeOrmOrganizationRepository, emailSendService: EmailSendService);
    /**
     *
     * @param languageCode
     * @param email
     * @param contactName
     * @param invoiceNumber
     * @param amount
     * @param currency
     * @param organization
     * @param originUrl
     */
    sendPaymentReceipt(languageCode: LanguagesEnum, email: string, contactName: string, invoiceNumber: number, amount: number, currency: string, organization: IOrganization, originUrl: string): Promise<void>;
    /**
     *
     * @param languageCode
     * @param email
     * @param base64
     * @param invoiceNumber
     * @param invoiceId
     * @param isEstimate
     * @param token
     * @param originUrl
     * @param organization
     */
    emailInvoice(languageCode: LanguagesEnum, email: string, base64: string, invoiceNumber: number, invoiceId: string, isEstimate: boolean, token: any, origin: string, organization: IOrganization): Promise<void>;
    /**
     * Sends an invitation email to an organization contact.
     *
     * @param organizationContact - The contact to invite.
     * @param inviterUser - The user sending the invitation.
     * @param organization - The organization details.
     * @param invite - The invitation details containing the token.
     * @param languageCode - The locale for the email.
     * @param originUrl - Optional override for the base URL.
     * @returns {Promise<void>}
     */
    inviteOrganizationContact(organizationContact: IOrganizationContact, inviterUser: IUser, organization: IOrganization, invite: IInvite, languageCode: LanguagesEnum, originUrl?: string): Promise<void>;
    /**
     * Invites a user by sending an email using the provided invite model.
     *
     * @param inviteUserModel - The invite model containing user and organization details.
     * @returns A promise that resolves when the invitation email has been sent and the record created.
     */
    inviteUser(inviteUserModel: IInviteUserModel): Promise<void>;
    /**
     * Invite team members by sending an email with the invite details.
     *
     * @param invite - The invite model containing team member invite details.
     * @returns A promise that resolves when the invitation email is sent and recorded.
     */
    inviteTeamMember(invite: IInviteTeamMemberModel): Promise<void>;
    /**
     * Invites an employee by sending an email using the provided invite model.
     *
     * @param inviteEmployeeModel - The model containing the details for the employee invite.
     * @returns A promise that resolves when the invitation email has been sent and recorded.
     */
    inviteEmployee(inviteEmployeeModel: IInviteEmployeeModel): Promise<void>;
    /**
     * Sends an email to accept an invitation for an employee.
     *
     * @param joinEmployeeModel - The model containing details for the employee's join invitation.
     * @param originUrl - Optional origin URL to override the default client base URL.
     * @returns A promise that resolves when the email has been sent and recorded.
     */
    sendAcceptInvitationEmail(joinEmployeeModel: IJoinEmployeeModel, originUrl?: string): Promise<void>;
    /**
     *
     * @param user
     * @param languageCode
     * @param organizationId
     * @param originUrl
     * @param integration
     */
    welcomeUser(user: IUser, languageCode: LanguagesEnum, organizationId?: string, originUrl?: string, integration?: IAppIntegrationConfig): Promise<void>;
    /**
     * Send confirmation email link
     *
     * @param user
     * @param verificationLink
     */
    emailVerification(user: IUser, verificationLink: string, verificationCode: string, integration: IAppIntegrationConfig): Promise<void>;
    /**
     * Sends a password reset request to the user via email.
     *
     * This method sends a password reset email to the specified user using the provided reset link.
     * It integrates with an email service to send the email and logs the email message to a record.
     * The function checks whether the user's email domain is allowed before proceeding with the email.
     *
     * @param user - The user object containing the user's information, including their email.
     * @param resetLink - The generated password reset link that will be sent to the user's email.
     * @param languageCode - The language code to use for the email localization.
     * @param originUrl - Optional URL that defines the origin of the reset link. If not provided,
     *                    it defaults to the application's client base URL.
     * @returns {Promise<void>} - A promise that resolves once the email has been sent and the record has been created.
     */
    requestPassword(user: IUser, resetLink: string, languageCode: LanguagesEnum, originUrl?: string): Promise<void>;
    /**
     * Sends a multi-tenant password reset email to a user across multiple tenants.
     *
     * @param email The email of the user.
     * @param tenants Array of tenants and user details with reset links.
     * @param languageCode The language code for localization.
     * @param originUrl The origin URL to be used for generating reset links.
     */
    multiTenantResetPassword(email: string, tenants: {
        resetLink: string;
        tenant?: ITenant;
        user: IUser;
    }[], languageCode: LanguagesEnum, originUrl: string): Promise<void>;
    /**
     *
     * @param email
     * @param languageCode
     * @param organizationId
     * @param originUrl
     */
    sendAppointmentMail(email: string, languageCode: LanguagesEnum, organizationId?: string, originUrl?: string): Promise<void>;
    /**
     *
     * @param email
     * @param timesheet
     */
    setTimesheetAction(email: string, timesheet: ITimesheet): Promise<void>;
    /**
     *
     * @param email
     * @param timesheet
     */
    timesheetSubmit(email: string, timesheet: ITimesheet): Promise<void>;
    /**
     * Sends a magic login code to the user's email for password-less authentication.
     *
     * @param email - User's email address.
     * @param magicCode - Generated magic code for login.
     * @param magicLink - Link for password-less authentication.
     * @param locale - Language/locale for email content.
     * @param integration - App integration configuration.
     * @param expireMinutes - Number of minutes until the magic code expires.
     * @returns {Promise<void>} - A promise indicating the completion of the operation.
     */
    sendMagicLoginCode({ email, magicCode, magicLink, locale, integration }: {
        email: IUser['email'];
        magicCode: IUser['code'];
        magicLink: IAppIntegrationConfig['appMagicSignUrl'];
        locale: LanguagesEnum;
        integration: IAppIntegrationConfig;
    }): Promise<void>;
    /**
     * Email Reset
     *
     * @param user
     * @param languageCode
     */
    emailReset(user: IUser, languageCode: LanguagesEnum, verificationCode: string, organization: IOrganization): Promise<void>;
    /**
     * Organization team join request email
     *
     * @param email
     * @param code
     * @param languageCode
     * @param organization
     */
    organizationTeamJoinRequest(organizationTeam: IOrganizationTeam, organizationTeamJoinRequest: IOrganizationTeamJoinRequest, languageCode: LanguagesEnum, organization: IOrganization, integration?: IAppIntegrationConfig): Promise<void>;
    /**
     *
     * @param languageCode
     * @param email
     * @param candidateName
     * @param organization
     * @param originUrl
     */
    sendRejectionEmail(languageCode: LanguagesEnum, email: string, candidateName: string, organization: IOrganization, originUrl: string): Promise<void>;
    /**
     * Resend an email based on the provided email history ID, input details, and language code.
     *
     * @param id - The unique identifier of the email history record.
     * @param input - The input object containing organization and tenant details for resending the email.
     * @param languageCode - The language code used for localizing email content (if applicable).
     * @returns A promise that resolves to the updated email history record.
     */
    resendEmail(id: ID, input: IResendEmailInput, languageCode: LanguagesEnum): Promise<IEmailHistory>;
    /**
     *
     * @param createEmailOptions
     * @returns
     */
    private createEmailRecord;
    private nodemailerSendEmail;
}
