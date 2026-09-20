import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class UpworkService {
    constructor(http) {
        this.http = http;
    }
    uploadTransaction(formData) {
        return this.http.post(`${API_PREFIX}/integrations/upwork/transactions`, formData);
    }
    getAccessTokenSecretPair(config, organizationId) {
        return this.http.post(`${API_PREFIX}/integrations/upwork/token-secret-pair/${organizationId}`, config);
    }
    getAccessToken(accessTokenDto, organizationId) {
        return this.http.post(`${API_PREFIX}/integrations/upwork/access-token/${organizationId}`, accessTokenDto);
    }
    /**
     * Lists the freelancer contracts of an Upwork integration.
     *
     * Only the integration and organization travel: the API resolves the Upwork credentials itself,
     * so they no longer sit in a request URL or in this app's memory (GHSA-3rqg-gpm9-gx84).
     *
     * @param dto - The integration and organization to read the contracts for.
     * @returns The freelancer's Upwork engagements.
     */
    getContracts({ integrationId, organizationId }) {
        // Serialize an explicit allowlist, so no stray field of the caller's object reaches the URL.
        const data = JSON.stringify({ integrationId, organizationId });
        return this.http.get(`${API_PREFIX}/integrations/upwork/freelancer-contracts`, {
            params: { data }
        });
    }
    /**
     * Reads the non-secret configuration state of an Upwork integration.
     *
     * @param dto - The integration id and the serialized query filter.
     * @returns Whether the integration is connected and usable. Never credential material.
     */
    getConfig(dto) {
        const { integrationId, data } = dto;
        return this.http.get(`${API_PREFIX}/integrations/upwork/config/${integrationId}`, {
            params: { data }
        });
    }
    /**
     * Syncs Upwork contracts into projects of an organization.
     *
     * @param dto - The integration, organization and contracts to sync.
     * @returns The integration maps produced by the sync.
     */
    syncContracts({ integrationId, organizationId, contracts }) {
        return this.http.post(`${API_PREFIX}/integrations/upwork/sync-contracts`, {
            integrationId,
            organizationId,
            contracts
        });
    }
    /**
     * Syncs the data hanging off a set of Upwork contracts.
     *
     * @param dto - The integration, organization, contracts and entities to sync. Carries no
     *              credentials (GHSA-3rqg-gpm9-gx84).
     * @returns The integration maps produced by the sync.
     */
    syncContractsRelatedData({ integrationId, organizationId, contracts, entitiesToSync, employeeId, providerId, providerReferenceId }) {
        // Post an explicit allowlist, so no stray field of the caller's object reaches the API.
        return this.http.post(`${API_PREFIX}/integrations/upwork/sync-contracts-related-data`, {
            integrationId,
            organizationId,
            contracts,
            entitiesToSync,
            employeeId,
            providerId,
            providerReferenceId
        });
    }
    getAllReports(dto) {
        const { integrationId, data } = dto;
        return this.http.get(`${API_PREFIX}/integrations/upwork/report/${integrationId}`, { params: { data } });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UpworkService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UpworkService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UpworkService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=upwork.service.js.map