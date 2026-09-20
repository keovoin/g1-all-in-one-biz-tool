import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { RequestApprovalStatusTypesEnum } from '@gauzy/contracts';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class EquipmentSharingService {
    constructor(http) {
        this.http = http;
        this.EQUIPMENT_SHARING_URL = `${API_PREFIX}/equipment-sharing`;
    }
    /**
     * Retrieves all equipment sharing records.
     *
     * @returns A promise that resolves to an array of equipment sharing records.
     */
    getAll() {
        return firstValueFrom(this.http.get(`${this.EQUIPMENT_SHARING_URL}`));
    }
    /**
     * Retrieves equipment sharing records for a specific organization.
     *
     * @param id - The unique identifier of the organization.
     * @returns A promise that resolves to an array of equipment sharing records associated with the given organization.
     */
    getByOrganizationId(id) {
        return firstValueFrom(this.http.get(`${this.EQUIPMENT_SHARING_URL}/organization/${id}`));
    }
    /**
     * Retrieves equipment sharing records by the author (employee) user ID.
     *
     * @param id - The unique identifier of the author user.
     * @returns A promise that resolves to an array of equipment sharing records created by the specified user.
     */
    getByEmployeeId(id) {
        return firstValueFrom(this.http.get(`${this.EQUIPMENT_SHARING_URL}/employee/${id}`));
    }
    /**
     * Deletes an equipment sharing record by its ID.
     *
     * @param id - The unique identifier of the equipment sharing record to delete.
     * @returns A promise that resolves when the deletion is complete.
     */
    delete(id) {
        return firstValueFrom(this.http.delete(`${this.EQUIPMENT_SHARING_URL}/${id}`));
    }
    /**
     * Creates a new equipment sharing record for a specific organization.
     *
     * @param equipmentSharing - The input data required to create the equipment sharing record.
     * @param organizationId - The ID of the organization that the record belongs to.
     * @returns A promise that resolves to the newly created equipment sharing record.
     */
    create(equipmentSharing, organizationId) {
        return firstValueFrom(this.http.post(`${this.EQUIPMENT_SHARING_URL}/organization/${organizationId}`, equipmentSharing));
    }
    /**
     * Updates an existing equipment sharing record.
     *
     * @param id - The unique identifier of the equipment sharing record to update.
     * @param input - The updated data for the equipment sharing record.
     * @returns A promise that resolves to the updated equipment sharing record.
     */
    update(id, input) {
        return firstValueFrom(this.http.put(`${this.EQUIPMENT_SHARING_URL}/${id}`, input));
    }
    /**
     * Approves an equipment sharing request.
     *
     * @param id - The unique identifier of the equipment sharing record to approve.
     * @returns A promise that resolves to the equipment sharing record updated with the approved status.
     */
    approval(id) {
        return firstValueFrom(this.http.put(`${this.EQUIPMENT_SHARING_URL}/approval/${id}`, {
            status: RequestApprovalStatusTypesEnum.APPROVED
        }));
    }
    /**
     * Refuses an equipment sharing request.
     *
     * @param id - The unique identifier of the equipment sharing record to refuse.
     * @returns A promise that resolves to the equipment sharing record updated with the refused status.
     */
    refuse(id) {
        return firstValueFrom(this.http.put(`${this.EQUIPMENT_SHARING_URL}/refuse/${id}`, {
            status: RequestApprovalStatusTypesEnum.REFUSED
        }));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EquipmentSharingService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EquipmentSharingService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EquipmentSharingService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=equipment-sharing.service.js.map