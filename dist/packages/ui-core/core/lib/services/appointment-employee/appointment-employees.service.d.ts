import { HttpClient } from '@angular/common/http';
import { IAppointmentEmployee } from '@gauzy/contracts';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class AppointmentEmployeesService {
    private http;
    URI: string;
    constructor(http: HttpClient);
    getAll(): Promise<{
        items: IAppointmentEmployee[];
    }>;
    getById(id?: string): Observable<IAppointmentEmployee[]>;
    findEmployeeAppointments(id?: string): Observable<IAppointmentEmployee[]>;
    add(appointmentEmployees: IAppointmentEmployee): Promise<IAppointmentEmployee>;
    update(id: string, appointmentEmployees: IAppointmentEmployee): Promise<IAppointmentEmployee>;
    delete(id: string): Promise<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<AppointmentEmployeesService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AppointmentEmployeesService>;
}
