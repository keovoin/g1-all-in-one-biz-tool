import { EventBus } from '@gauzy/core';
import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { IntegrationAIAnalysisService } from './integration-ai-analysis.service';
export declare class IntegrationAIEventSubscriber implements OnModuleInit, OnModuleDestroy {
    private readonly _eventBus;
    private readonly _integrationAIAnalysisService;
    private readonly logger;
    private readonly onDestroy$;
    constructor(_eventBus: EventBus, _integrationAIAnalysisService: IntegrationAIAnalysisService);
    /**
     * Initializes the module and sets up a subscription to listen for IntegrationEvent events.
     * The subscription filters the events to only process those related to GitHub integrations.
     * When an event is received, a GithubInstallationDeleteCommand is executed.
     */
    onModuleInit(): Promise<void>;
    /**
     * This method is called when the module is destroyed.
     * It emits a value and completes the onDestroy$ subject to ensure
     * all subscriptions are properly unsubscribed, preventing memory leaks.
     */
    onModuleDestroy(): Promise<void>;
}
