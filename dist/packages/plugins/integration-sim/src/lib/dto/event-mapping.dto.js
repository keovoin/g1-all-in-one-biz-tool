"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventMappingDto = exports.SIM_EVENT_DESCRIPTIONS = exports.SimEventName = exports.SIM_SUPPORTED_EVENTS = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
/**
 * Supported Gauzy event types that can trigger SIM workflows.
 */
exports.SIM_SUPPORTED_EVENTS = [
    'timer.started',
    'timer.stopped',
    'timer.status_updated',
    'task.created',
    'task.updated',
    'task.deleted',
    'screenshot.created',
    'screenshot.updated',
    'screenshot.deleted',
    'integration.created',
    'integration.updated',
    'integration.deleted',
    'account.registered',
    'account.verified'
];
/**
 * Constant map of SIM event names for use in handlers.
 * Avoids hardcoded string literals that can drift out of sync with SIM_SUPPORTED_EVENTS.
 */
exports.SimEventName = {
    TIMER_STARTED: 'timer.started',
    TIMER_STOPPED: 'timer.stopped',
    TIMER_STATUS_UPDATED: 'timer.status_updated',
    TASK_CREATED: 'task.created',
    TASK_UPDATED: 'task.updated',
    TASK_DELETED: 'task.deleted',
    SCREENSHOT_CREATED: 'screenshot.created',
    SCREENSHOT_UPDATED: 'screenshot.updated',
    SCREENSHOT_DELETED: 'screenshot.deleted',
    INTEGRATION_CREATED: 'integration.created',
    INTEGRATION_UPDATED: 'integration.updated',
    INTEGRATION_DELETED: 'integration.deleted',
    ACCOUNT_REGISTERED: 'account.registered',
    ACCOUNT_VERIFIED: 'account.verified'
};
/**
 * Event descriptions map for use in the service layer.
 */
exports.SIM_EVENT_DESCRIPTIONS = {
    'timer.started': 'Triggered when an employee starts their timer',
    'timer.stopped': 'Triggered when an employee stops their timer',
    'timer.status_updated': 'Triggered when a timer status is queried and updated',
    'task.created': 'Triggered when a new task is created',
    'task.updated': 'Triggered when a task is updated',
    'task.deleted': 'Triggered when a task is deleted',
    'screenshot.created': 'Triggered when a new screenshot is captured',
    'screenshot.updated': 'Triggered when a screenshot is updated',
    'screenshot.deleted': 'Triggered when a screenshot is deleted',
    'integration.created': 'Triggered when a new integration is created',
    'integration.updated': 'Triggered when an integration is updated',
    'integration.deleted': 'Triggered when an integration is deleted',
    'account.registered': 'Triggered when a new account is registered',
    'account.verified': 'Triggered when an account is verified'
};
class EventMappingDto {
}
exports.EventMappingDto = EventMappingDto;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The Gauzy event type to map',
        enum: exports.SIM_SUPPORTED_EVENTS
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsIn)(exports.SIM_SUPPORTED_EVENTS),
    tslib_1.__metadata("design:type", String)
], EventMappingDto.prototype, "event", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The SIM workflow ID to trigger when this event fires'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/\S/, { message: 'workflowId must contain non-whitespace characters' }),
    tslib_1.__metadata("design:type", String)
], EventMappingDto.prototype, "workflowId", void 0);
//# sourceMappingURL=event-mapping.dto.js.map