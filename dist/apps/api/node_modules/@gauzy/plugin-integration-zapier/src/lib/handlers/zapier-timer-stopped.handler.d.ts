import { IEventHandler } from '@nestjs/cqrs';
import { TimerStoppedEvent } from '@gauzy/core';
import { ZapierWebhookService } from '../zapier-webhook.service';
export declare class ZapierTimerStoppedHandler implements IEventHandler<TimerStoppedEvent> {
    private readonly zapierWebhookService;
    constructor(zapierWebhookService: ZapierWebhookService);
    /**
     * Handles the TimerStoppedEvent by notifying Zapier webhooks
     *
     * @param event - The TimerStoppedEvent that contains the time log details.
     * @returns A Promise that resolves once the webhooks are notified
     */
    handle(event: TimerStoppedEvent): Promise<void>;
}
