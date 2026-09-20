import { HttpClient } from '@angular/common/http';
import { ICandidateTechnologies, ICandidateTechnologiesCreateInput, ICandidateTechnologiesFindInput } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class CandidateTechnologiesService {
    private http;
    constructor(http: HttpClient);
    create(createInput: ICandidateTechnologiesCreateInput): Promise<ICandidateTechnologies>;
    createBulk(interviewId: string, technologies: string[]): Promise<ICandidateTechnologies[]>;
    getAll(findInput?: ICandidateTechnologiesFindInput): Promise<{
        items: any[];
        total: number;
    }>;
    update(id: string, updateInput: any): Promise<any>;
    updateBulk(technologies: ICandidateTechnologies[]): Promise<any>;
    findByInterviewId(interviewId: string): Promise<ICandidateTechnologies[]>;
    delete(id: string): Promise<any>;
    deleteBulkByInterviewId(id: string, technologies?: ICandidateTechnologies[]): Promise<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<CandidateTechnologiesService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<CandidateTechnologiesService>;
}
