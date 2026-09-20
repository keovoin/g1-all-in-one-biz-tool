import { IOrganization, IOrganizationVendor, ITenant } from '@gauzy/contracts';
import { DataSource } from 'typeorm';
import { OrganizationVendor } from './../core/entities/internal';
export declare const createOrganizationVendors: (dataSource: DataSource, tenant: ITenant, organizations: IOrganization[]) => Promise<OrganizationVendor[]>;
export declare const createRandomOrganizationVendors: (dataSource: DataSource, tenants: ITenant[], tenantOrganizationsMap: Map<ITenant, IOrganization[]>) => Promise<Map<IOrganization, IOrganizationVendor[]>>;
