import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICandidateInterviewFindInput, ICandidateInterviewCreateInput, ICandidateInterview, IPagination, ICandidate } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class CandidateInterviewService {
    private readonly http;
    constructor(http: HttpClient);
    create(input: ICandidateInterviewCreateInput): Promise<ICandidateInterview>;
    getAll(relations?: string[], where?: ICandidateInterviewFindInput): Observable<IPagination<ICandidateInterview>>;
    findById(id: ICandidateInterview['id'], relations?: string[]): Promise<ICandidateInterview>;
    findByCandidateId(candidateId: ICandidate['id']): Promise<ICandidateInterview[]>;
    update(id: ICandidateInterview['id'], input: ICandidateInterviewCreateInput): Promise<ICandidateInterview>;
    setInterviewAsArchived(id: ICandidateInterview['id']): Promise<ICandidateInterview>;
    delete(id: ICandidateInterview['id']): Promise<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<CandidateInterviewService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<CandidateInterviewService>;
}
