import { IGetActivitiesInput, ReportGroupFilterEnum } from '@gauzy/contracts';
import { FiltersQueryDTO, SelectorsQueryDTO } from '../../../shared/dto';
declare const ActivityQueryDTO_base: import("@nestjs/common").Type<SelectorsQueryDTO & FiltersQueryDTO>;
/**
 * Get activities request DTO validation
 */
export declare class ActivityQueryDTO extends ActivityQueryDTO_base implements IGetActivitiesInput {
    readonly groupBy: ReportGroupFilterEnum;
    readonly types: string[];
    readonly titles: string[];
}
export {};
