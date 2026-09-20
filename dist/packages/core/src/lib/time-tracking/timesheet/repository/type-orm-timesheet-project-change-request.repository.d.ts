import { Repository } from 'typeorm';
import { TimesheetProjectChangeRequest } from '../timesheet-project-change-request.entity';
export declare class TypeOrmTimesheetProjectChangeRequestRepository extends Repository<TimesheetProjectChangeRequest> {
    readonly repository: Repository<TimesheetProjectChangeRequest>;
    constructor(repository: Repository<TimesheetProjectChangeRequest>);
}
