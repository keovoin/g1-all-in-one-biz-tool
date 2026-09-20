import { TenantAwareCrudService } from '@gauzy/core';
import { PluginInstallation } from '../entities/plugin-installation.entity';
import { MikroOrmPluginInstallationRepository } from '../repositories/mikro-orm-plugin-installation.repository';
import { TypeOrmPluginInstallationRepository } from '../repositories/type-orm-plugin-installation.repository';
export declare class PluginInstallationService extends TenantAwareCrudService<PluginInstallation> {
    readonly typeOrmPluginInstallationRepository: TypeOrmPluginInstallationRepository;
    readonly mikroOrmPluginInstallationRepository: MikroOrmPluginInstallationRepository;
    constructor(typeOrmPluginInstallationRepository: TypeOrmPluginInstallationRepository, mikroOrmPluginInstallationRepository: MikroOrmPluginInstallationRepository);
}
