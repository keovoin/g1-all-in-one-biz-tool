import { IQuery } from '@nestjs/cqrs';
import { AccountingTemplate } from './../accounting-template.entity';
import { BaseQueryDTO } from '../../core/dto/base-query.dto';
export declare class AccountingTemplateQuery implements IQuery {
    readonly options: BaseQueryDTO<AccountingTemplate>;
    static readonly type = "[Accounting Template] Query All";
    constructor(options: BaseQueryDTO<AccountingTemplate>);
}
