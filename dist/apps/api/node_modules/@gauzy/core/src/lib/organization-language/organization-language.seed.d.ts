import { DataSource } from 'typeorm';
import { IOrganization, IOrganizationLanguage, ITenant } from '@gauzy/contracts';
export declare const createDefaultOrganizationLanguage: (dataSource: DataSource, tenant: ITenant, defaultOrganizations: IOrganization[]) => Promise<IOrganizationLanguage[]>;
export declare const createRandomOrganizationLanguage: (dataSource: DataSource, tenants: ITenant[], tenantOrganizationsMap: Map<ITenant, IOrganization[]>) => Promise<IOrganizationLanguage[]>;
