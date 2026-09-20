import { IPagination } from '@gauzy/contracts';
import { IQueryHandler } from '@nestjs/cqrs';
import { ICamshot } from '../../models/camshot.model';
import { CamshotService } from '../../services/camshot.service';
import { ListCamshotQuery } from '../list-camshot.query';
export declare class ListCamshotQueryHandler implements IQueryHandler<ListCamshotQuery> {
    private readonly camshotService;
    constructor(camshotService: CamshotService);
    /**
     * Handles the ListCamshotQuery and returns a paginated list of camshots.
     *
     * @param query - The query containing pagination and filtering parameters for camshots
     * @returns Promise<IPagination<ICamshot>> A paginated list of camshots
     */
    execute(query: ListCamshotQuery): Promise<IPagination<ICamshot>>;
}
