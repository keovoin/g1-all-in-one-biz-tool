import { IQueryHandler } from '@nestjs/cqrs';
import { GetSoundshotCountQuery } from '../get-soundshot-count.query';
import { SoundshotService } from '../../services/soundshot.service';
/**
 * Query handler for retrieving the count of soundshot entities.
 *
 * This handler processes the `GetSoundshotCountQuery` to count the number of soundshot entities
 * based on the provided query options.
 */
export declare class GetSoundshotCountQueryHandler implements IQueryHandler<GetSoundshotCountQuery> {
    private readonly soundshotService;
    constructor(soundshotService: SoundshotService);
    /**
     * Handles the `GetSoundshotCountQuery` to retrieve the count of soundshot entities.
     *
     * @param query - The `GetSoundshotCountQuery` containing the filter options for counting soundshot entities.
     *
     * @returns A promise resolving to the count of soundshot entities (`number`).
     *
     */
    execute(query: GetSoundshotCountQuery): Promise<number>;
}
