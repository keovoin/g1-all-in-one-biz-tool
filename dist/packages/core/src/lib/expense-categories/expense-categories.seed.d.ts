import { IExpenseCategory, IOrganization, ITenant } from '@gauzy/contracts';
import { DataSource } from 'typeorm';
import { ExpenseCategory } from './expense-category.entity';
export declare const createExpenseCategories: (dataSource: DataSource, tenant: ITenant, organizations: IOrganization[]) => Promise<ExpenseCategory[]>;
export declare const createRandomExpenseCategories: (dataSource: DataSource, tenants: ITenant[], tenantOrganizationMap: Map<ITenant, IOrganization[]>) => Promise<Map<IOrganization, IExpenseCategory[]>>;
