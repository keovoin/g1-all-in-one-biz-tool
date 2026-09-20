import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@gauzy/ui-config';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
/**
 * AiChatSettingsService
 *
 * Thin HttpClient wrapper around the `@gauzy/plugin-ai-chat` backend endpoints
 * used by the per-tenant "AI Providers" (BYOK) settings page:
 *
 * - `GET    /api/ai-chat/config`           — registered providers + configuration status
 * - `GET    /api/ai-chat/credentials`      — tenant credentials (API keys masked)
 * - `POST   /api/ai-chat/credentials`      — upsert per (tenant, provider)
 * - `PUT    /api/ai-chat/credentials/:id`  — update (omitted `apiKey` keeps the stored key)
 * - `DELETE /api/ai-chat/credentials/:id`  — delete
 *
 * Auth headers are attached by the app's HTTP interceptors — same convention
 * as the other plugin calls (see `provide-ai-chat-sidebar.ts`).
 */
export class AiChatSettingsService {
    constructor(http) {
        this.http = http;
        /** Base URL of the AI chat backend plugin API. */
        this.API_URL = `${environment.API_BASE_URL}/api/ai-chat`;
    }
    /**
     * Retrieves the AI chat runtime configuration for the current tenant:
     * registered providers, their models and configuration status.
     *
     * @returns An observable emitting the {@link IAiChatConfig}.
     */
    getConfig() {
        return this.http.get(`${this.API_URL}/config`);
    }
    /**
     * Retrieves one provider's model catalogue, fetched live from that provider where possible.
     *
     * Separate from {@link getConfig} on purpose: `/config` runs at app bootstrap for every user with
     * chat access and loops every registered provider, so folding keyed upstream calls into it would
     * put the app shell behind six third-party APIs on every login. This is called only when a single
     * provider's config view is opened.
     *
     * @param providerId - The provider whose models to list.
     * @returns An observable emitting the {@link IAiChatModelCatalogue}.
     */
    getProviderModels(providerId) {
        return this.http.get(`${this.API_URL}/providers/${encodeURIComponent(providerId)}/models`);
    }
    /**
     * Retrieves the current tenant's AI provider credentials.
     * API keys are always masked (e.g. `'••••abcd'`).
     *
     * @returns An observable emitting a paginated list of credentials.
     */
    getCredentials() {
        return this.http.get(`${this.API_URL}/credentials`);
    }
    /**
     * Creates or updates (upserts) the tenant's credential for a provider —
     * one credential per provider per tenant. The `apiKey` is required on
     * first create and is stored encrypted by the backend.
     *
     * @param input - The credential payload.
     * @returns An observable emitting the persisted credential (API key masked).
     */
    upsertCredential(input) {
        return this.http.post(`${this.API_URL}/credentials`, input);
    }
    /**
     * Completes a provider "Connect" flow (e.g. OpenRouter PKCE): sends the
     * authorization code + PKCE verifier to the backend, which exchanges
     * them for an API key server-side and stores it as the tenant credential.
     *
     * @param input - Provider id, authorization code and PKCE code verifier.
     * @returns An observable emitting the persisted credential (API key masked).
     */
    connectCredential(input) {
        return this.http.post(`${this.API_URL}/credentials/connect`, input);
    }
    /**
     * Updates an existing credential by its ID. An omitted `apiKey` keeps
     * the currently stored (encrypted) key.
     *
     * @param id - The credential UUID.
     * @param input - The fields to update.
     * @returns An observable emitting the updated credential (API key masked).
     */
    updateCredential(id, input) {
        return this.http.put(`${this.API_URL}/credentials/${id}`, input);
    }
    /**
     * Deletes a credential by its ID.
     *
     * @param id - The credential UUID.
     * @returns An observable that completes when the credential is deleted.
     */
    deleteCredential(id) {
        return this.http.delete(`${this.API_URL}/credentials/${id}`);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AiChatSettingsService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AiChatSettingsService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AiChatSettingsService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=ai-chat-settings.service.js.map