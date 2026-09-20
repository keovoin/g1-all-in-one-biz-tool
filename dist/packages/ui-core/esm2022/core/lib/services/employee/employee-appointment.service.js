import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX, toParams } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class EmployeeAppointmentService {
    constructor(http) {
        this.http = http;
        this.API_URL = `${API_PREFIX}/employee-appointment`;
    }
    /**
     * Get all employee appointments.
     *
     * @param relations
     * @param findInput
     * @returns
     */
    getAll(relations, findInput) {
        const data = JSON.stringify({ relations, findInput });
        return this.http.get(this.API_URL, {
            params: { data }
        });
    }
    /**
     * Decode token
     *
     * @param token
     * @returns
     */
    decodeToken(token) {
        return firstValueFrom(this.http.get(this.API_URL + '/decode/' + token, { responseType: 'text' }));
    }
    /**
     * signAppointmentId
     *
     * @param id
     * @returns
     */
    signAppointmentId(id) {
        return firstValueFrom(this.http.get(this.API_URL + '/sign/' + id, { responseType: 'text' }));
    }
    /**
     * Get an employee appointment by ID.
     *
     * @param id
     * @param relations
     * @returns
     */
    getById(id, relations = []) {
        return this.http.get(this.API_URL + '/' + id, { params: toParams({ relations }) });
    }
    /**
     * Create an employee appointment.
     *
     * @param input
     * @returns
     */
    create(input) {
        return firstValueFrom(this.http.post(`${this.API_URL}`, input));
    }
    /**
     * Update an employee appointment by ID.
     *
     * @param id
     * @param input
     * @returns
     */
    update(id, input) {
        return firstValueFrom(this.http.put(`${this.API_URL}/${id}`, input));
    }
    /**
     * Delete an employee appointment by ID.
     *
     * @param id
     * @returns
     */
    delete(id) {
        return firstValueFrom(this.http.delete(`${this.API_URL}/${id}`));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeAppointmentService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeAppointmentService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeAppointmentService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=employee-appointment.service.js.map