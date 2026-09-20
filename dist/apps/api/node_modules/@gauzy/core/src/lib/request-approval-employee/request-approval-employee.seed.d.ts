import { DataSource } from 'typeorm';
import { IEmployee, IOrganization, ITenant } from '@gauzy/contracts';
import { RequestApprovalEmployee } from './request-approval-employee.entity';
export declare const createRandomRequestApprovalEmployee: (dataSource: DataSource, tenants: ITenant[], tenantOrganizationsMap: Map<ITenant, IOrganization[]>, organizationEmployeesMap: Map<IOrganization, IEmployee[]>) => Promise<RequestApprovalEmployee[]>;
