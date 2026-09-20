import { ICommandHandler } from '@nestjs/cqrs';
import { UpdateResult } from 'typeorm';
import { IEmployee } from '@gauzy/contracts';
import { GauzyAIService } from '@gauzy/plugin-integration-ai';
import { EmployeeService } from '@gauzy/core';
import { UpdateEmployeeJobSearchStatusCommand } from '../update-employee-job-search-status.command';
export declare class UpdateEmployeeJobSearchStatusHandler implements ICommandHandler<UpdateEmployeeJobSearchStatusCommand> {
    private readonly employeeService;
    private readonly gauzyAIService;
    constructor(employeeService: EmployeeService, gauzyAIService: GauzyAIService);
    /**
     * Executes the command to update an employee's job search status.
     *
     * @param command - The command containing the employee ID and input data.
     * @returns A promise resolving to the updated employee or the update result.
     */
    execute(command: UpdateEmployeeJobSearchStatusCommand): Promise<IEmployee | UpdateResult>;
}
