import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IKeyResult } from '@gauzy/contracts';
import { Observable } from 'rxjs';
import { ToastrService } from '../notification';
import * as i0 from "@angular/core";
interface IKeyResultResponse {
    items: IKeyResult[];
    count: number;
}
export declare class KeyResultService {
    private _http;
    private toastrService;
    private readonly API_URL;
    constructor(_http: HttpClient, toastrService: ToastrService);
    createKeyResult(keyResult: any): Promise<IKeyResult>;
    createBulkKeyResult(keyResults: any): Promise<IKeyResult[]>;
    update(id: string, keyResult: IKeyResult): Promise<IKeyResult>;
    findKeyResult(id: string): Promise<IKeyResultResponse>;
    getAllKeyResults(keyResult: any): Observable<IKeyResultResponse>;
    delete(id: string): Promise<any>;
    errorHandler(error: HttpErrorResponse): Observable<never>;
    static ɵfac: i0.ɵɵFactoryDeclaration<KeyResultService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<KeyResultService>;
}
export {};
