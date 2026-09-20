import { ID, IPagination, ISoundshot } from '@gauzy/contracts';
import { FindOptionsQueryDTO } from '@gauzy/core';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CountSoundshotDTO } from './dtos/count-soundshot.dto';
import { CreateSoundshotDTO } from './dtos/create-soundshot.dto';
import { DeleteSoundshotDTO } from './dtos/delete-soundshot.dto';
import { FileDTO } from './dtos/file.dto';
import { GetSoundshotsQueryDTO } from './dtos/get-soundshots-query.dto';
import { SoundshotService } from './services/soundshot.service';
export declare class SoundshotController {
    private readonly commandBus;
    private readonly queryBus;
    private readonly soundshotService;
    constructor(commandBus: CommandBus, queryBus: QueryBus, soundshotService: SoundshotService);
    /**
     * Get a paginated list of soundshots.
     *
     * This endpoint allows authorized users to retrieve a paginated list of soundshots with optional filtering and sorting.
     * The endpoint supports pagination, filtering, and sorting through the query parameters.
     *
     * @param params - Pagination and filtering parameters for soundshots
     * @returns Promise<IPagination<ISoundshot>> A Promise that resolves with the paginated list of soundshots
     * @throws {UnauthorizedException} If the user is not authorized to access the soundshots
     * @throws {ForbiddenException} If the user does not have permission to list soundshots
     */
    list(params: GetSoundshotsQueryDTO): Promise<IPagination<ISoundshot>>;
    /**
     * Create a new soundshot record.
     *
     * This endpoint allows authorized users to create a new soundshot record by providing the necessary metadata.
     * The soundshot file should be uploaded as a form-data file with the key 'file'.
     *
     * @param input - The metadata for the soundshot record.
     * @param file - The uploaded soundshot file.
     * @returns A Promise that resolves with the details of the created soundshot.
     */
    create(input: CreateSoundshotDTO, file: FileDTO): Promise<ISoundshot>;
    /**
     * GET soundshot count in the same tenant.
     *
     * This endpoint retrieves the count of soundshots within a specific tenant.
     * It takes query parameters to filter the soundshot count by certain criteria.
     *
     * @param options Query parameters to filter the soundshot count.
     * @returns A promise resolving to the total count of soundshots in the tenant.
     */
    getCount(options: CountSoundshotDTO): Promise<number>;
    /**
     * Retrieves a soundshot record by its ID.
     *
     * @param id - The UUID of the soundshot to retrieve.
     * @param options - Additional query options for finding the soundshot.
     * @returns A Promise that resolves with the details of the soundshot.
     */
    findById(id: ID, options: FindOptionsQueryDTO<ISoundshot>): Promise<ISoundshot>;
    /**
     * Recover a soft-deleted soundshot.
     */
    recover(id: ID): Promise<ISoundshot>;
    /**
     * Delete a soundshot record.
     *
     * This endpoint allows authorized users to delete a soundshot record by providing the necessary ID.
     *
     * @param id - The ID of the soundshot to be deleted.
     * @returns A promise resolving to the result of the deletion operation.
     */
    delete(id: ID, options: DeleteSoundshotDTO): Promise<void>;
}
