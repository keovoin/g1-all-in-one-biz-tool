import { HttpClient } from '@angular/common/http';
import { IEducationCreateInput, ICandidateEducation, IEducationFindInput, IPagination } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class CandidateEducationsService {
    private readonly http;
    constructor(http: HttpClient);
    create(createInput: IEducationCreateInput): Promise<ICandidateEducation>;
    getAll(where?: IEducationFindInput): Promise<IPagination<ICandidateEducation>>;
    update(id: string, updateInput: any): Promise<any>;
    delete(id: string): Promise<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<CandidateEducationsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<CandidateEducationsService>;
}
