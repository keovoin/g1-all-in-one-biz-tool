import { IOfficialHoliday } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
/**
 * A publicly recognized holiday for a country, kept per organization.
 *
 * Issue #314 asks for an `OfficialHolidays` table so the "Add Holidays" dialog can offer a
 * predefined list of national holidays and pre-fill the From/To dates once one is picked,
 * filtered by the organization's country setting.
 *
 * Dates are stored as `date`, not as timestamps: a public holiday is a calendar day, and storing
 * it with a time component makes it land on the wrong day for anybody in another timezone.
 */
export declare class OfficialHoliday extends TenantOrganizationBaseEntity implements IOfficialHoliday {
    name: string;
    countryCode: string;
    date: Date;
    endDate?: Date;
    isRecurring?: boolean;
}
