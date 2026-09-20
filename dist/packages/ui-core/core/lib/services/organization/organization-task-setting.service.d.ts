import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IOrganizationTaskSetting, IOrganizationTaskSettingFindInput } from '@gauzy/contracts';
import { CrudService } from '../crud/crud.service';
import * as i0 from "@angular/core";
export declare class OrganizationTaskSettingService extends CrudService<IOrganizationTaskSetting> {
    private static readonly API_URL;
    constructor(http: HttpClient);
    /**
     * Retrieves organization task settings based on provided parameters.
     * @param params The parameters used to find the organization task setting.
     * @returns An Observable that emits the organization task setting.
     */
    getByOrganization(params: IOrganizationTaskSettingFindInput): Observable<IOrganizationTaskSetting>;
    static ɵfac: i0.ɵɵFactoryDeclaration<OrganizationTaskSettingService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<OrganizationTaskSettingService>;
}
