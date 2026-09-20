import { DataSource } from 'typeorm';
import { OrganizationDepartment } from './organization-department.entity';
import { IOrganization, ITenant } from '@gauzy/contracts';
export declare const createDefaultOrganizationDepartments: (dataSource: DataSource, tenant: ITenant, organizations: IOrganization[]) => Promise<OrganizationDepartment[]>;
export declare const seedRandomOrganizationDepartments: (dataSource: DataSource, tenants: ITenant[], tenantOrganizationsMap: Map<ITenant, IOrganization[]>) => Promise<void>;
