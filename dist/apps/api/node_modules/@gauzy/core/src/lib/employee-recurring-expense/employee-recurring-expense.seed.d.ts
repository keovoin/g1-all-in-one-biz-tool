import { DataSource } from 'typeorm';
import { IEmployee, IOrganization, ITenant } from '@gauzy/contracts';
import { EmployeeRecurringExpense } from './employee-recurring-expense.entity';
export declare const createRandomEmployeeRecurringExpense: (dataSource: DataSource, tenants: ITenant[], tenantOrganizationsMap: Map<ITenant, IOrganization[]>, organizationEmployeesMap: Map<IOrganization, IEmployee[]>) => Promise<EmployeeRecurringExpense[]>;
