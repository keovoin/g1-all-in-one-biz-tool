import { ITimerToggleInput } from '@gauzy/contracts';
import { StartTimerDTO } from './start-timer.dto';
declare const StopTimerDTO_base: import("@nestjs/common").Type<StartTimerDTO & Partial<Pick<StartTimerDTO, "source" | "logType">>>;
export declare class StopTimerDTO extends StopTimerDTO_base implements ITimerToggleInput {
}
export {};
