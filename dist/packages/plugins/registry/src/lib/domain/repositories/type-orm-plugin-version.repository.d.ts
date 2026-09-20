import { Repository } from 'typeorm';
import { PluginVersion } from '../entities/plugin-version.entity';
export declare class TypeOrmPluginVersionRepository extends Repository<PluginVersion> {
    readonly repository: Repository<PluginVersion>;
    constructor(repository: Repository<PluginVersion>);
}
