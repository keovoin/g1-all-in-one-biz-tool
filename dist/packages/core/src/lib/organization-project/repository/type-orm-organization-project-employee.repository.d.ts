import { Repository } from 'typeorm';
import { OrganizationProjectEmployee } from '../organization-project-employee.entity';
export declare class TypeOrmOrganizationProjectEmployeeRepository extends Repository<OrganizationProjectEmployee> {
    readonly repository: Repository<OrganizationProjectEmployee>;
    constructor(repository: Repository<OrganizationProjectEmployee>);
}
