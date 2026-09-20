import { Repository } from 'typeorm';
import { OfficialHoliday } from '../official-holiday.entity';
export declare class TypeOrmOfficialHolidayRepository extends Repository<OfficialHoliday> {
    readonly repository: Repository<OfficialHoliday>;
    constructor(repository: Repository<OfficialHoliday>);
}
