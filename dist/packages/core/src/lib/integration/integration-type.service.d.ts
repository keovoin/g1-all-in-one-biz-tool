import { CrudService } from '../core/crud';
import { TypeOrmIntegrationTypeRepository } from './repository/type-orm-integration-type.repository';
import { MikroOrmIntegrationTypeRepository } from './repository/mikro-orm-integration-type.repository';
import { IntegrationType } from './integration-type.entity';
export declare class IntegrationTypeService extends CrudService<IntegrationType> {
    constructor(typeOrmIntegrationTypeRepository: TypeOrmIntegrationTypeRepository, mikroOrmIntegrationTypeRepository: MikroOrmIntegrationTypeRepository);
}
