import { HttpClient } from '@angular/common/http';
import { ICandidateExperience, IExperienceCreateInput, IExperienceFindInput, IPagination } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class CandidateExperienceService {
    private http;
    constructor(http: HttpClient);
    create(createInput: IExperienceCreateInput): Promise<ICandidateExperience>;
    getAll(where?: IExperienceFindInput, relations?: string[]): Promise<IPagination<ICandidateExperience>>;
    update(id: string, updateInput: any): Promise<any>;
    delete(id: string): Promise<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<CandidateExperienceService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<CandidateExperienceService>;
}
