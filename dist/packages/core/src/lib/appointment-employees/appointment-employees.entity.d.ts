import { IAppointmentEmployee, IEmployee, IEmployeeAppointment } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class AppointmentEmployee extends TenantOrganizationBaseEntity implements IAppointmentEmployee {
    appointmentId: string;
    /**
     * Employee
     */
    employee?: IEmployee;
    employeeId?: string;
    /**
     * EmployeeAppointment
     */
    employeeAppointment?: IEmployeeAppointment;
    employeeAppointmentId?: string;
}
