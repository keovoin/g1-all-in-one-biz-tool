import { IHelpCenter, IOrganization, ITenant } from '@gauzy/contracts';
import { DataSource } from 'typeorm';
export declare const createHelpCenter: (dataSource: DataSource, tenants: ITenant[], tenantOrganizationsMap: Map<ITenant, IOrganization[]>) => Promise<IHelpCenter[]>;
