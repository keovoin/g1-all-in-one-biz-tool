"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventHandlers = void 0;
const timer_started_handler_1 = require("./timer-started.handler");
const timer_status_updated_handler_1 = require("./timer-status-updated.handler");
const timer_stopped_handler_1 = require("./timer-stopped.handler");
exports.EventHandlers = [timer_started_handler_1.TimerStartedHandler, timer_stopped_handler_1.TimerStoppedHandler, timer_status_updated_handler_1.TimerStatusUpdatedHandler];
//# sourceMappingURL=index.js.map