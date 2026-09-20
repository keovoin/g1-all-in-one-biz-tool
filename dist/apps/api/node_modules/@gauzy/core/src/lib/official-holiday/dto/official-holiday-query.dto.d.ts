import { IOfficialHolidayFindInput } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from './../../core/dto';
/**
 * Query filters for listing official holidays.
 */
export declare class OfficialHolidayQueryDTO extends TenantOrganizationBaseDTO implements IOfficialHolidayFindInput {
    readonly countryCode?: string;
    readonly year?: number;
}
