import { ISplitExpenseFindInput } from '@gauzy/contracts';
import { IQuery } from '@nestjs/cqrs';
export declare class FindSplitExpenseQuery implements IQuery {
    readonly findInput: ISplitExpenseFindInput;
    static readonly type = "[Expense] Find Split Expense";
    constructor(findInput: ISplitExpenseFindInput);
}
