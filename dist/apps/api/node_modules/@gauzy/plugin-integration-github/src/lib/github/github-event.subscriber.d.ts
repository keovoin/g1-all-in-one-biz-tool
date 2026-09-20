import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EventBus } from '@gauzy/core';
export declare class GithubEventSubscriber implements OnModuleInit, OnModuleDestroy {
    private readonly _eventBus;
    private readonly _commandBus;
    private readonly logger;
    private readonly onDestroy$;
    constructor(_eventBus: EventBus, _commandBus: CommandBus);
    /**
     * Initializes the module and sets up a subscription to listen for IntegrationEvent events.
     * The subscription filters the events to only process those related to GitHub integrations.
     * When an event is received, a GithubInstallationDeleteCommand is executed.
     */
    onModuleInit(): Promise<void>;
    /**
     * Sets up a subscription to listen for IntegrationEvent events.
     * Depending on the event type, it will execute the appropriate command.
     */
    private setupIntegrationEvent;
    /**
     * Sets up a subscription to listen for TaskEvent events.
     * Depending on the event type, it will execute the appropriate command.
     */
    private setupTaskEvent;
    /**
     * This method is called when the module is destroyed.
     * It emits a value and completes the onDestroy$ subject to ensure
     * all subscriptions are properly unsubscribed, preventing memory leaks.
     */
    onModuleDestroy(): Promise<void>;
}
