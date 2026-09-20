import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { DeleteResult } from 'typeorm';
import { IPagination, IOrganizationTeam, ID } from '@gauzy/contracts';
import { CrudController, BaseQueryDTO } from './../core/crud';
import { CountQueryDTO, DeleteQueryDTO } from './../shared/dto';
import { CreateOrganizationTeamDTO, OrganizationTeamStatisticDTO, UpdateOrganizationTeamDTO } from './dto';
import { OrganizationTeam } from './organization-team.entity';
import { OrganizationTeamService } from './organization-team.service';
export declare class OrganizationTeamController extends CrudController<OrganizationTeam> {
    private readonly _commandBus;
    private readonly _queryBus;
    private readonly _organizationTeamService;
    constructor(_commandBus: CommandBus, _queryBus: QueryBus, _organizationTeamService: OrganizationTeamService);
    /**
     * GET find my organization teams
     *
     * @param data
     * @returns
     */
    findMyTeams(params: BaseQueryDTO<OrganizationTeam>): Promise<IPagination<IOrganizationTeam>>;
    /**
     * GET organization team count
     *
     * @param options
     * @returns
     */
    getCount(options: CountQueryDTO<OrganizationTeam>): Promise<number>;
    /**
     * GET organization teams by pagination
     *
     * @param params
     * @returns
     */
    pagination(params: BaseQueryDTO<OrganizationTeam>): Promise<IPagination<IOrganizationTeam>>;
    /**
     * GET organization teams
     *
     * @param params
     * @returns
     */
    findAll(params: BaseQueryDTO<OrganizationTeam>): Promise<IPagination<IOrganizationTeam>>;
    /**
     * Find team by primary ID
     *
     * @param id - The primary ID of the organization team.
     * @param query - Query parameters for team statistics.
     * @returns The result of the team statistics query.
     */
    findById(id: ID, options: OrganizationTeamStatisticDTO): Promise<IOrganizationTeam>;
    /**
     * CREATE organization team
     *
     * @param entity
     * @returns
     */
    create(entity: CreateOrganizationTeamDTO): Promise<IOrganizationTeam>;
    /**
     * UPDATE organization team by id
     *
     * @param id
     * @param entity
     * @returns
     */
    update(id: ID, entity: UpdateOrganizationTeamDTO): Promise<IOrganizationTeam>;
    /**
     * Delete organization team
     *
     * @param id
     * @returns
     */
    delete(teamId: ID, options: DeleteQueryDTO<OrganizationTeam>): Promise<DeleteResult | IOrganizationTeam>;
    /**
     * Exist from teams where users joined as a team members.
     *
     * @param userId
     * @returns
     */
    existTeamsAsMember(userId: ID): Promise<DeleteResult>;
}
