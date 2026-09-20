import { ICommandHandler } from '@nestjs/cqrs';
import { IEmployeeAvailability } from '@gauzy/contracts';
import { EmployeeAvailabilityService } from '../../employee-availability.service';
import { EmployeeAvailabilityBulkCreateCommand } from '../employee-availability.bulk.create.command';
/**
 * Handles the bulk creation of employee availability records.
 */
export declare class EmployeeAvailabilityBulkCreateHandler implements ICommandHandler<EmployeeAvailabilityBulkCreateCommand> {
    private readonly _availabilityService;
    constructor(_availabilityService: EmployeeAvailabilityService);
    /**
     * Executes the bulk creation command for employee availability.
     *
     * @param command The command containing the list of availability records to create.
     * @returns A promise resolving to the list of created employee availability records.
     */
    execute(command: EmployeeAvailabilityBulkCreateCommand): Promise<IEmployeeAvailability[]>;
}
