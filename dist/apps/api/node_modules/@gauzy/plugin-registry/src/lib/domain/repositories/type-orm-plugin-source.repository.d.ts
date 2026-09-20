import { Repository } from 'typeorm';
import { PluginSource } from '../entities/plugin-source.entity';
export declare class TypeOrmPluginSourceRepository extends Repository<PluginSource> {
    readonly repository: Repository<PluginSource>;
    constructor(repository: Repository<PluginSource>);
}
