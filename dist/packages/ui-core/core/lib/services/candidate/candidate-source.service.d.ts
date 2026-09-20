import { HttpClient } from '@angular/common/http';
import { ICandidateSourceFindInput, ICandidateSource, ICandidateSourceCreateInput, IPagination } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class CandidateSourceService {
    private readonly http;
    constructor(http: HttpClient);
    getAll(where?: ICandidateSourceFindInput): Promise<IPagination<ICandidateSource>>;
    create(input: ICandidateSourceCreateInput): Promise<ICandidateSource>;
    static ɵfac: i0.ɵɵFactoryDeclaration<CandidateSourceService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<CandidateSourceService>;
}
