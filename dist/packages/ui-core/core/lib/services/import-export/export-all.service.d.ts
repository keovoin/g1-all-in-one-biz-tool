import { HttpClient } from '@angular/common/http';
import * as i0 from "@angular/core";
export declare class ExportAllService {
    private readonly http;
    constructor(http: HttpClient);
    downloadAllData(): import("rxjs").Observable<Blob>;
    downloadExportTemplates(): import("rxjs").Observable<Blob>;
    downloadSpecificTable(names: string[]): import("rxjs").Observable<Blob>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ExportAllService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ExportAllService>;
}
