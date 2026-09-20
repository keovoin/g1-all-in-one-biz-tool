import { ID, IIntegrationTenant, IOrganizationGithubRepository, IOrganizationGithubRepositoryIssue } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '@gauzy/core';
export declare class OrganizationGithubRepository extends TenantOrganizationBaseEntity implements IOrganizationGithubRepository {
    /**
     * The ID of the GitHub repository.
     * Should be a bigint to accommodate larger IDs.
     */
    repositoryId: number;
    name: string;
    fullName: string;
    owner: string;
    issuesCount: number;
    hasSyncEnabled: boolean;
    private: boolean;
    status: string;
    /** What integration tenant sync to */
    integration: IIntegrationTenant;
    integrationId: ID;
    /** Repository Sync Organization Projects */
    issues?: IOrganizationGithubRepositoryIssue[];
}
