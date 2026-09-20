import { IQueryHandler } from '@nestjs/cqrs';
import { IOrganizationStrategicInitiative } from '@gauzy/contracts';
import { OrganizationStrategicInitiativeFindByProjectQuery } from '../organization-strategic-initiative.find-by-project.query';
import { OrganizationStrategicInitiativeService } from '../../organization-strategic-initiative.service';
export declare class OrganizationStrategicInitiativeFindByProjectHandler implements IQueryHandler<OrganizationStrategicInitiativeFindByProjectQuery> {
    private readonly _organizationStrategicInitiativeService;
    constructor(_organizationStrategicInitiativeService: OrganizationStrategicInitiativeService);
    /**
     * Executes the find by project query for organization strategic initiatives.
     *
     * @param query - The query containing the project ID.
     * @returns A list of organization strategic initiatives linked to the project.
     */
    execute(query: OrganizationStrategicInitiativeFindByProjectQuery): Promise<IOrganizationStrategicInitiative[]>;
}
