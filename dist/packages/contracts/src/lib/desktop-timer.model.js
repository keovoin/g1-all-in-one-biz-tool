"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimerSyncStateEnum = exports.TimerActionTypeEnum = void 0;
var TimerActionTypeEnum;
(function (TimerActionTypeEnum) {
    TimerActionTypeEnum["START_TIMER"] = "startTimer";
    TimerActionTypeEnum["STOP_TIMER"] = "stopTimer";
})(TimerActionTypeEnum || (exports.TimerActionTypeEnum = TimerActionTypeEnum = {}));
var TimerSyncStateEnum;
(function (TimerSyncStateEnum) {
    TimerSyncStateEnum["PENDING"] = "pending";
    TimerSyncStateEnum["SYNCING"] = "syncing";
    TimerSyncStateEnum["SYNCED"] = "synced";
    TimerSyncStateEnum["FAILED"] = "failed";
})(TimerSyncStateEnum || (exports.TimerSyncStateEnum = TimerSyncStateEnum = {}));
;
//# sourceMappingURL=desktop-timer.model.js.map