import { DataSource } from 'typeorm';
import { IOrganization, ITenant } from '@gauzy/contracts';
export declare const createRandomMerchants: (dataSource: DataSource, tenants: ITenant[], tenantOrganizationsMap: Map<ITenant, IOrganization[]>) => Promise<void>;
export declare const createDefaultMerchants: (dataSource: DataSource, tenant: ITenant, organizations: IOrganization[]) => Promise<void>;
