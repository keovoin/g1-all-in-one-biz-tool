import { ICamshot, ID, IPagination } from '@gauzy/contracts';
import { BaseQueryDTO, FindOptionsQueryDTO } from '@gauzy/core';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CountCamshotDTO } from './dtos/count-camshot.dto';
import { CreateCamshotDTO } from './dtos/create-camshot.dto';
import { DeleteCamshotDTO } from './dtos/delete-camshot.dto';
import { FileDTO } from './dtos/file.dto';
export declare class CamshotController {
    private readonly commandBus;
    private readonly queryBus;
    constructor(commandBus: CommandBus, queryBus: QueryBus);
    /**
     * Get a paginated list of camshots.
     *
     * This endpoint allows authorized users to retrieve a paginated list of camshots with optional filtering and sorting.
     * The endpoint supports pagination, filtering, and sorting through the query parameters.
     *
     * @param params - Pagination and filtering parameters for camshots
     * @returns Promise<IPagination<ICamshot>> A Promise that resolves with the paginated list of camshots
     * @throws {UnauthorizedException} If the user is not authorized to access the camshots
     * @throws {ForbiddenException} If the user does not have permission to list camshots
     */
    list(params: BaseQueryDTO<ICamshot>): Promise<IPagination<ICamshot>>;
    /**
     * Create a new camshot record.
     *
     * This endpoint allows authorized users to create a new camshot record by providing the necessary metadata.
     * The camshot file should be uploaded as a form-data file with the key 'file'.
     *
     * @param input - The metadata for the camshot record.
     * @param file - The uploaded camshot file.
     * @returns A Promise that resolves with the details of the created camshot.
     */
    create(input: CreateCamshotDTO, file: FileDTO): Promise<ICamshot>;
    /**
     * GET camshot count in the same tenant.
     *
     * This endpoint retrieves the count of camshots within a specific tenant.
     * It takes query parameters to filter the camshot count by certain criteria.
     *
     * @param options Query parameters to filter the camshot count.
     * @returns A promise resolving to the total count of camshots in the tenant.
     */
    getCount(options: CountCamshotDTO): Promise<number>;
    /**
     * Retrieves a camshot record by its ID.
     *
     * @param id - The UUID of the camshot to retrieve.
     * @param options - Additional query options for finding the camshot.
     * @returns A Promise that resolves with the details of the camshot.
     */
    findById(id: ID, options: FindOptionsQueryDTO<ICamshot>): Promise<ICamshot>;
    /**
     * Recover a soft-deleted plugin source.
     */
    recover(id: ID): Promise<void>;
    /**
     * Delete a camshot record.
     *
     * This endpoint allows authorized users to delete a camshot record by providing the necessary ID.
     *
     * @param id - The ID of the camshot to be deleted.
     * @returns A promise resolving to the result of the deletion operation.
     */
    delete(id: ID, options: DeleteCamshotDTO): Promise<void>;
}
