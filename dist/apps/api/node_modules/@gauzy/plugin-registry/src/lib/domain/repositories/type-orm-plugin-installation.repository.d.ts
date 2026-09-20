import { Repository } from 'typeorm';
import { PluginInstallation } from '../entities/plugin-installation.entity';
export declare class TypeOrmPluginInstallationRepository extends Repository<PluginInstallation> {
    readonly repository: Repository<PluginInstallation>;
    constructor(repository: Repository<PluginInstallation>);
}
