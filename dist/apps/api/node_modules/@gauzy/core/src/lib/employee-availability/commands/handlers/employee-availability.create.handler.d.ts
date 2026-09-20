import { ICommandHandler } from '@nestjs/cqrs';
import { IEmployeeAvailability } from '@gauzy/contracts';
import { EmployeeAvailabilityService } from '../../employee-availability.service';
import { EmployeeAvailabilityCreateCommand } from '../employee-availability.create.command';
export declare class EmployeeAvailabilityCreateHandler implements ICommandHandler<EmployeeAvailabilityCreateCommand> {
    private readonly _availabilityService;
    constructor(_availabilityService: EmployeeAvailabilityService);
    /**
     * Handles the creation of an employee availability record.
     *
     * @param {EmployeeAvailabilityCreateCommand} command - The command containing employee availability details.
     * @returns {Promise<IEmployeeAvailability>} - The newly created employee availability record.
     * @throws {BadRequestException} - If any validation fails (e.g., missing fields, invalid dates).
     */
    execute(command: EmployeeAvailabilityCreateCommand): Promise<IEmployeeAvailability>;
}
