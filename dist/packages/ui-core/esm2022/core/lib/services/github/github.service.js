import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { toParams } from '@gauzy/ui-core/common';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class GithubService {
    constructor(_http) {
        this._http = _http;
    }
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
    async createInstallState(input) {
        const url = `${API_PREFIX}/integration/github/install/state`;
        return firstValueFrom(this._http.post(url, input));
    }
    /**
     * Add a GitHub app installation.
     * @param input The input data for the GitHub app installation. `input.state` (the single-use nonce
     * from {@link createInstallState}) is REQUIRED — the server binds the installation to the tenant
     * recorded against that nonce and rejects requests without a valid one (GHSA-4rwq-65wh-45h4).
     * @returns A promise that resolves to the integration tenant object.
     */
    async addInstallationApp(input) {
        const url = `${API_PREFIX}/integration/github/install`;
        return firstValueFrom(this._http.post(url, input));
    }
    /**
     * Get GitHub repositories for a specific integration.
     *
     * @param {string} integrationId - The ID of the integration.
     * @param {IBasePerTenantAndOrganizationEntityModel} query - Query parameters for the request.
     * @returns {Observable<IGithubRepositoryResponse>} An observable that emits GitHub repositories.
     */
    getRepositories(integrationId, query) {
        const url = `${API_PREFIX}/integration/github/${integrationId}/repositories`;
        const params = toParams(query);
        return this._http.get(url, { params });
    }
    /**
     * Get GitHub repository issues for a specific integration, owner, and repository.
     *
     * @param {string} integrationId - The ID of the integration.
     * @param {string} owner - The owner (username or organization) of the repository.
     * @param {string} repo - The name of the repository.
     * @param {IBasePerTenantAndOrganizationEntityModel} query - Query parameters for the request.
     * @returns {Observable<IGithubIssue[]>} An observable that emits GitHub issues.
     */
    getRepositoryIssues(integrationId, owner, repo, query) {
        const url = `${API_PREFIX}/integration/github/${integrationId}/${owner}/${repo}/issues`;
        const params = toParams(query);
        return this._http.get(url, { params });
    }
    /**
     * Synchronize a GitHub repository.
     * @param input The synchronization input data.
     * @returns An Observable of the synchronized IntegrationMap.
     */
    syncGithubRepository(input) {
        const url = `${API_PREFIX}/integration/github/repository/sync`;
        return this._http.post(url, input);
    }
    /**
     * Update a GitHub repository's information.
     *
     * @param id - A string representing the unique identifier of the GitHub repository to be updated.
     * @param input - An object containing the data to update the GitHub repository.
     * @returns An Observable that emits the updated GitHub repository data.
     */
    updateGithubRepository(id, input) {
        // Construct the URL for the API endpoint.
        const url = `${API_PREFIX}/integration/github/repository/${id}`;
        // Send an HTTP PUT request to update the GitHub repository using the provided input.
        return this._http.put(url, input);
    }
    /**
     * Auto-synchronize GitHub issues for a specific repository.
     *
     * @param integrationId - The ID of the integration tenant.
     * @param repository - The GitHub repository to auto-sync issues for.
     * @param options - Additional options for synchronization, including organization, tenant, and an optional project.
     * @returns An Observable representing the result of the auto-synchronization.
     */
    autoSyncIssues(integrationId, repository, options) {
        return this._http.post(`${API_PREFIX}/integration/github/${integrationId}/auto-sync/issues`, {
            integrationId,
            repository,
            projectId: options.projectId,
            organizationId: options.organizationId,
            tenantId: options.tenantId
        });
    }
    /**
     * Sync GitHub issues and labels for a given organization and integration.
     *
     * @param integrationId - The ID of the integration.
     * @param options - An object containing organizationId, tenantId, and issues.
     * @returns An observable that represents the HTTP POST request to sync issues and labels.
     */
    manualSyncIssues(integrationId, repository, options) {
        return this._http.post(`${API_PREFIX}/integration/github/${integrationId}/manual-sync/issues`, {
            integrationId,
            repository,
            issues: this._mapIssuePayload(options.issues),
            projectId: options.projectId,
            organizationId: options.organizationId,
            tenantId: options.tenantId
        });
    }
    /**
     * Maps a GitHub repository's data to a custom payload object.
     *
     * @param data - The GitHub repository data to map.
     * @returns A custom payload object with selected properties.
     */
    _mapRepositoryPayload(data) {
        const { id, name, full_name, owner, visibility, open_issues_count } = data;
        return {
            id,
            name,
            full_name,
            owner: {
                login: owner.login
            },
            visibility,
            open_issues_count,
            private: data.private
        };
    }
    /**
     * Map GitHub issue payload data to the required format.
     *
     * @param data - An array of GitHub issues.
     * @returns An array of mapped issue payload data.
     */
    _mapIssuePayload(data) {
        return data.map(({ id, number, title, state, body, labels = [] }) => ({
            id,
            number,
            title,
            state,
            body,
            labels
        }));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GithubService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GithubService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GithubService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=github.service.js.map