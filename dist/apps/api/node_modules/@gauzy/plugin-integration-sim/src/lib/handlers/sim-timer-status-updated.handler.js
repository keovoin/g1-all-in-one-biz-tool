"use strict";
var SimTimerStatusUpdatedHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimTimerStatusUpdatedHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const core_1 = require("@gauzy/core");
const sim_service_1 = require("../sim.service");
const event_mapping_dto_1 = require("../dto/event-mapping.dto");
let SimTimerStatusUpdatedHandler = SimTimerStatusUpdatedHandler_1 = class SimTimerStatusUpdatedHandler {
    constructor(simService) {
        this.simService = simService;
        this.logger = new common_1.Logger(SimTimerStatusUpdatedHandler_1.name);
    }
    /**
     * Handles the TimerStatusUpdatedEvent by triggering any SIM workflow mapped to the 'timer.status_updated' event.
     *
     * @param event - The TimerStatusUpdatedEvent containing the timer status details.
     */
    async handle(event) {
        try {
            const { status } = event;
            const lastLog = status.lastLog;
            if (!lastLog?.tenantId || !lastLog?.organizationId) {
                return;
            }
            await this.simService.triggerEventWorkflow({
                event: event_mapping_dto_1.SimEventName['TIMER_STATUS_UPDATED'],
                data: {
                    duration: status.duration,
                    running: status.running,
                    timerStatus: status.timerStatus,
                    lastLog,
                    lastWorkedTask: status.lastWorkedTask
                },
                tenantId: lastLog.tenantId,
                organizationId: lastLog.organizationId
            });
        }
        catch (error) {
            this.logger.error('Failed to handle TimerStatusUpdatedEvent for SIM workflow trigger', {
                message: error?.message,
                stack: error?.stack
            });
        }
    }
};
exports.SimTimerStatusUpdatedHandler = SimTimerStatusUpdatedHandler;
exports.SimTimerStatusUpdatedHandler = SimTimerStatusUpdatedHandler = SimTimerStatusUpdatedHandler_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    (0, cqrs_1.EventsHandler)(core_1.TimerStatusUpdatedEvent),
    tslib_1.__metadata("design:paramtypes", [sim_service_1.SimService])
], SimTimerStatusUpdatedHandler);
//# sourceMappingURL=sim-timer-status-updated.handler.js.map