import { IOrganizationRecurringExpenseByMonthFindInput } from '@gauzy/contracts';
import { IQuery } from '@nestjs/cqrs';
export declare class OrganizationRecurringExpenseByMonthQuery implements IQuery {
    readonly input: IOrganizationRecurringExpenseByMonthFindInput;
    static readonly type = "[OrganizationRecurringExpense] By Month";
    constructor(input: IOrganizationRecurringExpenseByMonthFindInput);
}
