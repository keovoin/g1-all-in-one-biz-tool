import { TypeOrmEmailTemplateRepository } from './../email-template/repository/type-orm-email-template.repository';
import { TypeOrmCustomSmtpRepository } from './../custom-smtp/repository/type-orm-custom-smtp.repository';
export declare class EmailTemplateRenderService {
    private typeOrmEmailTemplateRepository;
    private typeOrmCustomSmtpRepository;
    constructor(typeOrmEmailTemplateRepository: TypeOrmEmailTemplateRepository, typeOrmCustomSmtpRepository: TypeOrmCustomSmtpRepository);
    /**
     * Renders an email template based on the provided view and locals.
     * @param view The name of the email template to render.
     * @param locals Local variables to be used in the template rendering.
     * @returns The rendered HTML content of the email template.
     */
    render: (view: string, locals: any) => Promise<string>;
}
