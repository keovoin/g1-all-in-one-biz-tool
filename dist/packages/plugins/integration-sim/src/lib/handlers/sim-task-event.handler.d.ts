import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { EventBus } from '@gauzy/core';
import { SimService } from '../sim.service';
export declare class SimTaskEventHandler implements OnModuleInit, OnModuleDestroy {
    private readonly eventBus;
    private readonly simService;
    private readonly logger;
    private subscription;
    constructor(eventBus: EventBus, simService: SimService);
    onModuleInit(): void;
    /**
     * Handles TaskEvent by triggering any SIM workflow mapped to the corresponding task event type.
     * Maps task event types to SIM event names:
     *   - 'created'  -> 'task.created'
     *   - 'updated'  -> 'task.updated'
     *   - 'deleted'  -> 'task.deleted'
     */
    private handleTaskEvent;
    onModuleDestroy(): void;
}
