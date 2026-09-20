import { HttpClient } from '@angular/common/http';
import { IExpense, IExpenseCreateInput, IExpenseFindInput, IExpenseReportData, IExpenseUpdateInput, IPagination, ISplitExpenseOutput } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class ExpensesService {
    private http;
    constructor(http: HttpClient);
    create(createInput: IExpenseCreateInput): Promise<IExpense>;
    getMyAllWithSplitExpenses(relations?: string[], filterDate?: Date): Promise<IPagination<ISplitExpenseOutput>>;
    getById(id: string): Promise<IExpense>;
    getAllWithSplitExpenses(employeeId: string, relations?: string[], filterDate?: Date): Promise<IPagination<ISplitExpenseOutput>>;
    getAll(relations?: string[], findInput?: IExpenseFindInput, filterDate?: Date): Promise<IPagination<IExpense>>;
    update(id: string, updateInput: IExpenseUpdateInput): Promise<IExpense>;
    delete(expenseId: string, input: IExpenseFindInput): Promise<any>;
    getDailyExpensesReport(request?: any): Promise<IExpenseReportData[]>;
    /**
     * Retrieves expense report chart data based on the provided request parameters.
     * @param request - The request parameters for fetching expense report data.
     * @returns A Promise that resolves to an array of IExpenseReportData objects.
     */
    getExpenseReportCharts(request?: any): Promise<IExpenseReportData[]>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ExpensesService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ExpensesService>;
}
