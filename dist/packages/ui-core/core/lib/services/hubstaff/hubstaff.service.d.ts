import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IIntegrationTenant, IIntegrationSetting, IHubstaffOrganization, IHubstaffProject, IIntegrationEntitySetting, IDateRangeActivityFilter, IEntitySettingToSync } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class HubstaffService {
    private readonly _http;
    private ACCESS_TOKEN;
    private _entitiesToSync$;
    private _dateRangeActivity$;
    entitiesToSync$: Observable<IEntitySettingToSync>;
    dateRangeActivity$: Observable<IDateRangeActivityFilter>;
    integrationId: string;
    constructor(_http: HttpClient);
    getIntegration(integrationId: any): Observable<IIntegrationEntitySetting[]>;
    resetSettings(): void;
    private _setSettingsValue;
    updateSettings(integrationId: any): Observable<IIntegrationEntitySetting[]>;
    getToken(integrationId: string): Observable<IIntegrationSetting>;
    refreshToken(): Observable<any>;
    /**
     * Authorize a client for Hubstaff integration.
     *
     * @param client_id The client ID for the Hubstaff integration.
     */
    authorizeClient(client_id: string): void;
    /**
     * Add a new integration for Hubstaff.
     *
     * @param param0 - The integration parameters including code, client_secret, client_id, and organizationId.
     * @returns An Observable of the created integration tenant.
     */
    addIntegration({ code, client_secret, client_id, organizationId }: {
        code: any;
        client_secret: any;
        client_id: any;
        organizationId: any;
    }): Observable<IIntegrationTenant>;
    /**
     *
     * @param integrationId
     * @returns
     */
    getOrganizations(integrationId: string): Observable<IHubstaffOrganization[]>;
    /**
     *
     * @param organizationId
     * @param integrationId
     * @returns
     */
    getProjects(hubstaffOrganizationId: string, integrationId: string): Observable<IHubstaffProject[]>;
    /**
     *
     * @param projects
     * @param integrationId
     * @param organizationId
     * @returns
     */
    syncProjects(projects: any, integrationId: string, organizationId: string): Observable<Object>;
    setActivityDateRange({ start, end }: {
        start: any;
        end: any;
    }): void;
    private _setEndDate;
    autoSync({ integrationId, hubstaffOrganizations, organizationId }: {
        integrationId: any;
        hubstaffOrganizations: any;
        organizationId: any;
    }): Observable<unknown>;
    private _forkEntities;
    /**
     *
     * @param data
     * @returns
     */
    private _mapProjectPayload;
    /**
     *
     * @param data
     * @returns
     */
    private _mapOrganizationPayload;
    static ɵfac: i0.ɵɵFactoryDeclaration<HubstaffService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<HubstaffService>;
}
