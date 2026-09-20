import { ICommandHandler } from '@nestjs/cqrs';
import { DeleteResult } from 'typeorm';
import { IncomeService } from '../../income.service';
import { EmployeeService } from '../../../employee/employee.service';
import { EmployeeStatisticsService } from '../../../employee-statistics';
import { IncomeDeleteCommand } from '../income.delete.command';
export declare class IncomeDeleteHandler implements ICommandHandler<IncomeDeleteCommand> {
    private readonly incomeService;
    private readonly employeeService;
    private readonly employeeStatisticsService;
    constructor(incomeService: IncomeService, employeeService: EmployeeService, employeeStatisticsService: EmployeeStatisticsService);
    /**
     * Deletes an income record and updates the employee's statistics if necessary.
     *
     * @param command - The command containing the income ID to delete and the optional employee ID.
     * @returns A promise that resolves with the result of the delete operation.
     * @throws BadRequestException if there is an error updating employee statistics.
     */
    execute(command: IncomeDeleteCommand): Promise<DeleteResult>;
    /**
     * Deletes income by ID with permission check
     *
     * @param incomeId - The ID of the income to delete
     * @returns Promise<DeleteResult> - The result of the delete operation
     */
    deleteIncome(incomeId: string): Promise<DeleteResult>;
}
