import { ICommandHandler } from '@nestjs/cqrs';
import { IActivity } from '@gauzy/contracts';
import { BulkActivitiesSaveCommand } from '../bulk-activities-save.command';
import { TypeOrmActivityRepository } from '../../repository/type-orm-activity.repository';
import { TypeOrmEmployeeRepository } from '../../../../employee/repository/type-orm-employee.repository';
export declare class BulkActivitiesSaveHandler implements ICommandHandler<BulkActivitiesSaveCommand> {
    private readonly typeOrmActivityRepository;
    private readonly typeOrmEmployeeRepository;
    constructor(typeOrmActivityRepository: TypeOrmActivityRepository, typeOrmEmployeeRepository: TypeOrmEmployeeRepository);
    /**
     * Executes the bulk save operation for activities.
     *
     * @param command - The command containing the input data for saving multiple activities.
     * @returns A promise that resolves with the saved activities.
     * @throws BadRequestException if there is an error during the save process.
     */
    execute(command: BulkActivitiesSaveCommand): Promise<IActivity[]>;
}
