"use strict";
var SimTimerStoppedHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimTimerStoppedHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const core_1 = require("@gauzy/core");
const sim_service_1 = require("../sim.service");
let SimTimerStoppedHandler = SimTimerStoppedHandler_1 = class SimTimerStoppedHandler {
    constructor(simService) {
        this.simService = simService;
        this.logger = new common_1.Logger(SimTimerStoppedHandler_1.name);
    }
    /**
     * Handles the TimerStoppedEvent by triggering any SIM workflow mapped to the 'timer.stopped' event.
     *
     * @param event - The TimerStoppedEvent containing the time log details.
     */
    async handle(event) {
        try {
            const timeLog = event.timeLog;
            if (!timeLog.tenantId || !timeLog.organizationId) {
                return;
            }
            await this.simService.triggerEventWorkflow({
                event: 'timer.stopped',
                data: timeLog,
                tenantId: timeLog.tenantId,
                organizationId: timeLog.organizationId
            });
        }
        catch (error) {
            this.logger.error('Failed to handle TimerStoppedEvent for SIM workflow trigger', {
                message: error?.message,
                stack: error?.stack
            });
        }
    }
};
exports.SimTimerStoppedHandler = SimTimerStoppedHandler;
exports.SimTimerStoppedHandler = SimTimerStoppedHandler = SimTimerStoppedHandler_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    (0, cqrs_1.EventsHandler)(core_1.TimerStoppedEvent),
    tslib_1.__metadata("design:paramtypes", [sim_service_1.SimService])
], SimTimerStoppedHandler);
//# sourceMappingURL=sim-timer-stopped.handler.js.map