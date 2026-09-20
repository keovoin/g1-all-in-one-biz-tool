import { IEmployeeRecurringExpense } from '@gauzy/contracts';
import { ICommandHandler } from '@nestjs/cqrs';
import { EmployeeRecurringExpenseService } from '../../employee-recurring-expense.service';
import { EmployeeRecurringExpenseCreateCommand } from '../employee-recurring-expense.create.command';
/**
 * Creates a recurring expense for an employee.
 * The parentRecurringExpenseId is it's own id since this is a new expense.
 */
export declare class EmployeeRecurringExpenseCreateHandler implements ICommandHandler<EmployeeRecurringExpenseCreateCommand> {
    private readonly employeeRecurringExpenseService;
    constructor(employeeRecurringExpenseService: EmployeeRecurringExpenseService);
    /**
     * Executes the command to create a recurring expense for an employee.
     *
     * @param command - The command containing the input data for creating the recurring expense.
     * @returns A promise that resolves with the created employee recurring expense.
     * @throws BadRequestException if there is an error during the creation process.
     */
    execute(command: EmployeeRecurringExpenseCreateCommand): Promise<IEmployeeRecurringExpense>;
}
