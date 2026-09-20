import { IEventHandler } from '@nestjs/cqrs';
import { TimerStatusUpdatedEvent } from '@gauzy/core';
import { WebhookService } from '../webhook.service';
export declare class TimerStatusUpdatedHandler implements IEventHandler<TimerStatusUpdatedEvent> {
    private readonly webhookService;
    constructor(webhookService: WebhookService);
    /**
     * Handles the TimerStatusUpdatedEvent by emitting a 'status' event with the updated timer status.
     *
     * @param event - The TimerStatusUpdatedEvent containing the updated timer status.
     * @returns A promise that resolves once the timer status event is emitted.
     */
    handle(event: TimerStatusUpdatedEvent): Promise<void>;
}
