import { IQuery } from '@nestjs/cqrs';
import { EmailTemplate } from './../email-template.entity';
import { BaseQueryDTO } from '../../core/dto/base-query.dto';
export declare class EmailTemplateQuery implements IQuery {
    readonly options: BaseQueryDTO<EmailTemplate>;
    static readonly type = "[Email Template] Query All";
    constructor(options: BaseQueryDTO<EmailTemplate>);
}
