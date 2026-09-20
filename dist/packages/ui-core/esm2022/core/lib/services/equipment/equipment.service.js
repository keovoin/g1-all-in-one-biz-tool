import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class EquipmentService {
    constructor(http) {
        this.http = http;
        this.EQUIPMENT_URL = `${API_PREFIX}/equipment`;
    }
    getAll(relations, findInput) {
        const data = JSON.stringify({ relations: relations || [], findInput });
        return firstValueFrom(this.http.get(`${this.EQUIPMENT_URL}`, {
            params: { data }
        }));
    }
    delete(id) {
        return firstValueFrom(this.http.delete(`${this.EQUIPMENT_URL}/${id}`));
    }
    save(equipment) {
        if (!equipment.id) {
            return firstValueFrom(this.http.post(this.EQUIPMENT_URL, equipment));
        }
        else {
            return firstValueFrom(this.http.put(`${this.EQUIPMENT_URL}/${equipment.id}`, equipment));
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EquipmentService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EquipmentService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EquipmentService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=equipment.service.js.map