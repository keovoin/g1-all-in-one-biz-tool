import { CommandBus } from '@nestjs/cqrs';
import { DeleteResult } from 'typeorm';
import { ID, IPagination } from '@gauzy/contracts';
import { CrudController, BaseQueryDTO } from '../core/crud';
import { Dashboard } from './dashboard.entity';
import { DashboardService } from './dashboard.service';
import { CreateDashboardDTO, UpdateDashboardDTO } from './dto';
export declare class DashboardController extends CrudController<Dashboard> {
    private readonly dashboardService;
    private readonly commandBus;
    constructor(dashboardService: DashboardService, commandBus: CommandBus);
    /**
     * Retrieves a list of dashboards with pagination.
     *
     * @param params - The pagination and filter parameters.
     * @returns A paginated list of dashboards.
     */
    findAll(params: BaseQueryDTO<Dashboard>): Promise<IPagination<Dashboard>>;
    /**
     * Retrieves a dashboard by its unique identifier.
     *
     * @param id - The unique identifier of the dashboard.
     * @param params - Additional query parameters for pagination or filtering.
     * @returns The dashboard entity if found.
     */
    findById(id: ID, params: BaseQueryDTO<Dashboard>): Promise<Dashboard>;
    /**
     * Creates a new dashboard.
     *
     * @param entity - The data transfer object containing the details of the dashboard to be created.
     * @returns The created dashboard entity.
     */
    create(entity: CreateDashboardDTO): Promise<Dashboard>;
    /**
     * Updates an existing dashboard.
     *
     * @param id - The UUID of the dashboard to be updated.
     * @param entity - The data transfer object containing the updated details of the dashboard.
     * @returns The updated dashboard entity.
     */
    update(id: ID, entity: UpdateDashboardDTO): Promise<Dashboard>;
    /**
     * Deletes a dashboard by its ID.
     *
     * @param id - The UUID of the dashboard to delete.
     * @returns The result of the delete operation.
     */
    delete(id: ID): Promise<DeleteResult>;
}
