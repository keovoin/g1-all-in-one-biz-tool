import { HttpClient } from '@angular/common/http';
import { IFindStartDateUpdateTypeInput, IStartUpdateTypeInfo, IOrganizationRecurringExpense, IOrganizationRecurringExpenseFindInput, IOrganizationRecurringExpenseForEmployeeOutput, IRecurringExpenseDeleteInput, IRecurringExpenseOrderFields } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class OrganizationRecurringExpenseService {
    private http;
    private readonly API_URL;
    constructor(http: HttpClient);
    create(createInput: IOrganizationRecurringExpense): Promise<any>;
    getAll(relations?: string[], findInput?: IOrganizationRecurringExpenseFindInput, order?: IRecurringExpenseOrderFields): Promise<{
        items: IOrganizationRecurringExpense[];
        total: number;
    }>;
    getAllByMonth(findInput?: IOrganizationRecurringExpenseFindInput): Promise<{
        items: IOrganizationRecurringExpense[];
        total: number;
    }>;
    delete(id: string, deleteInput: IRecurringExpenseDeleteInput): Promise<any>;
    update(id: string, updateInput: IOrganizationRecurringExpense): Promise<any>;
    getSplitExpensesForEmployee(orgId: string, findInput?: IOrganizationRecurringExpenseFindInput): Promise<{
        items: IOrganizationRecurringExpenseForEmployeeOutput[];
        total: number;
    }>;
    getStartDateUpdateType(findInput?: IFindStartDateUpdateTypeInput): Promise<IStartUpdateTypeInfo>;
    static ɵfac: i0.ɵɵFactoryDeclaration<OrganizationRecurringExpenseService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<OrganizationRecurringExpenseService>;
}
