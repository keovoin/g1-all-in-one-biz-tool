import { HttpClient } from '@angular/common/http';
import { ICandidatePersonalQualities, ICandidatePersonalQualitiesCreateInput, ICandidatePersonalQualitiesFindInput } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class CandidatePersonalQualitiesService {
    private http;
    constructor(http: HttpClient);
    create(createInput: ICandidatePersonalQualitiesCreateInput): Promise<ICandidatePersonalQualities>;
    createBulk(interviewId: string, personalQualities: string[]): Promise<ICandidatePersonalQualities[]>;
    getAll(findInput?: ICandidatePersonalQualitiesFindInput): Promise<{
        items: any[];
        total: number;
    }>;
    findByInterviewId(interviewId: string): Promise<ICandidatePersonalQualities[]>;
    update(id: string, updateInput: any): Promise<any>;
    delete(id: string): Promise<any>;
    deleteBulkByInterviewId(id: string, personalQualities?: ICandidatePersonalQualities[]): Promise<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<CandidatePersonalQualitiesService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<CandidatePersonalQualitiesService>;
}
