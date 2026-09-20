import { IQueryHandler } from '@nestjs/cqrs';
import { AccountingTemplateService } from '../../accounting-template.service';
import { AccountingTemplateQuery } from '../accounting-template.query';
export declare class AccountingTemplateHandler implements IQueryHandler<AccountingTemplateQuery> {
    private readonly accountingTemplateService;
    constructor(accountingTemplateService: AccountingTemplateService);
    execute(query: AccountingTemplateQuery): Promise<import("dist/packages/contracts/src").IPagination<import("dist/packages/contracts/src").IAccountingTemplate>>;
}
