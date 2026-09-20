import { ICommandHandler } from '@nestjs/cqrs';
import { IEmployee, IPagination } from '@gauzy/contracts';
import { EmployeeService } from '../../employee.service';
import { WorkingEmployeeGetCommand } from '../working-employee.get.command';
export declare class WorkingEmployeeGetHandler implements ICommandHandler<WorkingEmployeeGetCommand> {
    private readonly employeeService;
    constructor(employeeService: EmployeeService);
    /**
     *
     */
    execute(command: WorkingEmployeeGetCommand): Promise<IPagination<IEmployee>>;
}
