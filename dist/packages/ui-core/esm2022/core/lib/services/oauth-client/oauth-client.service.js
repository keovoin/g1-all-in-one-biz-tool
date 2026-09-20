/**
 * HTTP client for the multi-app OAuth client registry.
 *
 * Backs the admin CRUD page at `/pages/settings/oauth-clients`. Wraps the
 * NestJS controller mounted at `/oauth/clients` (see
 * `packages/core/src/lib/auth/oauth-client/oauth-client.controller.ts`).
 *
 * The `create` and `rotateSecret` endpoints return the plaintext client
 * secret EXACTLY ONCE via `IOAuthClientWithSecret` — the caller must
 * surface it to the admin immediately (we show it in a one-time reveal
 * dialog) because it is never retrievable afterwards.
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class OAuthClientManagementService {
    constructor(http) {
        this.http = http;
        this.baseUrl = `${API_PREFIX}/oauth/clients`;
    }
    /** Paginated list of OAuth clients visible to the current user. */
    list(params = {}) {
        let httpParams = new HttpParams();
        if (typeof params.skip === 'number')
            httpParams = httpParams.set('skip', String(params.skip));
        if (typeof params.take === 'number')
            httpParams = httpParams.set('take', String(params.take));
        return this.http.get(this.baseUrl, { params: httpParams });
    }
    /** Read a single client by internal uuid. */
    getById(id) {
        return this.http.get(`${this.baseUrl}/${id}`);
    }
    /**
     * Register a new OAuth client.
     * Returns the plaintext client secret ONCE — surface it immediately.
     */
    create(input) {
        return this.http.post(this.baseUrl, input);
    }
    /** Update mutable fields (name, redirectUris, scopes, etc.). */
    update(id, input) {
        return this.http.patch(`${this.baseUrl}/${id}`, input);
    }
    /**
     * Rotate the client secret. Old access tokens keep working until they
     * expire; only NEW `/token` exchanges must use the rotated secret.
     * Returns the plaintext secret ONCE.
     */
    rotateSecret(id) {
        return this.http.post(`${this.baseUrl}/${id}/rotate-secret`, {});
    }
    /** Soft-delete (revoke). After this, `findByClientId` refuses to resolve the row. */
    delete(id) {
        return this.http.delete(`${this.baseUrl}/${id}`);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OAuthClientManagementService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OAuthClientManagementService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OAuthClientManagementService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=oauth-client.service.js.map