import { IEmailHistory, IEmailTemplate, IUser, EmailStatusEnum, ID } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class EmailHistory extends TenantOrganizationBaseEntity implements IEmailHistory {
    /**
     * The name of the email sent.
     */
    name: string;
    /**
     * The content of the email sent.
     */
    content: string;
    /**
     * The email associated with the email sent.
     */
    email: string;
    /**
     * The status of the email sent.
     */
    status?: EmailStatusEnum;
    /**
     * The user associated with the email sent.
     */
    user?: IUser;
    /**
     * The ID of the user associated with the email sent.
     */
    userId?: ID;
    /**
     * The email template associated with the email sent.
     */
    emailTemplate: IEmailTemplate;
    /**
     * The ID of the email template associated with the email sent.
     */
    emailTemplateId: ID;
}
