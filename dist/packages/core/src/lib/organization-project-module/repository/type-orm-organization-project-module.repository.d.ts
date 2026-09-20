import { Repository } from 'typeorm';
import { OrganizationProjectModule } from '../organization-project-module.entity';
export declare class TypeOrmOrganizationProjectModuleRepository extends Repository<OrganizationProjectModule> {
    readonly repository: Repository<OrganizationProjectModule>;
    constructor(repository: Repository<OrganizationProjectModule>);
}
