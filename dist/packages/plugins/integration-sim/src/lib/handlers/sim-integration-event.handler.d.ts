import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { EventBus } from '@gauzy/core';
import { SimService } from '../sim.service';
export declare class SimIntegrationEventHandler implements OnModuleInit, OnModuleDestroy {
    private readonly eventBus;
    private readonly simService;
    private readonly logger;
    private subscription;
    constructor(eventBus: EventBus, simService: SimService);
    onModuleInit(): void;
    /**
     * Handles IntegrationEvent by triggering any SIM workflow mapped to the corresponding integration event type.
     * Maps integration event types to SIM event names:
     *   - 'created'  -> 'integration.created'
     *   - 'updated'  -> 'integration.updated'
     *   - 'deleted'  -> 'integration.deleted'
     */
    private handleIntegrationEvent;
    onModuleDestroy(): void;
}
