import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class AvailabilitySlotsService {
    constructor(http) {
        this.http = http;
        this.AVAILABILITY_SLOTS_BASE_URI = `${API_PREFIX}/availability-slots`;
    }
    create(createInput) {
        return firstValueFrom(this.http.post(this.AVAILABILITY_SLOTS_BASE_URI, createInput));
    }
    createBulk(createInput) {
        return firstValueFrom(this.http.post(this.AVAILABILITY_SLOTS_BASE_URI + '/bulk', createInput));
    }
    getAll(relations, findInput) {
        const data = JSON.stringify({ relations, findInput });
        return firstValueFrom(this.http.get(this.AVAILABILITY_SLOTS_BASE_URI, {
            params: { data }
        }));
    }
    update(id, updateInput) {
        return firstValueFrom(this.http.put(`${this.AVAILABILITY_SLOTS_BASE_URI}/${id}`, updateInput));
    }
    delete(id) {
        return firstValueFrom(this.http.delete(`${this.AVAILABILITY_SLOTS_BASE_URI}/${id}`));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AvailabilitySlotsService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AvailabilitySlotsService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AvailabilitySlotsService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=availability-slots.service.js.map