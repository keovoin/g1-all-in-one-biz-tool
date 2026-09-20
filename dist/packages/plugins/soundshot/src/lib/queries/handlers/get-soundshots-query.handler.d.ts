import { IPagination } from '@gauzy/contracts';
import { IQueryHandler } from '@nestjs/cqrs';
import { ISoundshot } from '../../models/soundshot.model';
import { SoundshotService } from '../../services/soundshot.service';
import { GetSoundshotsQuery } from '../get-soundshots.query';
export declare class GetSoundshotsQueryHandler implements IQueryHandler<GetSoundshotsQuery> {
    private readonly soundshotService;
    constructor(soundshotService: SoundshotService);
    /**
     * Handles the GetSoundshotsQuery and returns a paginated list of soundshots.
     *
     * @param query - The query containing pagination and filtering parameters for soundshots
     * @returns Promise<IPagination<ISoundshot>> A paginated list of soundshots
     */
    execute(query: GetSoundshotsQuery): Promise<IPagination<ISoundshot>>;
}
