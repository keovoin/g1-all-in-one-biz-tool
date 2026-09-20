import { ICommandHandler, CommandBus } from '@nestjs/cqrs';
import { TimeSlotService } from '../../../time-slot/time-slot.service';
import { TimeLogService } from '../../time-log.service';
import { TimeLog } from '../../time-log.entity';
import { TimeLogCreateCommand } from '../time-log-create.command';
import { MikroOrmTimeLogRepository } from '../../repository/mikro-orm-time-log.repository';
import { TypeOrmTimeLogRepository } from '../../repository/type-orm-time-log.repository';
export declare class TimeLogCreateHandler implements ICommandHandler<TimeLogCreateCommand> {
    readonly typeOrmTimeLogRepository: TypeOrmTimeLogRepository;
    readonly mikroOrmTimeLogRepository: MikroOrmTimeLogRepository;
    private readonly _commandBus;
    private readonly _timeSlotService;
    private readonly _timeLogService;
    constructor(typeOrmTimeLogRepository: TypeOrmTimeLogRepository, mikroOrmTimeLogRepository: MikroOrmTimeLogRepository, _commandBus: CommandBus, _timeSlotService: TimeSlotService, _timeLogService: TimeLogService);
    /**
     * Handles the execution of the TimeLogCreateCommand
     *
     * @param command TimeLogCreateCommand
     * @returns Promise<TimeLog>
     */
    execute(command: TimeLogCreateCommand): Promise<TimeLog>;
    /**
     * Creates a new TimeLog entity based on the provided input
     *
     * @param input Partial<TimeLog>
     * @param tenantId ID
     * @param timesheet ITimesheet
     * @returns TimeLog
     */
    private createTimeLogEntity;
    /**
     * Generates blank time slots between startedAt and stoppedAt
     * @param input Partial<TimeLog>
     * @param tenantId string
     * @returns ITimeSlot[]
     */
    private generateBlankTimeSlots;
    /**
     * Merges input time slots with generated blank slots
     * @param generatedSlots ITimeSlot[]
     * @param inputSlots ITimeSlot[]
     * @param employeeId ID
     * @param organizationId ID
     * @param tenantId ID
     * @returns ITimeSlot[]
     */
    private mergeTimeSlots;
    /**
     * Recalculates the timesheet activity
     * @param timesheet ITimesheet
     */
    private recalculateTimesheet;
    /**
     * Updates total worked hours for the employee
     *
     * @param employeeId ID
     */
    private updateEmployeeTotalWorkedHours;
}
