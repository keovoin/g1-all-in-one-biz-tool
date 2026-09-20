import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, switchMap } from 'rxjs';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class ZapierService {
    constructor(http) {
        this.http = http;
    }
    /**
     * Get OAuth configuration
     */
    getOAuthConfig() {
        return this.http.get(`${API_PREFIX}/integration/zapier/oauth/config`);
    }
    /**
     * Get Zapier integration settings
     */
    getSettings() {
        return this.http.get(`${API_PREFIX}/integration/zapier/settings`);
    }
    /**
     * Get Zapier access token for a given integration
     */
    getZapierToken(integrationId) {
        return this.http.get(`${API_PREFIX}/integration/zapier/token/${integrationId}`);
    }
    /**
     * Extract and return the OAuth access token from integration settings
     * Handles different token storage formats (JSON string, object, or direct string)
     */
    getAccessToken(integrationId) {
        return this.getZapierToken(integrationId).pipe(switchMap((integrationSetting) => {
            if (!integrationSetting || !integrationSetting.settingsValue) {
                throw new Error('Integration setting found but access token value is missing');
            }
            let accessToken;
            try {
                const tokenData = typeof integrationSetting.settingsValue === 'string'
                    ? JSON.parse(integrationSetting.settingsValue)
                    : integrationSetting.settingsValue;
                accessToken = tokenData.access_token || tokenData;
            }
            catch (parseError) {
                accessToken = integrationSetting.settingsValue;
            }
            if (!accessToken) {
                throw new Error('Access token is empty or invalid');
            }
            return of(accessToken);
        }));
    }
    /**
     * Update Zapier integration settings
     */
    updateSettings(settings) {
        return this.http.put(`${API_PREFIX}/integration/zapier/settings`, settings);
    }
    /**
     * Initialize a new Zapier integration.
     * No client credentials needed — server uses its own env-configured credentials.
     */
    initializeIntegration(body) {
        return this.http.post(`${API_PREFIX}/integration/zapier/settings`, body);
    }
    /**
     * Get available Zapier triggers
     */
    getTriggers(token) {
        return this.http.get(`${API_PREFIX}/integration/zapier/triggers`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
    /**
     * Get available Zapier actions
     */
    getActions(token) {
        return this.http.get(`${API_PREFIX}/integration/zapier/actions`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
    /**
     * Get Zaps for the authenticated Zapier account
     */
    getZaps(token) {
        return this.http.get(`${API_PREFIX}/integration/zapier/zaps`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
    /**
     * Create a new Zap on the authenticated Zapier account
     */
    createZap(body, token) {
        return this.http.post(`${API_PREFIX}/integration/zapier/zaps`, body, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
    /**
     * Get publicly available Zap templates.
     * Zap templates do not require an OAuth access token — the server attaches
     * the configured `client_id` on the way out to Zapier.
     */
    getZapTemplates(limit) {
        const params = {};
        if (limit !== undefined) {
            params['limit'] = String(limit);
        }
        return this.http.get(`${API_PREFIX}/integration/zapier/zap-templates`, {
            params
        });
    }
    /**
     * Exchange authorization code for tokens
     */
    exchangeCodeForToken(body) {
        return this.http.post(`${API_PREFIX}/integration/zapier/oauth/token`, body);
    }
    /**
     * Refresh access token
     */
    refreshAccessToken(body) {
        return this.http.post(`${API_PREFIX}/integration/zapier/oauth/refresh-token`, body);
    }
    /**
     * Initiate OAuth2 authorization with Zapier
     */
    authorize(state) {
        return this.http.get(`${API_PREFIX}/integration/zapier/oauth/authorize`, {
            params: { state }
        });
    }
    /**
     * Get all webhooks
     */
    getWebhooks(token) {
        return this.http.get(`${API_PREFIX}/integration/zapier/webhooks`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
    /**
     * Create a new Zapier webhook subscription
     */
    createWebhook(body, token) {
        return this.http.post(`${API_PREFIX}/integration/zapier/webhooks`, body, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
    /**
     * Delete an existing Zapier webhook subscription
     */
    deleteWebhook(id, token) {
        return this.http.delete(`${API_PREFIX}/integration/zapier/webhooks/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ZapierService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ZapierService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ZapierService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=zapier.service.js.map