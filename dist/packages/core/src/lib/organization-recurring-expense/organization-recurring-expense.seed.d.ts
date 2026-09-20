import { DataSource } from 'typeorm';
import { OrganizationRecurringExpense } from './organization-recurring-expense.entity';
import { IOrganization, ITenant } from '@gauzy/contracts';
export declare const createDefaultOrganizationRecurringExpense: (dataSource: DataSource, tenant: ITenant, defaultOrganization: IOrganization) => Promise<OrganizationRecurringExpense[]>;
export declare const createRandomOrganizationRecurringExpense: (dataSource: DataSource, tenants: ITenant[], tenantOrganizationsMap: Map<ITenant, IOrganization[]>) => Promise<OrganizationRecurringExpense[]>;
