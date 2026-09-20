import { IUserFindInput, ICandidate, ICandidateUpdateInput, ICandidateInterview, IUserUpdateInput } from '@gauzy/contracts';
import { BehaviorSubject, Observable } from 'rxjs';
import * as i0 from "@angular/core";
/**
 * Service used to update candidate
 */
export declare class CandidateStore {
    private _selectedCandidate;
    private _userForm;
    private _candidateForm;
    selectedCandidate$: BehaviorSubject<ICandidate>;
    userForm$: BehaviorSubject<IUserFindInput>;
    candidateForm$: BehaviorSubject<ICandidateUpdateInput>;
    private _interviewList$;
    interviewList$: Observable<ICandidateInterview[]>;
    get interviewList(): Observable<ICandidateInterview[]>;
    loadInterviews(interviewList: ICandidateInterview[]): void;
    set selectedCandidate(candidate: ICandidate);
    get selectedCandidate(): ICandidate;
    set userForm(user: IUserUpdateInput);
    get userForm(): IUserUpdateInput;
    set candidateForm(candidate: ICandidateUpdateInput);
    get candidateForm(): ICandidateUpdateInput;
    /**
     * Update the user form with new data
     *
     * @param formData - The form data to update.
     */
    updateUserForm(formData: IUserUpdateInput): Promise<void>;
    clear(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CandidateStore, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<CandidateStore>;
}
