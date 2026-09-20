import { Repository } from 'typeorm';
import { PluginCategory } from '../entities/plugin-category.entity';
export declare class TypeOrmPluginCategoryRepository extends Repository<PluginCategory> {
    readonly repository: Repository<PluginCategory>;
    constructor(repository: Repository<PluginCategory>);
}
