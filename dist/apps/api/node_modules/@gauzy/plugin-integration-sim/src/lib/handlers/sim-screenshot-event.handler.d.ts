import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { EventBus } from '@gauzy/core';
import { SimService } from '../sim.service';
export declare class SimScreenshotEventHandler implements OnModuleInit, OnModuleDestroy {
    private readonly eventBus;
    private readonly simService;
    private readonly logger;
    private subscription;
    constructor(eventBus: EventBus, simService: SimService);
    onModuleInit(): void;
    /**
     * Handles ScreenshotEvent by triggering any SIM workflow mapped to the corresponding screenshot event type.
     * Maps screenshot event types to SIM event names:
     *   - 'created'  -> 'screenshot.created'
     *   - 'updated'  -> 'screenshot.updated'
     *   - 'deleted'  -> 'screenshot.deleted'
     */
    private handleScreenshotEvent;
    onModuleDestroy(): void;
}
