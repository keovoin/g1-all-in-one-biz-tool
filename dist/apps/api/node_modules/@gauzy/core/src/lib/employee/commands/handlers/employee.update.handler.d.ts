import { IEmployee } from '@gauzy/contracts';
import { ICommandHandler } from '@nestjs/cqrs';
import { EmployeeUpdateCommand } from './../employee.update.command';
import { EmployeeService } from './../../employee.service';
export declare class EmployeeUpdateHandler implements ICommandHandler<EmployeeUpdateCommand> {
    private readonly _employeeService;
    constructor(_employeeService: EmployeeService);
    /**
     * Handles the execution of the `EmployeeUpdateCommand`.
     * Ensures proper permissions are enforced and updates the employee's profile.
     *
     * @param command - The `EmployeeUpdateCommand` containing the employee ID and input data.
     * @returns The updated employee entity.
     * @throws ForbiddenException if the user lacks permissions or tries to edit another employee's profile.
     * @throws BadRequestException if the update operation fails.
     */
    execute(command: EmployeeUpdateCommand): Promise<IEmployee>;
}
