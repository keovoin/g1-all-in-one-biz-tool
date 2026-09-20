import { ITimeLog, TimeLogSourceEnum } from '@gauzy/contracts';
import { ITimerSynced } from '@gauzy/ui-core/core';
export declare class TimerSynced implements ITimerSynced {
    private _source;
    private _isRunning;
    private _startedAt;
    private _stoppedAt;
    private _lastLog;
    constructor(timeLog?: ITimeLog);
    get isExternalSource(): boolean;
    get lastLog(): ITimeLog;
    set lastLog(value: ITimeLog);
    get source(): TimeLogSourceEnum;
    set source(value: TimeLogSourceEnum);
    get running(): boolean;
    set running(value: boolean);
    get startedAt(): Date;
    set startedAt(value: Date);
    get stoppedAt(): Date;
    set stoppedAt(value: Date);
}
