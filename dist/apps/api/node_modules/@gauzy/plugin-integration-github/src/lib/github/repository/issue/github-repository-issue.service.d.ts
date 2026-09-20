import { TenantAwareCrudService } from '@gauzy/core';
import { OrganizationGithubRepositoryIssue } from './github-repository-issue.entity';
import { MikroOrmOrganizationGithubRepositoryIssueRepository } from './repository/mikro-orm-github-repository-issue.repository';
import { TypeOrmOrganizationGithubRepositoryIssueRepository } from './repository/type-orm-github-repository-issue.repository';
export declare class GithubRepositoryIssueService extends TenantAwareCrudService<OrganizationGithubRepositoryIssue> {
    constructor(typeOrmOrganizationGithubRepositoryIssueRepository: TypeOrmOrganizationGithubRepositoryIssueRepository, mikroOrmOrganizationGithubRepositoryIssueRepository: MikroOrmOrganizationGithubRepositoryIssueRepository);
}
