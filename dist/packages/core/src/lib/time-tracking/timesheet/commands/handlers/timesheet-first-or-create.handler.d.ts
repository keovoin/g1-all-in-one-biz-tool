import { CommandBus, ICommandHandler } from '@nestjs/cqrs';
import { ITimesheet } from '@gauzy/contracts';
import { MultiORM } from './../../../../core/utils';
import { TimesheetFirstOrCreateCommand } from './../timesheet-first-or-create.command';
import { TypeOrmTimesheetRepository } from '../../repository/type-orm-timesheet.repository';
import { MikroOrmTimesheetRepository } from '../../repository/mikro-orm-timesheet.repository';
import { TypeOrmEmployeeRepository } from '../../../../employee/repository/type-orm-employee.repository';
export declare class TimesheetFirstOrCreateHandler implements ICommandHandler<TimesheetFirstOrCreateCommand> {
    private readonly timeSheetRepository;
    private readonly mikroOrmTimesheetRepository;
    private readonly employeeRepository;
    private readonly commandBus;
    protected ormType: MultiORM;
    constructor(timeSheetRepository: TypeOrmTimesheetRepository, mikroOrmTimesheetRepository: MikroOrmTimesheetRepository, employeeRepository: TypeOrmEmployeeRepository, commandBus: CommandBus);
    execute(command: TimesheetFirstOrCreateCommand): Promise<ITimesheet>;
}
