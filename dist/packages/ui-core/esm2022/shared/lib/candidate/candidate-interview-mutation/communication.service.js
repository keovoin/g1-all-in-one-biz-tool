import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
export class CommunicationService {
    constructor() {
        // Subjects for technologies
        this.technologyAddedSource = new Subject();
        this.technologyRemovedSource = new Subject();
        // Subjects for qualities
        this.qualityAddedSource = new Subject();
        this.qualityRemovedSource = new Subject();
        // Observables for technologies
        this.technologyAdded$ = this.technologyAddedSource.asObservable();
        this.technologyRemoved$ = this.technologyRemovedSource.asObservable();
        // Observables for qualities
        this.qualityAdded$ = this.qualityAddedSource.asObservable();
        this.qualityRemoved$ = this.qualityRemovedSource.asObservable();
    }
    // Methods for technologies
    addTechnology(technology) {
        this.technologyAddedSource.next(technology);
    }
    removeTechnology(technologyId) {
        this.technologyRemovedSource.next(technologyId);
    }
    // Methods for qualities
    addQuality(quality) {
        this.qualityAddedSource.next(quality);
    }
    removeQuality(qualityId) {
        this.qualityRemovedSource.next(qualityId);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CommunicationService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CommunicationService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CommunicationService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });
//# sourceMappingURL=communication.service.js.map