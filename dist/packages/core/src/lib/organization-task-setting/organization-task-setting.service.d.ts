import { IOrganizationTaskSetting, IOrganizationTaskSettingFindInput } from '@gauzy/contracts';
import { TenantAwareCrudService } from '../core/crud';
import { OrganizationTaskSetting } from './organization-task-setting.entity';
import { TypeOrmOrganizationTaskSettingRepository } from './repository/type-orm-organization-task-setting.repository';
import { MikroOrmOrganizationTaskSettingRepository } from './repository/mikro-orm-organization-task-setting.repository';
export declare class OrganizationTaskSettingService extends TenantAwareCrudService<OrganizationTaskSetting> {
    readonly typeOrmOrganizationTaskSettingRepository: TypeOrmOrganizationTaskSettingRepository;
    readonly mikroOrmOrganizationTaskSettingRepository: MikroOrmOrganizationTaskSettingRepository;
    constructor(typeOrmOrganizationTaskSettingRepository: TypeOrmOrganizationTaskSettingRepository, mikroOrmOrganizationTaskSettingRepository: MikroOrmOrganizationTaskSettingRepository);
    /**
     * Find organization task setting.
     *
     * @param options - The options to filter the organization task setting.
     * @returns A Promise resolving to the found organization task setting.
     */
    findByOrganization(options: IOrganizationTaskSettingFindInput): Promise<IOrganizationTaskSetting>;
}
