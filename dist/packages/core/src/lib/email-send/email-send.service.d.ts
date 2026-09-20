import * as Email from 'email-templates';
import { IBasePerTenantAndOrganizationEntityModel } from '@gauzy/contracts';
import { CustomSmtpService } from './../custom-smtp/custom-smtp.service';
import { EmailTemplateRenderService } from './email-template-render.service';
export declare class EmailSendService {
    private readonly customSmtpService;
    private readonly emailTemplateRenderService;
    constructor(customSmtpService: CustomSmtpService, emailTemplateRenderService: EmailTemplateRenderService);
    /**
     * Retrieves an instance of the `Email` class by verifying the default SMTP transporter.
     *
     * - Fetches the default SMTP configuration.
     * - Converts the SMTP configuration to a transporter.
     * - Verifies the transporter.
     * - Returns an email instance if the transporter is valid.
     * - Throws an error if the verification fails.
     *
     * @returns {Promise<Email<any>>} A promise that resolves to an Email instance.
     * @throws {InternalServerErrorException} If there is an error while retrieving or verifying the SMTP configuration.
     */
    getInstance(): Promise<Email<any>>;
    /**
     *
     * @param param0
     */
    getEmailInstance({ organizationId, tenantId }: IBasePerTenantAndOrganizationEntityModel): Promise<Email<any>>;
    /**
     *
     * @param smtpConfig
     * @returns
     */
    private getEmailConfig;
}
