import { IGetTimeSlotInput } from '@gauzy/contracts';
import { FiltersQueryDTO, RelationsQueryDTO, SelectorsQueryDTO } from '../../../shared/dto';
declare const TimeSlotQueryDTO_base: import("@nestjs/common").Type<RelationsQueryDTO & SelectorsQueryDTO & FiltersQueryDTO>;
/**
 * Get time slot request DTO validation
 */
export declare class TimeSlotQueryDTO extends TimeSlotQueryDTO_base implements IGetTimeSlotInput {
}
export {};
