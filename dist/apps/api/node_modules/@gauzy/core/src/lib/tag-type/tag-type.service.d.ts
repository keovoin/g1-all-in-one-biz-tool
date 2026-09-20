import { TenantAwareCrudService } from '../core/crud';
import { TagType } from './tag-type.entity';
import { MikroOrmTagTypeRepository } from './repository/mikro-orm-tag-type.repository';
import { TypeOrmTagTypeRepository } from './repository/type-orm-tag-type.repository';
export declare class TagTypeService extends TenantAwareCrudService<TagType> {
    constructor(typeOrmTagTypeRepository: TypeOrmTagTypeRepository, mikroOrmTagTypeRepository: MikroOrmTagTypeRepository);
}
