"use strict";
var SimTaskEventHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimTaskEventHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const core_1 = require("@gauzy/core");
const sim_service_1 = require("../sim.service");
const event_mapping_dto_1 = require("../dto/event-mapping.dto");
/** Map BaseEntityEventType to SimEventName keys */
const TASK_EVENT_MAP = {
    created: event_mapping_dto_1.SimEventName.TASK_CREATED,
    updated: event_mapping_dto_1.SimEventName.TASK_UPDATED,
    deleted: event_mapping_dto_1.SimEventName.TASK_DELETED
};
let SimTaskEventHandler = SimTaskEventHandler_1 = class SimTaskEventHandler {
    constructor(eventBus, simService) {
        this.eventBus = eventBus;
        this.simService = simService;
        this.logger = new common_1.Logger(SimTaskEventHandler_1.name);
    }
    onModuleInit() {
        this.subscription = this.eventBus
            .ofType(core_1.TaskEvent)
            .pipe((0, rxjs_1.filter)((event) => !!event.entity), (0, rxjs_1.concatMap)((event) => (0, rxjs_1.from)(this.handleTaskEvent(event)).pipe((0, rxjs_1.catchError)((error) => {
            this.logger.error(`Error in TaskEvent subscription: ${error?.message}`, error?.stack);
            return rxjs_1.EMPTY;
        }))))
            .subscribe();
    }
    /**
     * Handles TaskEvent by triggering any SIM workflow mapped to the corresponding task event type.
     * Maps task event types to SIM event names:
     *   - 'created'  -> 'task.created'
     *   - 'updated'  -> 'task.updated'
     *   - 'deleted'  -> 'task.deleted'
     */
    async handleTaskEvent(event) {
        try {
            const { entity, type } = event;
            const tenantId = entity?.tenantId;
            const organizationId = entity?.organizationId;
            if (!tenantId || !organizationId) {
                return;
            }
            const simEventName = TASK_EVENT_MAP[type];
            if (!simEventName)
                return;
            await this.simService.triggerEventWorkflow({
                event: simEventName,
                data: {
                    id: entity.id,
                    title: entity.title,
                    status: entity.status,
                    projectId: entity.projectId,
                    tenantId: entity.tenantId,
                    organizationId: entity.organizationId,
                    type
                },
                tenantId,
                organizationId
            });
        }
        catch (error) {
            this.logger.error(`Failed to handle TaskEvent for SIM workflow trigger: ${error?.message}`, error?.stack);
        }
    }
    onModuleDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
};
exports.SimTaskEventHandler = SimTaskEventHandler;
exports.SimTaskEventHandler = SimTaskEventHandler = SimTaskEventHandler_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [core_1.EventBus,
        sim_service_1.SimService])
], SimTaskEventHandler);
//# sourceMappingURL=sim-task-event.handler.js.map