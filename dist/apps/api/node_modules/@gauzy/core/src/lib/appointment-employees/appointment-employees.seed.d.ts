import { DataSource } from 'typeorm';
import { IAppointmentEmployee, IEmployee, IOrganization, ITenant } from '@gauzy/contracts';
export declare const createRandomAppointmentEmployees: (dataSource: DataSource, tenants: ITenant[], tenantOrganizationsMap: Map<ITenant, IOrganization[]>, organizationEmployeesMap: Map<IOrganization, IEmployee[]>) => Promise<IAppointmentEmployee[]>;
