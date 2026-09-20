import { Repository } from 'typeorm';
import { OrganizationStrategicInitiative } from '../organization-strategic-initiative.entity';
export declare class TypeOrmOrganizationStrategicInitiativeRepository extends Repository<OrganizationStrategicInitiative> {
    readonly repository: Repository<OrganizationStrategicInitiative>;
    constructor(repository: Repository<OrganizationStrategicInitiative>);
}
