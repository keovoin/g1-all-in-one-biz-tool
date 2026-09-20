import { HttpClient } from '@angular/common/http';
import { ICandidatePersonalQualities, ICandidateCriterionsRating, ICandidateTechnologies, IPagination } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class CandidateCriterionsRatingService {
    private http;
    constructor(http: HttpClient);
    createBulk(feedbackId: string, technologies: ICandidateTechnologies[], qualities: ICandidatePersonalQualities[]): Promise<ICandidateCriterionsRating[]>;
    getAll(): Promise<IPagination<ICandidateCriterionsRating>>;
    updateBulk(criterionsRating: ICandidateCriterionsRating[], technologies: number[], personalQualities: number[]): Promise<any>;
    deleteBulkByFeedbackId(id: string): Promise<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<CandidateCriterionsRatingService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<CandidateCriterionsRatingService>;
}
