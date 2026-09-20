import { IQueryHandler } from '@nestjs/cqrs';
import { EmailTemplateService } from './../../email-template.service';
import { EmailTemplateQuery } from '../email-template.query';
export declare class EmailTemplateQueryHandler implements IQueryHandler<EmailTemplateQuery> {
    private readonly emailTemplateService;
    constructor(emailTemplateService: EmailTemplateService);
    execute(query: EmailTemplateQuery): Promise<import("dist/packages/contracts/src").IPagination<import("dist/packages/contracts/src").IEmailTemplate>>;
}
