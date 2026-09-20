import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as i0 from "@angular/core";
export class SimStoreService {
    constructor() {
        // Selected integration tenant ID
        this._selectedIntegrationId$ = new BehaviorSubject(null);
        this.selectedIntegrationId$ = this._selectedIntegrationId$.asObservable();
        // Execution history
        this._executions$ = new BehaviorSubject([]);
        this.executions$ = this._executions$.asObservable();
    }
    setSelectedIntegrationId(id) {
        this._selectedIntegrationId$.next(id);
    }
    setExecutions(executions) {
        this._executions$.next(executions);
    }
    reset() {
        this._selectedIntegrationId$.next(null);
        this._executions$.next([]);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SimStoreService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SimStoreService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SimStoreService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
//# sourceMappingURL=sim-store.service.js.map