import { IOfficialHoliday, IOfficialHolidayFindInput, IPagination } from '@gauzy/contracts';
import { TenantAwareCrudService } from './../core/crud';
import { OfficialHoliday } from './official-holiday.entity';
import { MikroOrmOfficialHolidayRepository } from './repository/mikro-orm-official-holiday.repository';
import { TypeOrmOfficialHolidayRepository } from './repository/type-orm-official-holiday.repository';
/**
 * Official holidays per country, used to pre-fill the "Add Holidays" dialog (issue #314).
 *
 * `TenantAwareCrudService` already forces `tenantId` onto every read and write, so the extra
 * filters below only narrow within the caller's own tenant.
 */
export declare class OfficialHolidayService extends TenantAwareCrudService<OfficialHoliday> {
    readonly typeOrmOfficialHolidayRepository: TypeOrmOfficialHolidayRepository;
    readonly mikroOrmOfficialHolidayRepository: MikroOrmOfficialHolidayRepository;
    constructor(typeOrmOfficialHolidayRepository: TypeOrmOfficialHolidayRepository, mikroOrmOfficialHolidayRepository: MikroOrmOfficialHolidayRepository);
    /**
     * List the official holidays of an organization, optionally narrowed to a country and a year.
     *
     * @param input the country code and/or calendar year to filter by
     * @returns the matching holidays, earliest first
     */
    findAllByFilter(input: IOfficialHolidayFindInput): Promise<IPagination<IOfficialHoliday>>;
}
