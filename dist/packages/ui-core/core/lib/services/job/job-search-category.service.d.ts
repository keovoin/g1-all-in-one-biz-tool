import { HttpClient } from '@angular/common/http';
import { IJobSearchCategory, IPagination } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class JobSearchCategoryService {
    private readonly http;
    constructor(http: HttpClient);
    getAll(request?: any): Promise<IPagination<IJobSearchCategory>>;
    create(request?: IJobSearchCategory): Promise<IJobSearchCategory>;
    static ɵfac: i0.ɵɵFactoryDeclaration<JobSearchCategoryService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<JobSearchCategoryService>;
}
