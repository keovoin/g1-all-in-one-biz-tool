import { CommandBus } from '@nestjs/cqrs';
import { DeleteResult } from 'typeorm';
import { IResourceLink, IResourceLinkUpdateInput, ID, IPagination } from '@gauzy/contracts';
import { CrudController, FindOptionsQueryDTO, BaseQueryDTO } from './../core/crud';
import { ResourceLink } from './resource-link.entity';
import { ResourceLinkService } from './resource-link.service';
import { CreateResourceLinkDTO, UpdateResourceLinkDTO } from './dto';
export declare class ResourceLinkController extends CrudController<ResourceLink> {
    private readonly resourceLinkService;
    private readonly commandBus;
    constructor(resourceLinkService: ResourceLinkService, commandBus: CommandBus);
    /**
     * @description Retrieves all resource links, optionally filtered by type.
     * This endpoint supports pagination and returns a list of resource links.
     *
     * @param {BaseQueryDTO<ResourceLink>} params - The pagination and filter parameters.
     * @returns {Promise<IPagination<IResourceLink>>} - A promise that resolves to a paginated list of resource links.
     * @memberof ResourceLinkController
     */
    findAll(params: BaseQueryDTO<ResourceLink>): Promise<IPagination<IResourceLink>>;
    /**
     * @description Retrieves a single resource link by its ID.
     * This endpoint returns a resource link by its unique identifier, optionally filtered by query parameters.
     *
     * @param {ID} id - The unique identifier of the resource link to retrieve.
     * @param {FindOptionsQueryDTO<ResourceLink>} params - The optional query parameters for filtering or additional options.
     * @returns {Promise<ResourceLink>} - A promise that resolves to the found resource link.
     * @memberof ResourceLinkController
     */
    findById(id: ID, // Validate and retrieve the ID parameter
    params: FindOptionsQueryDTO<ResourceLink>): Promise<ResourceLink>;
    /**
     * @description Creates a new resource link.
     * This endpoint receives the data for a resource link, validates it, and creates a new record.
     *
     * @param {CreateResourceLinkDTO} entity - The data to create a new resource link.
     * @returns {Promise<IResourceLink>} - A promise that resolves to the created resource link.
     * @memberof ResourceLinkController
     */
    create(entity: CreateResourceLinkDTO): Promise<IResourceLink>;
    /**
     * @description Updates an existing resource link by its ID.
     * This endpoint receives the updated data for a resource link and updates the record in the database.
     *
     * @param {ID} id - The unique identifier of the resource link to update.
     * @param {UpdateResourceLinkDTO} entity - The data to update the resource link.
     * @returns {Promise<IResourceLinkUpdateInput>} - A promise that resolves to the updated resource link.
     * @memberof ResourceLinkController
     */
    update(id: ID, entity: UpdateResourceLinkDTO): Promise<IResourceLinkUpdateInput>;
    /**
     * @description Deletes a resource link by its ID.
     * This endpoint deletes an existing resource link record from the database.
     *
     * @param {ID} id - The unique identifier of the resource link to delete.
     * @returns {Promise<DeleteResult>} - A promise that resolves to the result of the delete operation.
     * @memberof ResourceLinkController
     */
    delete(id: ID): Promise<DeleteResult>;
}
