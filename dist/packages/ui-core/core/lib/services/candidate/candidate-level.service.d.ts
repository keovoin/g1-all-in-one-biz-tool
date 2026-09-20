import { HttpClient } from '@angular/common/http';
import { ICandidateLevelInput } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class CandidateLevelService {
    private http;
    constructor(http: HttpClient);
    getAll(orgId: string): import("rxjs").Observable<Object>;
    create(candidateLevel: ICandidateLevelInput): import("rxjs").Observable<Object>;
    delete(id: string): import("rxjs").Observable<Object>;
    update(id: string, candidateLevel: ICandidateLevelInput): import("rxjs").Observable<Object>;
    static ɵfac: i0.ɵɵFactoryDeclaration<CandidateLevelService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<CandidateLevelService>;
}
