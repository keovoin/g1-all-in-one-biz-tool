import { IEventHandler } from '@nestjs/cqrs';
import { TimerStartedEvent } from '@gauzy/core';
import { WebhookService } from '../webhook.service';
export declare class TimerStartedHandler implements IEventHandler<TimerStartedEvent> {
    private readonly webhookService;
    constructor(webhookService: WebhookService);
    /**
     * Handles the TimerStartedEvent by emitting a 'start' timer event
     * through the WebhookService.
     *
     * @param event - The TimerStartedEvent that contains the time log details.
     * @returns A Promise that resolves once the timer event is emitted.
     */
    handle(event: TimerStartedEvent): Promise<void>;
}
