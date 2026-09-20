"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.todayRange = todayRange;
/** Returns { todayStart, todayEnd } for today in local time */
function todayRange() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return { todayStart: start, todayEnd: end };
}
//# sourceMappingURL=today-range.js.map