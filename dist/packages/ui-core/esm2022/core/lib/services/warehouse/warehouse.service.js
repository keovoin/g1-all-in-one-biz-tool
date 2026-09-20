import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX, toParams } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class WarehouseService {
    constructor(http) {
        this.http = http;
        this.WAREHOUSES_URL = `${API_PREFIX}/warehouses`;
    }
    create(warehouse) {
        return firstValueFrom(this.http.post(`${this.WAREHOUSES_URL}`, warehouse));
    }
    getAll(where) {
        return firstValueFrom(this.http.get(`${this.WAREHOUSES_URL}`, {
            params: toParams({ where })
        }));
    }
    update(id, warehouse) {
        return firstValueFrom(this.http.put(`${this.WAREHOUSES_URL}/${id}`, warehouse));
    }
    getById(id, relations = []) {
        return firstValueFrom(this.http.get(`${this.WAREHOUSES_URL}/${id}`, {
            params: toParams({ relations })
        }));
    }
    deleteFeaturedImage(id) {
        return firstValueFrom(this.http.delete(`${this.WAREHOUSES_URL}/${id}`));
    }
    addWarehouseProducts(warehouseProductCreateInput, warehouseId) {
        return firstValueFrom(this.http.post(`${this.WAREHOUSES_URL}/inventory/${warehouseId}`, warehouseProductCreateInput));
    }
    getWarehouseProducts(warehouseId) {
        return firstValueFrom(this.http.get(`${this.WAREHOUSES_URL}/inventory/${warehouseId}`));
    }
    updateWarehouseProductCount(warehouseProductId, count) {
        return firstValueFrom(this.http.post(`${this.WAREHOUSES_URL}/inventory-quantity/${warehouseProductId}`, {
            count: count
        }));
    }
    updateWarehouseProductVariantCount(warehouseProductVariantId, count) {
        return firstValueFrom(this.http.post(`${this.WAREHOUSES_URL}/inventory-quantity/variants/${warehouseProductVariantId}`, { count: count }));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WarehouseService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WarehouseService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WarehouseService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=warehouse.service.js.map