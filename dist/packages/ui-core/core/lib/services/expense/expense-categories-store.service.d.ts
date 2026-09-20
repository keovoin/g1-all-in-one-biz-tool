import { Observable } from 'rxjs';
import { IExpenseCategory, IExpenseCategoryFind } from '@gauzy/contracts';
import { ExpenseCategoriesService } from './expense-categories.service';
import * as i0 from "@angular/core";
export declare class ExpenseCategoriesStoreService {
    private expenseCategoriesService;
    private _expenseCategories$;
    expenseCategories$: Observable<IExpenseCategory[]>;
    get expenseCategories(): IExpenseCategory[];
    constructor(expenseCategoriesService: ExpenseCategoriesService);
    loadAll(where: IExpenseCategoryFind): void;
    create(category: IExpenseCategory): Observable<IExpenseCategory>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ExpenseCategoriesStoreService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ExpenseCategoriesStoreService>;
}
