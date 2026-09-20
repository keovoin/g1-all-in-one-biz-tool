import { IExpense, IExpenseCategory, ITag } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class ExpenseCategory extends TenantOrganizationBaseEntity implements IExpenseCategory {
    name: string;
    /**
     * Expense
     */
    expenses?: IExpense[];
    /**
     * Tag
     */
    tags?: ITag[];
}
