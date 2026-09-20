import { Repository } from 'typeorm';
import { OrganizationSprintTaskHistory } from '../organization-sprint-task-history.entity';
export declare class TypeOrmOrganizationSprintTaskHistoryRepository extends Repository<OrganizationSprintTaskHistory> {
    readonly repository: Repository<OrganizationSprintTaskHistory>;
    constructor(repository: Repository<OrganizationSprintTaskHistory>);
}
