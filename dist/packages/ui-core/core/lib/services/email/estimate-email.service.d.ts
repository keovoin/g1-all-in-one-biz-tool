import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IEstimateEmailFindInput, IEstimateEmail } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class EstimateEmailService {
    private readonly http;
    constructor(http: HttpClient);
    validate(where: IEstimateEmailFindInput, relations?: string[]): Observable<IEstimateEmail>;
    static ɵfac: i0.ɵɵFactoryDeclaration<EstimateEmailService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<EstimateEmailService>;
}
