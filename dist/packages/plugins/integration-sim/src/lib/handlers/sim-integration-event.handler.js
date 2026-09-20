"use strict";
var SimIntegrationEventHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimIntegrationEventHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const core_1 = require("@gauzy/core");
const sim_service_1 = require("../sim.service");
const event_mapping_dto_1 = require("../dto/event-mapping.dto");
/** Map BaseEntityEventType to SimEventName keys */
const INTEGRATION_EVENT_MAP = {
    created: event_mapping_dto_1.SimEventName.INTEGRATION_CREATED,
    updated: event_mapping_dto_1.SimEventName.INTEGRATION_UPDATED,
    deleted: event_mapping_dto_1.SimEventName.INTEGRATION_DELETED
};
let SimIntegrationEventHandler = SimIntegrationEventHandler_1 = class SimIntegrationEventHandler {
    constructor(eventBus, simService) {
        this.eventBus = eventBus;
        this.simService = simService;
        this.logger = new common_1.Logger(SimIntegrationEventHandler_1.name);
    }
    onModuleInit() {
        this.subscription = this.eventBus
            .ofType(core_1.IntegrationEvent)
            .pipe((0, rxjs_1.filter)((event) => !!event.entity), (0, rxjs_1.concatMap)((event) => (0, rxjs_1.from)(this.handleIntegrationEvent(event)).pipe((0, rxjs_1.catchError)((error) => {
            this.logger.error(`Error in IntegrationEvent subscription: ${error?.message}`, error?.stack);
            return rxjs_1.EMPTY;
        }))))
            .subscribe();
    }
    /**
     * Handles IntegrationEvent by triggering any SIM workflow mapped to the corresponding integration event type.
     * Maps integration event types to SIM event names:
     *   - 'created'  -> 'integration.created'
     *   - 'updated'  -> 'integration.updated'
     *   - 'deleted'  -> 'integration.deleted'
     */
    async handleIntegrationEvent(event) {
        try {
            const { entity, type } = event;
            const tenantId = entity?.tenantId;
            const organizationId = entity?.organizationId;
            if (!tenantId || !organizationId) {
                return;
            }
            const simEventName = INTEGRATION_EVENT_MAP[type];
            if (!simEventName)
                return;
            await this.simService.triggerEventWorkflow({
                event: simEventName,
                data: {
                    id: entity.id,
                    name: entity.name,
                    tenantId: entity.tenantId,
                    organizationId: entity.organizationId,
                    type
                },
                tenantId,
                organizationId
            });
        }
        catch (error) {
            this.logger.error(`Failed to handle IntegrationEvent for SIM workflow trigger: ${error?.message}`, error?.stack);
        }
    }
    onModuleDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
};
exports.SimIntegrationEventHandler = SimIntegrationEventHandler;
exports.SimIntegrationEventHandler = SimIntegrationEventHandler = SimIntegrationEventHandler_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [core_1.EventBus,
        sim_service_1.SimService])
], SimIntegrationEventHandler);
//# sourceMappingURL=sim-integration-event.handler.js.map