import { DataSource } from 'typeorm';
import { IOrganization, IRequestApprovalTeam, ITenant } from '@gauzy/contracts';
export declare const createRandomRequestApprovalTeam: (dataSource: DataSource, tenants: ITenant[], tenantOrganizationsMap: Map<ITenant, IOrganization[]>) => Promise<IRequestApprovalTeam[]>;
