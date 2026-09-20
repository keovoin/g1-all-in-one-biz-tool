import { DataSource } from 'typeorm';
import { IOrganization, ITenant } from '@gauzy/contracts';
export declare const createDefaultEmailSent: (dataSource: DataSource, tenant: ITenant, organization: IOrganization, noOfEmailsPerOrganization: number) => Promise<any>;
export declare const createRandomEmailSent: (dataSource: DataSource, tenants: ITenant[], tenantOrganizationsMap: Map<ITenant, IOrganization[]>, noOfEmailsPerOrganization: number) => Promise<any>;
