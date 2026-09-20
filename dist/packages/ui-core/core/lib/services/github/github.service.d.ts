import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBasePerTenantAndOrganizationEntityModel, IGithubAppInstallInput, IGithubIssue, IGithubIssueFindInput, IGithubRepositoryResponse, IIntegrationMapSyncRepository, IIntegrationTenant, IOrganization, IOrganizationGithubRepository, IOrganizationGithubRepositoryUpdateInput, IOrganizationProject } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class GithubService {
    private readonly _http;
    constructor(_http: HttpClient);
    /**
     * Mint a single-use, tenant-bound state nonce before starting a GitHub App installation.
     *
     * The returned `state` is passed to GitHub and echoed back on the post-install callback so the
     * resulting installation is bound to the initiating tenant/organization, preventing cross-tenant
     * installation hijacking (GHSA-4rwq-65wh-45h4).
     *
     * @param input The tenant/organization initiating the installation.
     * @returns A promise resolving to the opaque `state` nonce.
     */
    createInstallState(input: IBasePerTenantAndOrganizationEntityModel): Promise<{
        state: string;
    }>;
    /**
     * Add a GitHub app installation.
     * @param input The input data for the GitHub app installation. `input.state` (the single-use nonce
     * from {@link createInstallState}) is REQUIRED — the server binds the installation to the tenant
     * recorded against that nonce and rejects requests without a valid one (GHSA-4rwq-65wh-45h4).
     * @returns A promise that resolves to the integration tenant object.
     */
    addInstallationApp(input: IGithubAppInstallInput): Promise<IIntegrationTenant>;
    /**
     * Get GitHub repositories for a specific integration.
     *
     * @param {string} integrationId - The ID of the integration.
     * @param {IBasePerTenantAndOrganizationEntityModel} query - Query parameters for the request.
     * @returns {Observable<IGithubRepositoryResponse>} An observable that emits GitHub repositories.
     */
    getRepositories(integrationId: IIntegrationTenant['id'], query: IBasePerTenantAndOrganizationEntityModel): Observable<IGithubRepositoryResponse>;
    /**
     * Get GitHub repository issues for a specific integration, owner, and repository.
     *
     * @param {string} integrationId - The ID of the integration.
     * @param {string} owner - The owner (username or organization) of the repository.
     * @param {string} repo - The name of the repository.
     * @param {IBasePerTenantAndOrganizationEntityModel} query - Query parameters for the request.
     * @returns {Observable<IGithubIssue[]>} An observable that emits GitHub issues.
     */
    getRepositoryIssues(integrationId: IIntegrationTenant['id'], owner: string, repo: string, query: IGithubIssueFindInput): Observable<IGithubIssue[]>;
    /**
     * Synchronize a GitHub repository.
     * @param input The synchronization input data.
     * @returns An Observable of the synchronized IntegrationMap.
     */
    syncGithubRepository(input: IIntegrationMapSyncRepository): Observable<IOrganizationGithubRepository>;
    /**
     * Update a GitHub repository's information.
     *
     * @param id - A string representing the unique identifier of the GitHub repository to be updated.
     * @param input - An object containing the data to update the GitHub repository.
     * @returns An Observable that emits the updated GitHub repository data.
     */
    updateGithubRepository(id: string, input: IOrganizationGithubRepositoryUpdateInput): Observable<IOrganizationGithubRepository>;
    /**
     * Auto-synchronize GitHub issues for a specific repository.
     *
     * @param integrationId - The ID of the integration tenant.
     * @param repository - The GitHub repository to auto-sync issues for.
     * @param options - Additional options for synchronization, including organization, tenant, and an optional project.
     * @returns An Observable representing the result of the auto-synchronization.
     */
    autoSyncIssues(integrationId: IIntegrationTenant['id'], repository: IOrganizationGithubRepository, options: {
        organizationId: IOrganization['id'];
        tenantId: IOrganization['tenantId'];
        projectId?: IOrganizationProject['id'];
    }): Observable<any>;
    /**
     * Sync GitHub issues and labels for a given organization and integration.
     *
     * @param integrationId - The ID of the integration.
     * @param options - An object containing organizationId, tenantId, and issues.
     * @returns An observable that represents the HTTP POST request to sync issues and labels.
     */
    manualSyncIssues(integrationId: IIntegrationTenant['id'], repository: IOrganizationGithubRepository, options: {
        organizationId: IOrganization['id'];
        tenantId: IOrganization['tenantId'];
        issues: IGithubIssue[];
        projectId?: IOrganizationProject['id'];
    }): Observable<any>;
    /**
     * Maps a GitHub repository's data to a custom payload object.
     *
     * @param data - The GitHub repository data to map.
     * @returns A custom payload object with selected properties.
     */
    private _mapRepositoryPayload;
    /**
     * Map GitHub issue payload data to the required format.
     *
     * @param data - An array of GitHub issues.
     * @returns An array of mapped issue payload data.
     */
    private _mapIssuePayload;
    static ɵfac: i0.ɵɵFactoryDeclaration<GithubService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<GithubService>;
}
