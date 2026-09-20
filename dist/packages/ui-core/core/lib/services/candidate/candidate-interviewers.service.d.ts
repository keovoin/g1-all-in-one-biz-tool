import { HttpClient } from '@angular/common/http';
import { ICandidateInterviewersFindInput, ICandidateInterviewersCreateInput, ICandidateInterviewers, ICandidateInterviewersDeleteInput } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class CandidateInterviewersService {
    private http;
    constructor(http: HttpClient);
    create(createInput: ICandidateInterviewersCreateInput): Promise<ICandidateInterviewers>;
    createBulk(createInput: ICandidateInterviewersCreateInput): Promise<ICandidateInterviewers[]>;
    getAll(findInput?: ICandidateInterviewersFindInput): Promise<{
        items: any[];
        total: number;
    }>;
    update(id: string, updateInput: any): Promise<any>;
    delete(id: string): Promise<any>;
    findByInterviewId(interviewId: string): Promise<ICandidateInterviewers[]>;
    deleteBulkByInterviewId(interviewId: string): Promise<any>;
    deleteBulkByEmployeeId(deleteInput: ICandidateInterviewersDeleteInput[]): Promise<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<CandidateInterviewersService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<CandidateInterviewersService>;
}
