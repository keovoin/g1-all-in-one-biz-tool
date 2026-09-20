import { DataSource } from 'typeorm';
import { IEmployee, IOrganization, ITenant } from '@gauzy/contracts';
import { ApprovalPolicy } from '../approval-policy/approval-policy.entity';
/**
 *
 * @param dataSource
 * @param defaultData
 * @returns
 */
export declare const createDefaultRequestApprovalEmployee: (dataSource: DataSource, defaultData: {
    employees: IEmployee[];
    orgs: IOrganization[];
    approvalPolicies: ApprovalPolicy[] | void;
}) => Promise<void>;
export declare const createRandomRequestApproval: (dataSource: DataSource, tenants: ITenant[], tenantOrganizationsMap: Map<ITenant, IOrganization[]>, organizationEmployeesMap: Map<IOrganization, IEmployee[]>, noOfRequestsPerOrganizations: number) => Promise<any>;
