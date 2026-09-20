import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IKeyResultUpdate } from '@gauzy/contracts';
import { ToastrService } from '../notification';
import * as i0 from "@angular/core";
export declare class KeyResultUpdateService {
    private _http;
    private toastrService;
    private readonly API_URL;
    constructor(_http: HttpClient, toastrService: ToastrService);
    createUpdate(keyResultUpdate: any): Promise<IKeyResultUpdate>;
    deleteBulkByKeyResultId(id: string): Promise<any>;
    errorHandler(error: HttpErrorResponse): import("rxjs").Observable<never>;
    static ɵfac: i0.ɵɵFactoryDeclaration<KeyResultUpdateService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<KeyResultUpdateService>;
}
