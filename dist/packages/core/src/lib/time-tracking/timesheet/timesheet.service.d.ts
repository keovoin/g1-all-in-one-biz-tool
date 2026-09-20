import { SelectQueryBuilder } from 'typeorm';
import { IGetTimesheetInput, ITimesheet } from '@gauzy/contracts';
import { TenantAwareCrudService } from './../../core/crud';
import { Timesheet } from './timesheet.entity';
import { TypeOrmTimesheetRepository } from './repository/type-orm-timesheet.repository';
import { MikroOrmTimesheetRepository } from './repository/mikro-orm-timesheet.repository';
export declare class TimeSheetService extends TenantAwareCrudService<Timesheet> {
    constructor(typeOrmTimesheetRepository: TypeOrmTimesheetRepository, mikroOrmTimesheetRepository: MikroOrmTimesheetRepository);
    /**
     * GET timesheets count in date range for the same tenant
     *
     * @param request
     * @returns number - Count of timesheets
     */
    getTimeSheetCount(request: IGetTimesheetInput): Promise<number>;
    /**
     * GET timesheets in date range for the same tenant
     *
     * @param request
     * @returns Promise<ITimesheet[]> - List of timesheets
     */
    getTimeSheets(request: IGetTimesheetInput): Promise<ITimesheet[]>;
    /**
     * GET timesheet QueryBuilder
     *
     * @param qb
     * @param request
     * @returns
     */
    getFilterTimesheetQuery(qb: SelectQueryBuilder<Timesheet>, request: IGetTimesheetInput): Promise<SelectQueryBuilder<Timesheet>>;
}
