import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IIntegrationEntitySetting, IIntegrationTenant, IPagination } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class IntegrationEntitySettingService {
    private readonly _http;
    constructor(_http: HttpClient);
    /**
     * Retrieve entity settings for a given integration.
     * @param integrationId - The ID of the integration.
     * @returns An observable of entity settings.
     */
    getEntitySettings(integrationId: IIntegrationTenant['id']): Observable<IPagination<IIntegrationEntitySetting>>;
    /**
     * Update entity settings for a given integration.
     * @param integrationId - The ID of the integration.
     * @param settings - The entity settings to update.
     * @returns An observable of updated entity settings.
     */
    updateEntitySettings(integrationId: IIntegrationTenant['id'], settings: IIntegrationEntitySetting | IIntegrationEntitySetting[]): Observable<IIntegrationEntitySetting[]>;
    static ɵfac: i0.ɵɵFactoryDeclaration<IntegrationEntitySettingService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<IntegrationEntitySettingService>;
}
