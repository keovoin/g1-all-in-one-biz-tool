import { OnChanges, SimpleChanges } from '@angular/core';
import { DefaultFilter } from 'angular2-smart-table';
import { IExpenseCategory } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class ExpenseCategoryFilterComponent extends DefaultFilter implements OnChanges {
    constructor();
    /**
     *
     * @param changes
     */
    ngOnChanges(changes: SimpleChanges): void;
    /**
     *
     * @param value
     */
    selectedExpenseCategoryEvent(value: IExpenseCategory): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ExpenseCategoryFilterComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ExpenseCategoryFilterComponent, "ga-expense-category-select-filter", never, {}, {}, never, never, false, never>;
}
