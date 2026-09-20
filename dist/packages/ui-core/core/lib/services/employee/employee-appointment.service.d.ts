import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ID, IEmployeeAppointment, IEmployeeAppointmentCreateInput, IEmployeeAppointmentFindInput, IEmployeeAppointmentUpdateInput } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class EmployeeAppointmentService {
    private http;
    API_URL: string;
    constructor(http: HttpClient);
    /**
     * Get all employee appointments.
     *
     * @param relations
     * @param findInput
     * @returns
     */
    getAll(relations?: string[], findInput?: IEmployeeAppointmentFindInput): Observable<{
        items: IEmployeeAppointment[];
    }>;
    /**
     * Decode token
     *
     * @param token
     * @returns
     */
    decodeToken(token: string): Promise<string>;
    /**
     * signAppointmentId
     *
     * @param id
     * @returns
     */
    signAppointmentId(id: ID): Promise<string>;
    /**
     * Get an employee appointment by ID.
     *
     * @param id
     * @param relations
     * @returns
     */
    getById(id: ID, relations?: string[]): Observable<IEmployeeAppointment>;
    /**
     * Create an employee appointment.
     *
     * @param input
     * @returns
     */
    create(input: IEmployeeAppointmentCreateInput): Promise<any>;
    /**
     * Update an employee appointment by ID.
     *
     * @param id
     * @param input
     * @returns
     */
    update(id: ID, input: IEmployeeAppointmentUpdateInput): Promise<IEmployeeAppointment>;
    /**
     * Delete an employee appointment by ID.
     *
     * @param id
     * @returns
     */
    delete(id: ID): Promise<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<EmployeeAppointmentService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<EmployeeAppointmentService>;
}
