import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class TenantService {
    constructor(http) {
        this.http = http;
        this.API_URL = `${API_PREFIX}/tenant`;
        this.SETTING_API_URL = `${API_PREFIX}/tenant-setting`;
    }
    /**
     * Creates a new tenant using the provided input.
     *
     * @param {ITenantCreateInput} input - The input data required to create a new tenant.
     * @returns {Promise<ITenant>} - A promise that resolves to the created tenant.
     */
    create(input) {
        return firstValueFrom(this.http.post(`${this.API_URL}`, input));
    }
    /**
     * Retrieves the settings for the current tenant.
     *
     * @returns {Promise<ITenantSetting>} - A promise that resolves to the tenant settings.
     */
    getSettings() {
        return firstValueFrom(this.http.get(`${this.SETTING_API_URL}`));
    }
    /**
     * Saves the provided tenant settings for the current tenant.
     * Used for file storage settings that require fileStorageProvider.
     *
     * @param {ITenantSetting} request - The tenant settings to be saved.
     * @returns {Promise<ITenantSetting>} - A promise that resolves to the saved tenant settings.
     */
    saveSettings(request) {
        return firstValueFrom(this.http.post(`${this.SETTING_API_URL}`, request));
    }
    /**
     * Saves dynamic tenant settings (any key-value pairs).
     * Used for monitoring settings (PostHog, Sentry) and other dynamic configurations.
     *
     * @param {ITenantSetting} request - The dynamic settings to be saved.
     * @returns {Promise<ITenantSetting>} - A promise that resolves to the saved settings.
     */
    saveDynamicSettings(request) {
        return firstValueFrom(this.http.post(`${this.SETTING_API_URL}/dynamic`, request));
    }
    /**
     * Retrieves global settings (tenantId = NULL).
     *
     * @returns {Promise<Record<string, string>>} - A promise that resolves to the global settings.
     */
    getGlobalSettings() {
        return firstValueFrom(this.http.get(`${this.SETTING_API_URL}/global`));
    }
    /**
     * Saves global settings (tenantId = NULL).
     *
     * @param {ITenantSetting} request - The global settings to be saved.
     * @returns {Promise<ITenantSetting>} - A promise that resolves to the saved global settings.
     */
    saveGlobalSettings(request) {
        return firstValueFrom(this.http.post(`${this.SETTING_API_URL}/global`, request));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TenantService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TenantService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TenantService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=tenant.service.js.map