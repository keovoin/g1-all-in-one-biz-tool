import { Repository } from 'typeorm';
import { Plugin } from '../entities/plugin.entity';
export declare class TypeOrmPluginRepository extends Repository<Plugin> {
    readonly repository: Repository<Plugin>;
    constructor(repository: Repository<Plugin>);
}
