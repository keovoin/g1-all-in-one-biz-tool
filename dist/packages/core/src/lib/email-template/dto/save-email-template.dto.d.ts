import { EmailTemplateEnum, IEmailTemplateSaveInput, LanguagesEnum } from "@gauzy/contracts";
import { TenantOrganizationBaseDTO } from "../../core/dto";
/**
 * Save email template request DTO validation
 */
export declare class SaveEmailTemplateDTO extends TenantOrganizationBaseDTO implements IEmailTemplateSaveInput {
    readonly languageCode: LanguagesEnum;
    readonly name: EmailTemplateEnum;
    readonly mjml: string;
    readonly subject: string;
}
