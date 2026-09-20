import { Repository } from 'typeorm';
import { OrganizationSprintTask } from '../organization-sprint-task.entity';
export declare class TypeOrmOrganizationSprintTaskRepository extends Repository<OrganizationSprintTask> {
    readonly repository: Repository<OrganizationSprintTask>;
    constructor(repository: Repository<OrganizationSprintTask>);
}
