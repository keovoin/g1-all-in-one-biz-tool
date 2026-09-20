import { IQueryHandler } from '@nestjs/cqrs';
import { GetCamshotQuery } from '../get-camshot.query';
import { ICamshot } from '../../models/camshot.model';
import { CamshotService } from '../../services/camshot.service';
export declare class GetCamshotQueryHandler implements IQueryHandler<GetCamshotQuery> {
    private readonly camshotService;
    constructor(camshotService: CamshotService);
    /**
     * Handles the `GetCamshotQuery` to retrieve a camshot entity by its ID.
     *
     * @param query - The `GetCamshotQuery` containing the ID of the camshot to be fetched and optional query options.
     *
     * @returns A promise resolving to the camshot entity (`ICamshot`) if found.
     *
     * @throws {NotFoundException} If the camshot with the specified ID is not found.
     */
    execute(query: GetCamshotQuery): Promise<ICamshot>;
}
