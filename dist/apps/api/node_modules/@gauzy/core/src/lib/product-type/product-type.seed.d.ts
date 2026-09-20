import { DataSource } from 'typeorm';
import { Tenant } from '../tenant/tenant.entity';
import { IOrganization } from '@gauzy/contracts';
import { ProductType } from './product-type.entity';
export declare const createDefaultProductTypes: (dataSource: DataSource, organizations: IOrganization[]) => Promise<ProductType[]>;
export declare const createRandomProductType: (dataSource: DataSource, tenants: Tenant[], tenantOrganizationsMap: Map<Tenant, IOrganization[]>) => Promise<ProductType[]>;
