import { OrganizationProjectModuleEmployee } from '../organization-project-module-employee.entity';
import { Repository } from 'typeorm';
export declare class TypeOrmOrganizationProjectModuleEmployeeRepository extends Repository<OrganizationProjectModuleEmployee> {
    readonly repository: Repository<OrganizationProjectModuleEmployee>;
    constructor(repository: Repository<OrganizationProjectModuleEmployee>);
}
