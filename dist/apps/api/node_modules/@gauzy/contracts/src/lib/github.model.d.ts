import { IIntegrationTenant, IRelationalIntegrationTenant } from './integration.model';
import { IBasePerTenantAndOrganizationEntityModel, ID } from './base-entity.model';
import { IRelationalOrganizationProject } from './organization-projects.model';
interface IGithubAppInstallInputCommon extends IBasePerTenantAndOrganizationEntityModel {
    provider?: string;
}
export interface IGithubAppInstallInput extends IGithubAppInstallInputCommon {
    installation_id?: string;
    setup_action?: string;
    state?: string;
}
export interface IOAuthAppInstallInput extends IGithubAppInstallInputCommon {
    code?: string;
}
export interface IGithubRepository {
    id: number;
    node_id: string;
    name: string;
    full_name: string;
    private: boolean;
    visibility: string;
    open_issues_count: number;
    owner?: {
        id: number;
        login: string;
        node_id: string;
    };
    [x: string]: any;
}
export interface IGithubIssueFindInput extends IBasePerTenantAndOrganizationEntityModel {
    page: number;
    per_page: number;
}
export interface IGithubIssue {
    id: number;
    node_id: string;
    number: number;
    title: string;
    state: string;
    body: string;
    labels: IGithubIssueLabel[];
    [x: string]: any;
}
export interface IGithubIssueLabel {
    id: number;
    node_id: string;
    url: string;
    name: string;
    color: string;
    default: boolean;
    description: string;
    [x: string]: any;
}
export interface IGithubIssueCreateOrUpdatePayload {
    repo: string;
    owner: string;
    issue_number?: number;
    title: string;
    body: string;
    labels: Partial<IGithubIssueLabel[]>;
}
export interface IGithubInstallation {
    id: number;
    node_id: string;
}
export interface IGithubRepositoryResponse {
    total_count: number;
    repository_selection: string;
    repositories: IGithubRepository[];
}
export declare enum GithubPropertyMapEnum {
    INSTALLATION_ID = "installation_id",
    SETUP_ACTION = "setup_action",
    ACCESS_TOKEN = "access_token",
    EXPIRES_IN = "expires_in",
    REFRESH_TOKEN = "refresh_token",
    REFRESH_TOKEN_EXPIRES_IN = "refresh_token_expires_in",
    TOKEN_TYPE = "token_type",
    SYNC_TAG = "sync_tag"
}
export interface IGithubSyncIssuePayload extends IBasePerTenantAndOrganizationEntityModel, IRelationalOrganizationProject {
    issues: IGithubIssue | IGithubIssue[];
    repository: IOrganizationGithubRepository;
}
/**
 * Represents a payload for GitHub issues, including organization and tenant information.
 */
export interface IGithubRepositoryPayload {
    repository: IGithubRepository;
}
/** */
export interface IGithubAutomationBase extends IGithubRepositoryPayload {
    integration: IIntegrationTenant;
}
export interface IGithubAutomationIssuePayload extends IGithubAutomationBase {
    issue: IGithubIssue;
}
export interface IGithubInstallationDeletedPayload extends Pick<IGithubAutomationBase, 'integration'> {
    installation: IGithubInstallation;
    repositories: IGithubRepository[];
}
export interface IOrganizationGithubRepository extends IBasePerTenantAndOrganizationEntityModel, IRelationalIntegrationTenant {
    repositoryId: number;
    name: string;
    fullName: string;
    owner: string;
    issuesCount: number;
    hasSyncEnabled: boolean;
    private: boolean;
    status: string;
}
export interface IOrganizationGithubRepositoryUpdateInput extends Partial<IOrganizationGithubRepository> {
}
export interface IOrganizationGithubRepositoryFindInput extends Partial<IOrganizationGithubRepository> {
}
export interface IOrganizationGithubRepositoryIssue extends IBasePerTenantAndOrganizationEntityModel {
    issueId: number;
    issueNumber: number;
    /** Issue Sync With Repository */
    repository?: IOrganizationGithubRepository;
    repositoryId?: ID;
}
export interface IIntegrationMapSyncRepository extends IBasePerTenantAndOrganizationEntityModel, IRelationalIntegrationTenant {
    repository: IGithubRepository;
}
export declare enum GithubRepositoryStatusEnum {
    SYNCING = "Syncing",
    SUCCESSFULLY = "Successfully",
    ERROR = "Error",
    DISABLED = "Disabled"
}
export {};
