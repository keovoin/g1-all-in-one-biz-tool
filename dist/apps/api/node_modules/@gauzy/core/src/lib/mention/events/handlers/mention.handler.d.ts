import { IEventHandler } from '@nestjs/cqrs';
import { IMention } from '@gauzy/contracts';
import { CreateMentionEvent } from '../mention.event';
import { MentionService } from '../../mention.service';
export declare class CreateMentionEventHandler implements IEventHandler<CreateMentionEvent> {
    private readonly mentionService;
    constructor(mentionService: MentionService);
    /**
     * Handles the `CreateMentionEvent` by creating a new mention using the provided input.
     *
     * @param {CreateMentionEvent} event - The mention event containing the data required to create a mention.
     * @returns {Promise<IMention>} A promise that resolves to the newly created mention entry.
     *
     */
    handle(event: CreateMentionEvent): Promise<IMention>;
}
