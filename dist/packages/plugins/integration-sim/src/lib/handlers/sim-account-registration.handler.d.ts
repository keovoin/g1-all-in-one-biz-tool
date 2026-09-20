import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { EventBus } from '@gauzy/core';
import { SimService } from '../sim.service';
export declare class SimAccountRegistrationHandler implements OnModuleInit, OnModuleDestroy {
    private readonly eventBus;
    private readonly simService;
    private readonly logger;
    private subscription;
    constructor(eventBus: EventBus, simService: SimService);
    onModuleInit(): void;
    /**
     * Handles AccountRegistrationEvent by triggering any SIM workflow mapped to the 'account.registered' event.
     */
    private handleAccountRegistration;
    onModuleDestroy(): void;
}
