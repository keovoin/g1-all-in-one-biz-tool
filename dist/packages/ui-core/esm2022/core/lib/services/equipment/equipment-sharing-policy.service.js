import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX, toParams } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class EquipmentSharingPolicyService {
    constructor(http) {
        this.http = http;
        this.EQUIPMENT_SHARING_POLICY_URL = `${API_PREFIX}/equipment-sharing-policy`;
    }
    /**
     * Get all equipment sharing policies with optional filtering and relations.
     *
     * @param where - Conditions to filter the equipment sharing policies.
     * @param relations - Optional relations to include in the result.
     * @returns A promise that resolves to a paginated list of equipment sharing policies.
     */
    getAll(where, relations = []) {
        return firstValueFrom(this.http.get(`${this.EQUIPMENT_SHARING_POLICY_URL}`, {
            params: toParams({ where, relations })
        }));
    }
    /**
     * Delete an equipment sharing policy by ID.
     *
     * @param id - The ID of the equipment sharing policy to delete.
     * @returns A promise that resolves when the equipment sharing policy has been deleted.
     */
    delete(id) {
        return firstValueFrom(this.http.delete(`${this.EQUIPMENT_SHARING_POLICY_URL}/${id}`));
    }
    /**
     * Create a new equipment sharing policy.
     *
     * @param input - The equipment sharing policy data to create.
     * @returns A promise that resolves to the created equipment sharing policy.
     */
    create(input) {
        return firstValueFrom(this.http.post(this.EQUIPMENT_SHARING_POLICY_URL, input));
    }
    /**
     * Update an existing equipment sharing policy.
     *
     * @param id - The ID of the equipment sharing policy to update.
     * @param input - The updated equipment sharing policy data.
     * @returns A promise that resolves to the updated equipment sharing policy.
     */
    update(id, input) {
        return firstValueFrom(this.http.put(`${this.EQUIPMENT_SHARING_POLICY_URL}/${id}`, input));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EquipmentSharingPolicyService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EquipmentSharingPolicyService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EquipmentSharingPolicyService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=equipment-sharing-policy.service.js.map