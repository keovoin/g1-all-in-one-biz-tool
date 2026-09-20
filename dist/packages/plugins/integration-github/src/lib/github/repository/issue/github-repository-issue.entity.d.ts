import { ID, IOrganizationGithubRepository, IOrganizationGithubRepositoryIssue } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '@gauzy/core';
export declare class OrganizationGithubRepositoryIssue extends TenantOrganizationBaseEntity implements IOrganizationGithubRepositoryIssue {
    issueId: number;
    issueNumber: number;
    /**
     * Organization Github Repository
     */
    repository?: IOrganizationGithubRepository;
    repositoryId?: ID;
}
