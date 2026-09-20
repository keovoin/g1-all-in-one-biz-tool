import { CommandBus, ICommandHandler } from '@nestjs/cqrs';
import { IEmployee } from '@gauzy/contracts';
import { EmployeeBulkCreateCommand } from '../employee.bulk.create.command';
export declare class EmployeeBulkCreateHandler implements ICommandHandler<EmployeeBulkCreateCommand> {
    private readonly commandBus;
    constructor(commandBus: CommandBus);
    /**
     * Executes a bulk create operation for employees.
     * @param command The bulk create command containing input, language code, and origin URL.
     * @returns A promise that resolves to an array of created employees.
     */
    execute(command: EmployeeBulkCreateCommand): Promise<IEmployee[]>;
}
