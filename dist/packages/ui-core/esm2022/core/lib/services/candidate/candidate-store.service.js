import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Service used to update candidate
 */
export class CandidateStore {
    constructor() {
        this.selectedCandidate$ = new BehaviorSubject(this.selectedCandidate);
        this.userForm$ = new BehaviorSubject(this.userForm);
        this.candidateForm$ = new BehaviorSubject(this.candidateForm);
        this._interviewList$ = new BehaviorSubject([]);
        this.interviewList$ = this._interviewList$.asObservable();
    }
    get interviewList() {
        return this._interviewList$.asObservable();
    }
    loadInterviews(interviewList) {
        this._interviewList$.next(interviewList);
    }
    set selectedCandidate(candidate) {
        this._selectedCandidate = candidate;
        this.selectedCandidate$.next(candidate);
    }
    get selectedCandidate() {
        return this._selectedCandidate;
    }
    set userForm(user) {
        this._userForm = user;
        this.userForm$.next(user);
    }
    get userForm() {
        return this._userForm;
    }
    set candidateForm(candidate) {
        this._candidateForm = candidate;
        this.candidateForm$.next(candidate);
    }
    get candidateForm() {
        return this._candidateForm;
    }
    /**
     * Update the user form with new data
     *
     * @param formData - The form data to update.
     */
    async updateUserForm(formData) {
        // Simulate an async operation, such as an API call
        // await someApiService.update(formData);
        this.userForm = { ...this.userForm, ...formData };
    }
    clear() {
        localStorage.clear();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateStore, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateStore }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateStore, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=candidate-store.service.js.map