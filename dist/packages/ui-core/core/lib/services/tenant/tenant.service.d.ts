import { HttpClient } from '@angular/common/http';
import { ITenant, ITenantCreateInput, ITenantSetting } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class TenantService {
    private readonly http;
    constructor(http: HttpClient);
    API_URL: string;
    SETTING_API_URL: string;
    /**
     * Creates a new tenant using the provided input.
     *
     * @param {ITenantCreateInput} input - The input data required to create a new tenant.
     * @returns {Promise<ITenant>} - A promise that resolves to the created tenant.
     */
    create(input: ITenantCreateInput): Promise<ITenant>;
    /**
     * Retrieves the settings for the current tenant.
     *
     * @returns {Promise<ITenantSetting>} - A promise that resolves to the tenant settings.
     */
    getSettings(): Promise<ITenantSetting>;
    /**
     * Saves the provided tenant settings for the current tenant.
     * Used for file storage settings that require fileStorageProvider.
     *
     * @param {ITenantSetting} request - The tenant settings to be saved.
     * @returns {Promise<ITenantSetting>} - A promise that resolves to the saved tenant settings.
     */
    saveSettings(request: ITenantSetting): Promise<ITenantSetting>;
    /**
     * Saves dynamic tenant settings (any key-value pairs).
     * Used for monitoring settings (PostHog, Sentry) and other dynamic configurations.
     *
     * @param {ITenantSetting} request - The dynamic settings to be saved.
     * @returns {Promise<ITenantSetting>} - A promise that resolves to the saved settings.
     */
    saveDynamicSettings(request: ITenantSetting): Promise<ITenantSetting>;
    /**
     * Retrieves global settings (tenantId = NULL).
     *
     * @returns {Promise<Record<string, string>>} - A promise that resolves to the global settings.
     */
    getGlobalSettings(): Promise<Record<string, string>>;
    /**
     * Saves global settings (tenantId = NULL).
     *
     * @param {ITenantSetting} request - The global settings to be saved.
     * @returns {Promise<ITenantSetting>} - A promise that resolves to the saved global settings.
     */
    saveGlobalSettings(request: ITenantSetting): Promise<ITenantSetting>;
    static ɵfac: i0.ɵɵFactoryDeclaration<TenantService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TenantService>;
}
