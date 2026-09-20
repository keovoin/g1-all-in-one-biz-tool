import { DataSource } from 'typeorm';
import { IOrganization, IOrganizationDocument, ITenant } from '@gauzy/contracts';
export declare const createOrganizationDocuments: (dataSource: DataSource, tenant: ITenant, organizations: IOrganization[]) => Promise<IOrganizationDocument[]>;
export declare const createRandomOrganizationDocuments: (dataSource: DataSource, tenants: ITenant[], tenantOrganizationsMap: Map<ITenant, IOrganization[]>) => Promise<IOrganizationDocument[]>;
