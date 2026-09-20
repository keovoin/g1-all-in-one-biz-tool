import { IOfficialHolidayCreateInput } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from './../../core/dto';
import { OfficialHoliday } from '../official-holiday.entity';
declare const CreateOfficialHolidayDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO & Omit<OfficialHoliday, "tenantId" | "organizationId">>;
/**
 * Create Official Holiday request DTO.
 */
export declare class CreateOfficialHolidayDTO extends CreateOfficialHolidayDTO_base implements IOfficialHolidayCreateInput {
}
export {};
