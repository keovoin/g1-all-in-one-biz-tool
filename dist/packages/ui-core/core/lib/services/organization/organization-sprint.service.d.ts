import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITask, IOrganizationSprint, IGetSprintsOptions } from '@gauzy/contracts';
import { TranslateService } from '@ngx-translate/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { ToastrService } from '../notification';
import * as i0 from "@angular/core";
export declare class SprintService extends TranslationBaseComponent {
    readonly _http: HttpClient;
    readonly toastrService: ToastrService;
    private readonly API_URL;
    constructor(_http: HttpClient, toastrService: ToastrService, translateService: TranslateService);
    getAllSprints(findInput?: IGetSprintsOptions): Observable<any>;
    getById(id: string): Promise<ITask>;
    createSprint(sprint: IOrganizationSprint): Observable<IOrganizationSprint>;
    editSprint(sprintId: string, sprint: Partial<IOrganizationSprint>): Observable<IOrganizationSprint>;
    deleteSprint(id: string): Observable<void>;
    private errorHandler;
    static ɵfac: i0.ɵɵFactoryDeclaration<SprintService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<SprintService>;
}
