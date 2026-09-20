import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IExpenseCategory, IExpenseCategoryFind, IPagination } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class ExpenseCategoriesService {
    private http;
    constructor(http: HttpClient);
    getAll(where: IExpenseCategoryFind): Observable<IPagination<IExpenseCategory>>;
    create(category: IExpenseCategory): Observable<IExpenseCategory>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ExpenseCategoriesService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ExpenseCategoriesService>;
}
