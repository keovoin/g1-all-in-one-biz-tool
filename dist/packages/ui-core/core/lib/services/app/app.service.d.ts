import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAppConfig } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class AppService {
    private readonly _http;
    constructor(_http: HttpClient);
    /**
     * Service method to retrieve application configurations.
     *
     * This method makes an HTTP GET request to the '/configs' endpoint and returns an Observable of type IAppSetting.
     *
     * @returns {Observable<IAppSetting>} Observable containing application configurations.
     */
    getAppConfigs(): Observable<IAppConfig>;
    static ɵfac: i0.ɵɵFactoryDeclaration<AppService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AppService>;
}
