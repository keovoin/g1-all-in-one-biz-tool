import { DataSource } from 'typeorm';
import { IOrganization, ITenant } from '@gauzy/contracts';
export declare const createRandomProductVariant: (dataSource: DataSource, tenants: ITenant[], tenantOrganizationsMap: Map<ITenant, IOrganization[]>, numberOfVariantPerProduct: number) => Promise<void>;
