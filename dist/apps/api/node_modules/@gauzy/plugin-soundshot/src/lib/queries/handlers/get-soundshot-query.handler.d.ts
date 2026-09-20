import { IQueryHandler } from '@nestjs/cqrs';
import { GetSoundshotQuery } from '../get-soundshot.query';
import { ISoundshot } from '../../models/soundshot.model';
import { SoundshotService } from '../../services/soundshot.service';
export declare class GetSoundshotQueryHandler implements IQueryHandler<GetSoundshotQuery> {
    private readonly soundshotService;
    constructor(soundshotService: SoundshotService);
    /**
     * Handles the `GetSoundshotQuery` to retrieve a soundshot entity by its ID.
     *
     * @param query - The `GetSoundshotQuery` containing the ID of the soundshot to be fetched and optional query options.
     *
     * @returns A promise resolving to the soundshot entity (`ISoundshot`) if found.
     *
     * @throws {NotFoundException} If the soundshot with the specified ID is not found.
     */
    execute(query: GetSoundshotQuery): Promise<ISoundshot>;
}
