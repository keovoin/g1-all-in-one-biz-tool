"use strict";
var SimAccountVerifiedHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimAccountVerifiedHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const core_1 = require("@gauzy/core");
const sim_service_1 = require("../sim.service");
const event_mapping_dto_1 = require("../dto/event-mapping.dto");
let SimAccountVerifiedHandler = SimAccountVerifiedHandler_1 = class SimAccountVerifiedHandler {
    constructor(eventBus, simService) {
        this.eventBus = eventBus;
        this.simService = simService;
        this.logger = new common_1.Logger(SimAccountVerifiedHandler_1.name);
    }
    onModuleInit() {
        this.subscription = this.eventBus
            .ofType(core_1.AccountVerifiedEvent)
            .pipe((0, rxjs_1.filter)((event) => !!event.user), (0, rxjs_1.concatMap)((event) => (0, rxjs_1.from)(this.handleAccountVerified(event)).pipe((0, rxjs_1.catchError)((error) => {
            this.logger.error(`Error in AccountVerifiedEvent subscription: ${error?.message}`, error?.stack);
            return rxjs_1.EMPTY;
        }))))
            .subscribe();
    }
    /**
     * Handles AccountVerifiedEvent by triggering any SIM workflow mapped to the 'account.verified' event.
     */
    async handleAccountVerified(event) {
        try {
            const { user } = event;
            const tenantId = user?.tenantId;
            if (!tenantId) {
                return;
            }
            await this.simService.triggerEventWorkflow({
                event: event_mapping_dto_1.SimEventName['ACCOUNT_VERIFIED'],
                data: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    tenantId: user.tenantId
                },
                tenantId
            });
        }
        catch (error) {
            this.logger.error(`Failed to handle AccountVerifiedEvent for SIM workflow trigger: ${error?.message}`, error?.stack);
        }
    }
    onModuleDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
};
exports.SimAccountVerifiedHandler = SimAccountVerifiedHandler;
exports.SimAccountVerifiedHandler = SimAccountVerifiedHandler = SimAccountVerifiedHandler_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [core_1.EventBus,
        sim_service_1.SimService])
], SimAccountVerifiedHandler);
//# sourceMappingURL=sim-account-verified.handler.js.map