import { DataSource } from 'typeorm';
import { IOrganization, ITenant } from '@gauzy/contracts';
export declare const seedDefaultOrganizationPosition: (dataSource: DataSource, tenant: ITenant, organizations: any) => Promise<void>;
export declare const seedRandomOrganizationPosition: (dataSource: DataSource, tenants: ITenant[], tenantOrganizationsMap: Map<ITenant, IOrganization[]>) => Promise<void>;
