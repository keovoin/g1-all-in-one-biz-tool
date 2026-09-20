import { HttpClient } from '@angular/common/http';
import { IJobSearchOccupation, IPagination } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class JobSearchOccupationService {
    private http;
    constructor(http: HttpClient);
    getAll(request?: any): Promise<IPagination<IJobSearchOccupation>>;
    create(request?: IJobSearchOccupation): Promise<IJobSearchOccupation>;
    static ɵfac: i0.ɵɵFactoryDeclaration<JobSearchOccupationService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<JobSearchOccupationService>;
}
