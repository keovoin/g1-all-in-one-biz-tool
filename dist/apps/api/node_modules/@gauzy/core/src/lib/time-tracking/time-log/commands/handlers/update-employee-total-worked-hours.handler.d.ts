import { ICommandHandler } from '@nestjs/cqrs';
import { ConfigService } from '@gauzy/config';
import { MultiORM } from './../../../../core/utils';
import { EmployeeService } from '../../../../employee/employee.service';
import { UpdateEmployeeTotalWorkedHoursCommand } from '../update-employee-total-worked-hours.command';
import { TypeOrmTimeLogRepository } from '../../repository/type-orm-time-log.repository';
import { MikroOrmTimeLogRepository } from '../../repository/mikro-orm-time-log.repository';
export declare class UpdateEmployeeTotalWorkedHoursHandler implements ICommandHandler<UpdateEmployeeTotalWorkedHoursCommand> {
    readonly typeOrmTimeLogRepository: TypeOrmTimeLogRepository;
    readonly mikroOrmTimeLogRepository: MikroOrmTimeLogRepository;
    private readonly _employeeService;
    private readonly _configService;
    protected ormType: MultiORM;
    constructor(typeOrmTimeLogRepository: TypeOrmTimeLogRepository, mikroOrmTimeLogRepository: MikroOrmTimeLogRepository, _employeeService: EmployeeService, _configService: ConfigService);
    /**
     * Updates the total worked hours for an employee.
     *
     * @param command The command containing employee ID and worked hours.
     */
    execute(command: UpdateEmployeeTotalWorkedHoursCommand): Promise<void>;
    /**
     * Calculates the total work hours for an employee.
     * @param employeeId The ID of the employee.
     * @param tenantId The tenant ID.
     * @returns The total work hours.
     */
    private calculateTotalWorkHours;
    /**
     * Get the database-specific sum query for calculating time duration between "startedAt" and "stoppedAt".
     * @param logQueryAlias The alias for the table in the query.
     * @returns The database-specific sum query that returns a Number.
     */
    private getSumQuery;
}
