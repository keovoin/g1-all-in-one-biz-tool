import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, EMPTY, catchError, combineLatest, filter, map, of, switchMap } from 'rxjs';
import { CandidateStatusEnum } from '@gauzy/contracts';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import { CandidatesService, ErrorHandlingService, Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
let BaseCandidateSelectorComponent = class BaseCandidateSelectorComponent {
    constructor(_store, _candidatesService, _errorHandlingService) {
        this._store = _store;
        this._candidatesService = _candidatesService;
        this._errorHandlingService = _errorHandlingService;
        this.showRejected$ = new BehaviorSubject(false);
    }
    ngOnInit() {
        this.candidates$ = combineLatest([this._store.selectedOrganization$, this.showRejected$]).pipe(filter(([organization]) => !!organization), distinctUntilChange(), switchMap(([organization, showRejected]) => {
            const { id: organizationId, tenantId } = organization;
            // Ensure there is a valid organization
            if (!organizationId) {
                return of([]);
            }
            const status = showRejected ? CandidateStatusEnum.REJECTED : CandidateStatusEnum.APPLIED;
            return this._candidatesService
                .getAll(['user'], {
                organizationId,
                tenantId,
                isActive: true,
                isArchived: false,
                status: status
            })
                .pipe(map(({ items }) => items), catchError((error) => {
                // Handle and log errors
                this._errorHandlingService.handleError(error);
                return EMPTY;
            }), 
            // Handle component lifecycle to avoid memory leaks
            untilDestroyed(this));
        }), 
        // Handle component lifecycle to avoid memory leak
        untilDestroyed(this));
    }
    toggleShowRejected() {
        this.showRejected$.next(!this.showRejected$.value);
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: BaseCandidateSelectorComponent, deps: [{ token: i1.Store }, { token: i1.CandidatesService }, { token: i1.ErrorHandlingService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: BaseCandidateSelectorComponent, isStandalone: false, selector: "ng-component", ngImport: i0, template: '', isInline: true }); }
};
BaseCandidateSelectorComponent = __decorate([
    UntilDestroy(),
    __metadata("design:paramtypes", [Store,
        CandidatesService,
        ErrorHandlingService])
], BaseCandidateSelectorComponent);
export { BaseCandidateSelectorComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: BaseCandidateSelectorComponent, decorators: [{
            type: Component,
            args: [{
                    template: '',
                    standalone: false
                }]
        }], ctorParameters: () => [{ type: i1.Store }, { type: i1.CandidatesService }, { type: i1.ErrorHandlingService }] });
//# sourceMappingURL=base-candidate-selector.component.js.map