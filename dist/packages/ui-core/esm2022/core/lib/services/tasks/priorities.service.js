import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_PREFIX } from '@gauzy/ui-core/common';
import { CrudService } from '../crud/crud.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class TaskPrioritiesService extends CrudService {
    static { this.API_URL = `${API_PREFIX}/task-priorities`; }
    constructor(http) {
        super(http, TaskPrioritiesService.API_URL);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TaskPrioritiesService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TaskPrioritiesService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TaskPrioritiesService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=priorities.service.js.map