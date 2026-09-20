import { HttpClient } from '@angular/common/http';
import { ICandidateFeedback, ICandidateFeedbackFindInput, ICandidateFeedbackCreateInput } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class CandidateFeedbacksService {
    private http;
    constructor(http: HttpClient);
    create(createInput: ICandidateFeedbackCreateInput): Promise<ICandidateFeedback>;
    getAll(relations?: string[], findInput?: ICandidateFeedbackFindInput): Promise<{
        items: any[];
        total: number;
    }>;
    findById(id: string): Promise<ICandidateFeedback>;
    findByInterviewId(interviewId: string): Promise<ICandidateFeedback[]>;
    update(id: string, updateInput: any): Promise<any>;
    delete(feedbackId: string, interviewId?: string): Promise<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<CandidateFeedbacksService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<CandidateFeedbacksService>;
}
