import { EmployeeAppointmentStatus, ID, IEmployee, IEmployeeAppointment } from '@gauzy/contracts';
import { AppointmentEmployee, TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class EmployeeAppointment extends TenantOrganizationBaseEntity implements IEmployeeAppointment {
    agenda: string;
    description?: string;
    location?: string;
    startDateTime: Date;
    endDateTime: Date;
    bufferTimeStart?: Boolean;
    bufferTimeEnd?: Boolean;
    bufferTimeInMins?: Number;
    breakTimeInMins?: Number;
    breakStartTime?: Date;
    emails?: string;
    status?: EmployeeAppointmentStatus;
    /**
     * Appointment Employee
     */
    employee?: IEmployee;
    employeeId?: ID;
    /**
     *
     */
    invitees?: AppointmentEmployee[];
}
