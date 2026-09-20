import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { TimeLogSourceEnum } from '@gauzy/contracts';
import { ITimerIcon } from './itimer-icon';
export declare abstract class TimerIcon implements ITimerIcon {
    private _source;
    private _name;
    get source(): TimeLogSourceEnum;
    set source(value: TimeLogSourceEnum);
    get name(): IconDefinition;
    set name(value: IconDefinition);
}
