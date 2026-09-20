import { TimeLogSourceEnum } from '@gauzy/contracts';
export class TimerSynced {
    constructor(timeLog) {
        this._source = timeLog.source;
        this._isRunning = timeLog.isRunning;
        this._startedAt = timeLog.startedAt;
        this._stoppedAt = timeLog.stoppedAt;
        this._lastLog = timeLog;
    }
    get isExternalSource() {
        return this.source !== TimeLogSourceEnum.WEB_TIMER;
    }
    get lastLog() {
        return this._lastLog;
    }
    set lastLog(value) {
        this._lastLog = value;
    }
    get source() {
        return this._source;
    }
    set source(value) {
        this._source = value;
    }
    get running() {
        return this._isRunning;
    }
    set running(value) {
        this._isRunning = value;
    }
    get startedAt() {
        return this._startedAt;
    }
    set startedAt(value) {
        this._startedAt = value;
    }
    get stoppedAt() {
        return this._stoppedAt;
    }
    set stoppedAt(value) {
        this._stoppedAt = value;
    }
}
//# sourceMappingURL=timer-synced.js.map