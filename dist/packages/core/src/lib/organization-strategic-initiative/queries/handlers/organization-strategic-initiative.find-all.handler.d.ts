import { IQueryHandler } from '@nestjs/cqrs';
import { IOrganizationStrategicInitiative, IPagination } from '@gauzy/contracts';
import { OrganizationStrategicInitiativeFindAllQuery } from '../organization-strategic-initiative.find-all.query';
import { OrganizationStrategicInitiativeService } from '../../organization-strategic-initiative.service';
export declare class OrganizationStrategicInitiativeFindAllHandler implements IQueryHandler<OrganizationStrategicInitiativeFindAllQuery> {
    private readonly _organizationStrategicInitiativeService;
    constructor(_organizationStrategicInitiativeService: OrganizationStrategicInitiativeService);
    /**
     * Executes the find all query for organization strategic initiatives.
     *
     * @param query - The query containing filter options.
     * @returns A paginated list of organization strategic initiatives.
     */
    execute(query: OrganizationStrategicInitiativeFindAllQuery): Promise<IPagination<IOrganizationStrategicInitiative>>;
}
