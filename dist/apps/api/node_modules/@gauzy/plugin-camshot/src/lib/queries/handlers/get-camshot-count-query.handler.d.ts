import { IQueryHandler } from '@nestjs/cqrs';
import { GetCamshotCountQuery } from '../get-camshot-count.query';
import { CamshotService } from '../../services/camshot.service';
/**
 * Query handler for retrieving the count of camshot entities.
 *
 * This handler processes the `GetCamshotCountQuery` to count the number of camshot entities
 * based on the provided query options.
 */
export declare class GetCamshotCountQueryHandler implements IQueryHandler<GetCamshotCountQuery> {
    private readonly camshotService;
    constructor(camshotService: CamshotService);
    /**
     * Handles the `GetCamshotCountQuery` to retrieve the count of camshot entities.
     *
     * @param query - The `GetCamshotCountQuery` containing the filter options for counting camshot entities.
     *
     * @returns A promise resolving to the count of camshot entities (`number`).
     *
     */
    execute(query: GetCamshotCountQuery): Promise<number>;
}
