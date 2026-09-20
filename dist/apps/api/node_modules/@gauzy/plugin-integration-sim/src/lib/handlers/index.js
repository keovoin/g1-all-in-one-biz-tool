"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventHandlers = void 0;
const sim_timer_started_handler_1 = require("./sim-timer-started.handler");
const sim_timer_stopped_handler_1 = require("./sim-timer-stopped.handler");
const sim_timer_status_updated_handler_1 = require("./sim-timer-status-updated.handler");
const sim_task_event_handler_1 = require("./sim-task-event.handler");
const sim_screenshot_event_handler_1 = require("./sim-screenshot-event.handler");
const sim_integration_event_handler_1 = require("./sim-integration-event.handler");
const sim_account_registration_handler_1 = require("./sim-account-registration.handler");
const sim_account_verified_handler_1 = require("./sim-account-verified.handler");
exports.EventHandlers = [
    sim_timer_started_handler_1.SimTimerStartedHandler,
    sim_timer_stopped_handler_1.SimTimerStoppedHandler,
    sim_timer_status_updated_handler_1.SimTimerStatusUpdatedHandler,
    sim_task_event_handler_1.SimTaskEventHandler,
    sim_screenshot_event_handler_1.SimScreenshotEventHandler,
    sim_integration_event_handler_1.SimIntegrationEventHandler,
    sim_account_registration_handler_1.SimAccountRegistrationHandler,
    sim_account_verified_handler_1.SimAccountVerifiedHandler
];
//# sourceMappingURL=index.js.map