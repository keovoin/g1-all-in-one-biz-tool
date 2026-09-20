"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventHandlers = void 0;
const zapier_timer_started_handler_1 = require("./zapier-timer-started.handler");
const zapier_timer_stopped_handler_1 = require("./zapier-timer-stopped.handler");
exports.EventHandlers = [zapier_timer_started_handler_1.ZapierTimerStartedHandler, zapier_timer_stopped_handler_1.ZapierTimerStoppedHandler];
//# sourceMappingURL=index.js.map