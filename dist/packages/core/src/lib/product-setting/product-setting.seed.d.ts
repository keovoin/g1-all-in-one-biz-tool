import { DataSource } from 'typeorm';
import { IOrganization, IProductVariantSetting, ITenant } from '@gauzy/contracts';
export declare const createRandomProductVariantSettings: (dataSource: DataSource, tenants: ITenant[], tenantOrganizationsMap: Map<ITenant, IOrganization[]>) => Promise<IProductVariantSetting[]>;
