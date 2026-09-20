import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ID } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export interface IPlaneSetupResponse {
    integrationTenantId: ID;
    apiKey: string;
    apiSecret: string;
}
export interface IPlaneSettingsResponse {
    integrationTenantId: ID;
    mode: 'shared' | 'custom';
    planeWebUrl: string;
    planeAdminUrl: string;
    planeSpaceUrl: string;
    isEnabled: boolean;
    hasApiKey: boolean;
}
export interface IPlaneStatusResponse {
    isEnabled: boolean;
    integrationTenantId: ID | null;
}
export interface IPlaneUpdateResponse {
    integrationTenantId: ID;
    updated: boolean;
}
export interface IPlaneRegenerateKeyResponse {
    apiKey: string;
    apiSecret: string;
}
export declare class PlaneService {
    private readonly http;
    private readonly API_URL;
    constructor(http: HttpClient);
    /**
     * Configure Plane integration with URLs.
     */
    setup(dto: {
        mode?: 'shared' | 'custom';
        planeWebUrl?: string;
        planeAdminUrl?: string;
        planeSpaceUrl?: string;
    }, organizationId?: string): Observable<IPlaneSetupResponse>;
    /**
     * Get Plane integration settings (no API key exposed).
     */
    getSettings(organizationId?: string): Observable<IPlaneSettingsResponse>;
    /**
     * Update Plane integration URL settings.
     */
    updateSettings(dto: {
        planeWebUrl?: string;
        planeAdminUrl?: string;
        planeSpaceUrl?: string;
    }, organizationId?: string): Observable<IPlaneUpdateResponse>;
    /**
     * Remove Plane integration.
     */
    removeIntegration(integrationTenantId: ID): Observable<{
        success: boolean;
    }>;
    /**
     * Regenerate API key and secret.
     */
    regenerateApiKey(organizationId?: string): Observable<IPlaneRegenerateKeyResponse>;
    /**
     * Get integration status.
     */
    getStatus(): Observable<IPlaneStatusResponse>;
    static ɵfac: i0.ɵɵFactoryDeclaration<PlaneService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PlaneService>;
}
