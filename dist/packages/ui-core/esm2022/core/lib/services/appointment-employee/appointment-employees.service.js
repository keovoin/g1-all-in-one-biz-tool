import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class AppointmentEmployeesService {
    constructor(http) {
        this.http = http;
        this.URI = `${API_PREFIX}/appointment-employees`;
    }
    getAll() {
        return firstValueFrom(this.http.get(this.URI));
    }
    getById(id = '') {
        return this.http.get(this.URI + '/appointment/' + id);
    }
    findEmployeeAppointments(id = '') {
        return this.http.get(this.URI + '/employee-appointments/' + id);
    }
    add(appointmentEmployees) {
        return firstValueFrom(this.http.post(this.URI, appointmentEmployees));
    }
    update(id, appointmentEmployees) {
        return firstValueFrom(this.http.put(`${this.URI}/${id}`, appointmentEmployees));
    }
    delete(id) {
        return firstValueFrom(this.http.delete(`${this.URI}/${id}`));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AppointmentEmployeesService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AppointmentEmployeesService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AppointmentEmployeesService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=appointment-employees.service.js.map