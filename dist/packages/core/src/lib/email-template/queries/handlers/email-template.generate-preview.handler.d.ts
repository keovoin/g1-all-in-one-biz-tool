import { IQueryHandler } from '@nestjs/cqrs';
import { ConfigService } from '@gauzy/config';
import { EmailTemplateGeneratePreviewQuery } from '../email-template.generate-preview.query';
export declare class EmailTemplateGeneratePreviewHandler implements IQueryHandler<EmailTemplateGeneratePreviewQuery> {
    private readonly configService;
    constructor(configService: ConfigService);
    execute(command: EmailTemplateGeneratePreviewQuery): Promise<{
        html: string;
    }>;
}
