import { DataSource } from 'typeorm';
import { IOrganization, ITenant } from '@gauzy/contracts';
import { ApprovalPolicy } from './approval-policy.entity';
export declare const createDefaultApprovalPolicyForOrg: (dataSource: DataSource, defaultData: {
    orgs: IOrganization[];
}) => Promise<ApprovalPolicy[]>;
export declare const createRandomApprovalPolicyForOrg: (dataSource: DataSource, tenants: ITenant[], tenantOrganizationsMap: Map<ITenant, IOrganization[]>) => Promise<ApprovalPolicy[]>;
