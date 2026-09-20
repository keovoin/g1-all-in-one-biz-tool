import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, from } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as _ from 'underscore';
import { FeatureService } from './feature.service';
import * as i0 from "@angular/core";
import * as i1 from "./feature.service";
export class FeatureStoreService {
    constructor(_featureService) {
        this._featureService = _featureService;
        this._features$ = new BehaviorSubject([]);
        this.features$ = this._features$.asObservable();
        this._blocks$ = new BehaviorSubject([]);
        this.blocks$ = this._blocks$.asObservable();
        this._featureOrganizations$ = new BehaviorSubject([]);
        this.featureOrganizations$ = this._featureOrganizations$.asObservable();
        this._featureToggles$ = new BehaviorSubject([]);
        this.featureToggles$ = this._featureToggles$.asObservable();
    }
    loadUnleashFeatures() {
        const promise = this._featureService.getFeatureToggleDefinition();
        const observable = from(promise);
        return observable.pipe(tap((items) => {
            this._featureToggles$.next(items);
        }));
    }
    loadFeatures(relations) {
        const features$ = this._features$.getValue();
        if (features$.length > 0) {
            return EMPTY;
        }
        return this._featureService.getParentFeatures(relations).pipe(tap(({ items }) => {
            this._features$.next(items);
            this._blocks$.next(_.chunk(items, 2));
        }));
    }
    loadFeatureOrganizations(relations, findInput) {
        return this._featureService
            .getFeatureOrganizations(findInput, relations)
            .pipe(tap(({ items }) => this._featureOrganizations$.next(items)));
    }
    changedFeature(payload) {
        return this._featureService.featureToggle(payload);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FeatureStoreService, deps: [{ token: i1.FeatureService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FeatureStoreService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FeatureStoreService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.FeatureService }] });
//# sourceMappingURL=feature-store.service.js.map