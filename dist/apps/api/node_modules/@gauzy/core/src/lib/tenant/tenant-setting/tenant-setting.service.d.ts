import { BadRequestException } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';
import { ID, ITenantSetting, IWasabiFileStorageProviderConfig } from '@gauzy/contracts';
import { TenantAwareCrudService } from './../../core/crud';
import { TenantSetting } from './tenant-setting.entity';
import { TypeOrmTenantSettingRepository } from './repository/type-orm-tenant-setting.repository';
import { MikroOrmTenantSettingRepository } from './repository/mikro-orm-tenant-setting.repository';
export declare class TenantSettingService extends TenantAwareCrudService<TenantSetting> {
    constructor(typeOrmTenantSettingRepository: TypeOrmTenantSettingRepository, mikroOrmTenantSettingRepository: MikroOrmTenantSettingRepository);
    /**
     * Retrieves settings with hierarchical cascade resolution.
     * Priority (highest to lowest): Tenant DB → Global DB (tenantId=NULL) → Environment variables
     *
     * @param {string[]} names - Array of setting names to retrieve.
     * @param {ID} [tenantId] - Optional tenant ID. If not provided, only global and env settings are returned.
     * @param {Record<string, string>} [envDefaults] - Optional environment variable defaults (key = setting name, value = env value).
     * @returns {Promise<Record<string, string>>} - A key-value pair object with resolved settings.
     */
    getResolvedSettings(names: string[], tenantId?: ID, envDefaults?: Record<string, string>): Promise<Record<string, string>>;
    /**
     * Saves or updates global settings in the database (tenantId = NULL).
     *
     * @param {ITenantSetting} input - An object containing settings where keys are setting names and values are setting values.
     * @returns {Promise<ITenantSetting>} - Returns the updated settings as a key-value object.
     */
    saveGlobalSettings(input: ITenantSetting): Promise<ITenantSetting>;
    /**
     * Retrieves global settings from the database (tenantId = NULL).
     *
     * @param {string[]} [names] - Optional array of setting names to retrieve. If not provided, all global settings are returned.
     * @returns {Promise<Record<string, any>>} - A key-value pair object with global settings.
     */
    getGlobalSettings(names?: string[]): Promise<Record<string, any>>;
    /**
     * Retrieves tenant settings from the database based on the ORM type being used.
     *
     * @param {FindManyOptions} [request] - Optional query options for filtering settings.
     * @returns {Promise<Record<string, any>>} - A key-value pair object where keys are setting names and values are setting values.
     *
     * @throws {Error} - Throws an error if the ORM type is not implemented.
     */
    getSettings(request?: FindManyOptions<TenantSetting>): Promise<Record<string, any>>;
    /**
     * Saves or updates tenant settings in the database.
     *
     * @param {ITenantSetting} input - An object containing tenant settings where keys are setting names and values are setting values.
     * @param {ID} tenantId - The unique identifier of the tenant.
     * @returns {Promise<ITenantSetting>} - Returns the updated settings as a key-value object.
     *
     * @throws {Error} - Throws an error if the operation fails.
     */
    saveSettings(input: ITenantSetting, tenantId: ID): Promise<ITenantSetting>;
    /**
     * Verify Wasabi Configuration
     * @param entity - Configuration details for Wasabi
     * @returns Promise containing the verification status
     */
    verifyWasabiConfiguration(entity: IWasabiFileStorageProviderConfig): Promise<Object | BadRequestException>;
}
