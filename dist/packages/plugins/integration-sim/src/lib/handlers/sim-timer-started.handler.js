"use strict";
var SimTimerStartedHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimTimerStartedHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const core_1 = require("@gauzy/core");
const sim_service_1 = require("../sim.service");
const event_mapping_dto_1 = require("../dto/event-mapping.dto");
let SimTimerStartedHandler = SimTimerStartedHandler_1 = class SimTimerStartedHandler {
    constructor(simService) {
        this.simService = simService;
        this.logger = new common_1.Logger(SimTimerStartedHandler_1.name);
    }
    /**
     * Handles the TimerStartedEvent by triggering any SIM workflow mapped to the 'timer.started' event.
     *
     * @param event - The TimerStartedEvent containing the time log details.
     */
    async handle(event) {
        try {
            const timeLog = event.timeLog;
            if (!timeLog.tenantId || !timeLog.organizationId) {
                return;
            }
            await this.simService.triggerEventWorkflow({
                event: event_mapping_dto_1.SimEventName['TIMER_STARTED'],
                data: timeLog,
                tenantId: timeLog.tenantId,
                organizationId: timeLog.organizationId
            });
        }
        catch (error) {
            this.logger.error('Failed to handle TimerStartedEvent for SIM workflow trigger', {
                message: error?.message,
                stack: error?.stack
            });
        }
    }
};
exports.SimTimerStartedHandler = SimTimerStartedHandler;
exports.SimTimerStartedHandler = SimTimerStartedHandler = SimTimerStartedHandler_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    (0, cqrs_1.EventsHandler)(core_1.TimerStartedEvent),
    tslib_1.__metadata("design:paramtypes", [sim_service_1.SimService])
], SimTimerStartedHandler);
//# sourceMappingURL=sim-timer-started.handler.js.map