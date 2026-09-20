import { IOfficialHolidayUpdateInput } from '@gauzy/contracts';
import { CreateOfficialHolidayDTO } from './create-official-holiday.dto';
declare const UpdateOfficialHolidayDTO_base: import("@nestjs/common").Type<Partial<CreateOfficialHolidayDTO>>;
/**
 * Update Official Holiday request DTO.
 */
export declare class UpdateOfficialHolidayDTO extends UpdateOfficialHolidayDTO_base implements IOfficialHolidayUpdateInput {
}
export {};
