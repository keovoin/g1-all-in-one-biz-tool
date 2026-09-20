import { IEventHandler } from '@nestjs/cqrs';
import { TimerStartedEvent } from '@gauzy/core';
import { ZapierWebhookService } from '../zapier-webhook.service';
export declare class ZapierTimerStartedHandler implements IEventHandler<TimerStartedEvent> {
    private readonly zapierWebhookService;
    constructor(zapierWebhookService: ZapierWebhookService);
    /**
     * Handles the TimerStartedEvent by notifying Zapier webhooks
     *
     * @param event - The TimerStartedEvent that contains the time log details
     * @returns A Promise that resolves once the webhooks are notified
     */
    handle(event: TimerStartedEvent): Promise<void>;
}
