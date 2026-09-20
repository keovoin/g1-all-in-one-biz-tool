import { IExpenseCategory } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class ExpenseCategoryCreateCommand implements ICommand {
    readonly input: IExpenseCategory;
    static readonly type = "[ExpenseCategory] Create";
    constructor(input: IExpenseCategory);
}
