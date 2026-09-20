import { IBasePerTenantAndOrganizationEntityModel } from './base-entity.model';
import { IExpense } from './expense.model';
import { ITag } from './tag.model';
export interface IExpenseCategory extends IBasePerTenantAndOrganizationEntityModel {
    name: string;
    tags?: ITag[];
    expenses?: IExpense[];
}
export interface IExpenseCategoryFind extends IBasePerTenantAndOrganizationEntityModel {
    name?: string;
}
export declare enum ExpenseCategoriesEnum {
    SOFTWARE = "Software",
    EMPLOYEES_BENEFITS = "Employees Benefits",
    COURSES = "Courses",
    SUBSCRIPTIONS = "Subscriptions",
    RENT = "Rent",
    SERVICE_FEE = "Service Fee"
}
