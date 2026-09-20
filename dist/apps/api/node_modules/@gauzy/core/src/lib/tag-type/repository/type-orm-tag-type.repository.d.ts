import { Repository } from 'typeorm';
import { TagType } from '../tag-type.entity';
export declare class TypeOrmTagTypeRepository extends Repository<TagType> {
    readonly repository: Repository<TagType>;
    constructor(repository: Repository<TagType>);
}
