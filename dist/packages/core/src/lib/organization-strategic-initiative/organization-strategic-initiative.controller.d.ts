import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ID, IOrganizationStrategicInitiative, IOrganizationStrategicInitiativeFindInput, IPagination } from '@gauzy/contracts';
import { CrudController, BaseQueryDTO } from '../core/crud';
import { OrganizationStrategicInitiative } from './organization-strategic-initiative.entity';
import { OrganizationStrategicInitiativeService } from './organization-strategic-initiative.service';
import { CreateOrganizationStrategicInitiativeDTO, UpdateOrganizationStrategicInitiativeDTO, UpdateOrganizationStrategicSignalsDTO } from './dto';
export declare class OrganizationStrategicInitiativeController extends CrudController<OrganizationStrategicInitiative> {
    private readonly _organizationStrategicInitiativeService;
    private readonly _commandBus;
    private readonly _queryBus;
    constructor(_organizationStrategicInitiativeService: OrganizationStrategicInitiativeService, _commandBus: CommandBus, _queryBus: QueryBus);
    /**
     * GET all organization strategic initiatives with optional filters
     *
     * @param params - Query parameters for filtering
     * @returns Paginated list of organization strategic initiatives
     */
    findAll(params: BaseQueryDTO<OrganizationStrategicInitiative> & IOrganizationStrategicInitiativeFindInput): Promise<IPagination<IOrganizationStrategicInitiative>>;
    /**
     * GET organization strategic initiatives by project ID
     *
     * @param projectId - The project ID
     * @returns List of organization strategic initiatives linked to the project
     */
    findByProject(projectId: ID): Promise<IOrganizationStrategicInitiative[]>;
    /**
     * GET an organization strategic initiative by ID
     *
     * @param id - The organization strategic initiative ID
     * @param params - Optional query parameters
     * @returns The organization strategic initiative
     */
    findById(id: ID, params: BaseQueryDTO<OrganizationStrategicInitiative>): Promise<IOrganizationStrategicInitiative>;
    /**
     * CREATE a new organization strategic initiative
     *
     * @param entity - The organization strategic initiative data
     * @returns The created organization strategic initiative
     */
    create(entity: CreateOrganizationStrategicInitiativeDTO): Promise<IOrganizationStrategicInitiative>;
    /**
     * UPDATE an organization strategic initiative by ID
     *
     * @param id - The organization strategic initiative ID
     * @param entity - The updated organization strategic initiative data
     * @returns The updated organization strategic initiative
     */
    update(id: ID, entity: UpdateOrganizationStrategicInitiativeDTO): Promise<IOrganizationStrategicInitiative | UpdateResult>;
    /**
     * UPDATE strategic signals of an organization strategic initiative
     *
     * @param id - The organization strategic initiative ID
     * @param signals - The strategic signals data
     * @returns The updated organization strategic initiative
     */
    updateSignals(id: ID, signals: UpdateOrganizationStrategicSignalsDTO): Promise<IOrganizationStrategicInitiative>;
    /**
     * DELETE an organization strategic initiative by ID
     *
     * @param id - The organization strategic initiative ID
     * @returns Delete result
     */
    delete(id: ID): Promise<DeleteResult>;
}
