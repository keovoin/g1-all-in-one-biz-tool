import { HttpClient } from '@angular/common/http';
import { IOrganizationCreateInput, ITenantCreateInput, IUserRegistrationInput } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class GauzyCloudService {
    private readonly _http;
    constructor(_http: HttpClient);
    migrateIntoCloud(payload: IUserRegistrationInput): import("rxjs").Observable<Object>;
    migrateTenant(payload: ITenantCreateInput, token: string): import("rxjs").Observable<Object>;
    migrateOrganization(payload: IOrganizationCreateInput, token: string): import("rxjs").Observable<Object>;
    static ɵfac: i0.ɵɵFactoryDeclaration<GauzyCloudService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<GauzyCloudService>;
}
