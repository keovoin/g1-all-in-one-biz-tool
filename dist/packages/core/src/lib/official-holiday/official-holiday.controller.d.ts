import { DeleteResult, UpdateResult } from 'typeorm';
import { ID, IOfficialHoliday, IPagination } from '@gauzy/contracts';
import { CreateOfficialHolidayDTO, OfficialHolidayQueryDTO, UpdateOfficialHolidayDTO } from './dto';
import { OfficialHolidayService } from './official-holiday.service';
/**
 * Official holidays per country (issue #314).
 *
 * Reuses the Time Off policy permissions: an official holiday list is organization-level Time Off
 * configuration, managed by the same people who manage the policies.
 */
export declare class OfficialHolidayController {
    private readonly officialHolidayService;
    constructor(officialHolidayService: OfficialHolidayService);
    /**
     * List the official holidays of an organization, optionally by country and year.
     *
     * @param options the country code and/or calendar year to filter by
     * @returns the matching holidays, earliest first
     */
    findAll(options: OfficialHolidayQueryDTO): Promise<IPagination<IOfficialHoliday>>;
    /**
     * Get one official holiday by id.
     *
     * @param id the holiday to read
     * @returns the holiday
     */
    findById(id: ID): Promise<IOfficialHoliday>;
    /**
     * Create an official holiday.
     *
     * @param entity the holiday to create
     * @returns the created holiday
     */
    create(entity: CreateOfficialHolidayDTO): Promise<IOfficialHoliday>;
    /**
     * Update an official holiday.
     *
     * @param id the holiday to update
     * @param entity the fields to change
     * @returns the updated holiday
     */
    update(id: ID, entity: UpdateOfficialHolidayDTO): Promise<IOfficialHoliday | UpdateResult>;
    /**
     * Delete an official holiday.
     *
     * @param id the holiday to delete
     * @returns the delete result
     */
    delete(id: ID): Promise<DeleteResult>;
}
