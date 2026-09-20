import { IExpense, IExpenseReportGroupByDate, IExpenseReportGroupByEmployee, IExpenseReportGroupByProject } from '@gauzy/contracts';
export declare class ExpenseMapService {
    constructor();
    mapByDate(expenses: IExpense[]): IExpenseReportGroupByDate[];
    mapByEmployee(expenses: IExpense[]): IExpenseReportGroupByEmployee[];
    mapByProject(expenses: IExpense[]): IExpenseReportGroupByProject[];
    private groupByProject;
    private groupByDate;
    private groupByEmployee;
    private mapExpensePercentage;
    private getDurationSum;
}
