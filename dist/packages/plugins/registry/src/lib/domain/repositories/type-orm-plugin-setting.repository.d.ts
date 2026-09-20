import { Repository } from 'typeorm';
import { PluginSetting } from '../entities/plugin-setting.entity';
export declare class TypeOrmPluginSettingRepository extends Repository<PluginSetting> {
    readonly repository: Repository<PluginSetting>;
    constructor(repository: Repository<PluginSetting>);
}
