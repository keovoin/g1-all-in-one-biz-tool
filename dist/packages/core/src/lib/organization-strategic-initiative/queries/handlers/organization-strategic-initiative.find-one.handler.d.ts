import { IQueryHandler } from '@nestjs/cqrs';
import { IOrganizationStrategicInitiative } from '@gauzy/contracts';
import { OrganizationStrategicInitiativeFindOneQuery } from '../organization-strategic-initiative.find-one.query';
import { OrganizationStrategicInitiativeService } from '../../organization-strategic-initiative.service';
export declare class OrganizationStrategicInitiativeFindOneHandler implements IQueryHandler<OrganizationStrategicInitiativeFindOneQuery> {
    private readonly _organizationStrategicInitiativeService;
    constructor(_organizationStrategicInitiativeService: OrganizationStrategicInitiativeService);
    /**
     * Executes the find one query for an organization strategic initiative.
     *
     * @param query - The query containing the ID and options.
     * @returns The found organization strategic initiative.
     */
    execute(query: OrganizationStrategicInitiativeFindOneQuery): Promise<IOrganizationStrategicInitiative>;
}
