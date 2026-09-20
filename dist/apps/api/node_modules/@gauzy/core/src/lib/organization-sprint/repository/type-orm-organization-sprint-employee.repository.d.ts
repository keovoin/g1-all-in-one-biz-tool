import { Repository } from 'typeorm';
import { OrganizationSprintEmployee } from '../organization-sprint-employee.entity';
export declare class TypeOrmOrganizationSprintEmployeeRepository extends Repository<OrganizationSprintEmployee> {
    readonly repository: Repository<OrganizationSprintEmployee>;
    constructor(repository: Repository<OrganizationSprintEmployee>);
}
