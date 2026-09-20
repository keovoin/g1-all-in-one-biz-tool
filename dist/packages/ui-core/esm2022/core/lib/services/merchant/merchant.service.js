import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { toParams } from '@gauzy/ui-core/common';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class MerchantService {
    constructor(http) {
        this.http = http;
        this.MERCHANTS_URL = `${API_PREFIX}/merchants`;
    }
    getById(id, relations = []) {
        return firstValueFrom(this.http.get(`${this.MERCHANTS_URL}/${id}`, {
            params: toParams({ relations })
        }));
    }
    create(productStore) {
        return firstValueFrom(this.http.post(`${this.MERCHANTS_URL}`, productStore));
    }
    update(productStore) {
        return firstValueFrom(this.http.put(`${this.MERCHANTS_URL}/${productStore.id}`, productStore));
    }
    delete(id) {
        return firstValueFrom(this.http.delete(`${this.MERCHANTS_URL}/${id}`));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: MerchantService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: MerchantService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: MerchantService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=merchant.service.js.map