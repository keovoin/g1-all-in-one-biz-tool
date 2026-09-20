import { HttpClient } from '@angular/common/http';
import { IEmployeeRecurringExpense, IEmployeeRecurringExpenseByMonthFindInput, IEmployeeRecurringExpenseFindInput, IFindStartDateUpdateTypeInput, IStartUpdateTypeInfo, IRecurringExpenseDeleteInput, IRecurringExpenseOrderFields, IPagination } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class EmployeeRecurringExpenseService {
    private readonly http;
    private readonly API_URL;
    constructor(http: HttpClient);
    create(createInput: IEmployeeRecurringExpense): Promise<any>;
    getAll(relations?: string[], where?: IEmployeeRecurringExpenseFindInput, order?: IRecurringExpenseOrderFields): Promise<IPagination<IEmployeeRecurringExpense>>;
    getAllByRange(relations?: string[], where?: IEmployeeRecurringExpenseByMonthFindInput): Promise<IPagination<IEmployeeRecurringExpense>>;
    delete(id: string, deleteInput: IRecurringExpenseDeleteInput): Promise<any>;
    update(id: string, updateInput: IEmployeeRecurringExpense): Promise<any>;
    getStartDateUpdateType(findInput?: IFindStartDateUpdateTypeInput): Promise<IStartUpdateTypeInfo>;
    static ɵfac: i0.ɵɵFactoryDeclaration<EmployeeRecurringExpenseService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<EmployeeRecurringExpenseService>;
}
