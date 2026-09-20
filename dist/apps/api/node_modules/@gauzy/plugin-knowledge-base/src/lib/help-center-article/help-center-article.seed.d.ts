import { DataSource } from 'typeorm';
import { IHelpCenterArticle, IOrganization, ITenant } from '@gauzy/contracts';
export declare const createHelpCenterArticle: (dataSource: DataSource, tenants: ITenant[], tenantOrganizationsMap: Map<ITenant, IOrganization[]>, numberOfHelpCenterArticle: any) => Promise<IHelpCenterArticle[]>;
