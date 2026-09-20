import { DataSource } from 'typeorm';
import { IOrganization, IProductVariantPrice, ITenant } from '@gauzy/contracts';
export declare const createRandomProductVariantPrice: (dataSource: DataSource, tenants: ITenant[], tenantOrganizationsMap: Map<ITenant, IOrganization[]>) => Promise<IProductVariantPrice[]>;
