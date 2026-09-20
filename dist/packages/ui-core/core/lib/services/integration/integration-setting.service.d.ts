import { HttpClient } from '@angular/common/http';
import { IIntegrationSetting } from '@gauzy/contracts';
import { CrudService } from '../crud/crud.service';
import * as i0 from "@angular/core";
export declare class IntegrationSettingService extends CrudService<IIntegrationSetting> {
    readonly _http: HttpClient;
    static readonly API_URL = "/api/integration-setting";
    constructor(_http: HttpClient);
    static ɵfac: i0.ɵɵFactoryDeclaration<IntegrationSettingService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<IntegrationSettingService>;
}
