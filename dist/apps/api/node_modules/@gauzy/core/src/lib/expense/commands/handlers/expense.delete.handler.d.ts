import { ICommandHandler } from '@nestjs/cqrs';
import { DeleteResult } from 'typeorm';
import { ID } from '@gauzy/contracts';
import { ExpenseService } from '../../expense.service';
import { EmployeeService } from '../../../employee/employee.service';
import { EmployeeStatisticsService } from '../../../employee-statistics';
import { ExpenseDeleteCommand } from '../expense.delete.command';
export declare class ExpenseDeleteHandler implements ICommandHandler<ExpenseDeleteCommand> {
    private readonly expenseService;
    private readonly employeeService;
    private readonly employeeStatisticsService;
    constructor(expenseService: ExpenseService, employeeService: EmployeeService, employeeStatisticsService: EmployeeStatisticsService);
    /**
     * Executes the deletion of an expense and updates the employee's average expenses if applicable.
     *
     * @param command - The command containing the expense ID to delete and the optional employee ID.
     * @returns A promise that resolves with the result of the delete operation.
     * @throws BadRequestException if there is an error updating employee average expenses.
     */
    execute(command: ExpenseDeleteCommand): Promise<DeleteResult>;
    /**
     * Delete the expense based on user permissions
     *
     * @param expenseId - The ID of the expense to delete
     * @returns Promise<DeleteResult> - The result of the delete operation
     */
    deleteExpense(expenseId: ID): Promise<DeleteResult>;
}
