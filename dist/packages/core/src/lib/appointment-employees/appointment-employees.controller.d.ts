import { CrudController } from './../core/crud';
import { AppointmentEmployee } from './appointment-employees.entity';
import { AppointmentEmployeesService } from './appointment-employees.service';
import { IAppointmentEmployee } from '@gauzy/contracts';
export declare class AppointmentEmployeesController extends CrudController<AppointmentEmployee> {
    private readonly appointmentEmployeesService;
    constructor(appointmentEmployeesService: AppointmentEmployeesService);
    findByAppointmentId(appointmentId: string): Promise<IAppointmentEmployee[]>;
    findEmployeeAppointments(employeeId: string): Promise<IAppointmentEmployee[]>;
}
