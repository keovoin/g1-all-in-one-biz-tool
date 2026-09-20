"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantSettingService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const underscore_1 = require("underscore");
const client_s3_1 = require("@aws-sdk/client-s3");
const crud_1 = require("./../../core/crud");
const utils_1 = require("../../core/utils");
const tenant_setting_entity_1 = require("./tenant-setting.entity");
const type_orm_tenant_setting_repository_1 = require("./repository/type-orm-tenant-setting.repository");
const mikro_orm_tenant_setting_repository_1 = require("./repository/mikro-orm-tenant-setting.repository");
let TenantSettingService = class TenantSettingService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmTenantSettingRepository, mikroOrmTenantSettingRepository) {
        super(typeOrmTenantSettingRepository, mikroOrmTenantSettingRepository);
    }
    /**
     * Retrieves settings with hierarchical cascade resolution.
     * Priority (highest to lowest): Tenant DB → Global DB (tenantId=NULL) → Environment variables
     *
     * @param {string[]} names - Array of setting names to retrieve.
     * @param {ID} [tenantId] - Optional tenant ID. If not provided, only global and env settings are returned.
     * @param {Record<string, string>} [envDefaults] - Optional environment variable defaults (key = setting name, value = env value).
     * @returns {Promise<Record<string, string>>} - A key-value pair object with resolved settings.
     */
    async getResolvedSettings(names, tenantId, envDefaults) {
        // Start with environment defaults
        const resolvedSettings = { ...(envDefaults || {}) };
        // Fetch global settings (tenantId = NULL)
        let globalSettings;
        switch (this.ormType) {
            case utils_1.MultiORMEnum.MikroORM: {
                const { where: globalWhere, mikroOptions: globalMikroOptions } = (0, utils_1.parseTypeORMFindToMikroOrm)({
                    where: { name: (0, typeorm_1.In)(names), tenantId: (0, typeorm_1.IsNull)() }
                });
                const globalItems = await this.mikroOrmRepository.find(globalWhere, globalMikroOptions);
                globalSettings = globalItems.map((entity) => this.serialize(entity));
                break;
            }
            case utils_1.MultiORMEnum.TypeORM: {
                globalSettings = await this.typeOrmRepository.find({
                    where: { name: (0, typeorm_1.In)(names), tenantId: (0, typeorm_1.IsNull)() }
                });
                break;
            }
            default:
                throw new Error(`Not implemented for ${this.ormType}`);
        }
        // Override with global DB settings
        for (const setting of globalSettings) {
            if (setting.value !== undefined && setting.value !== null) {
                resolvedSettings[setting.name] = setting.value;
            }
        }
        // If tenantId is provided, fetch tenant-specific settings
        if (tenantId) {
            let tenantSettings;
            switch (this.ormType) {
                case utils_1.MultiORMEnum.MikroORM: {
                    const { where: tenantWhere, mikroOptions: tenantMikroOptions } = (0, utils_1.parseTypeORMFindToMikroOrm)({
                        where: { name: (0, typeorm_1.In)(names), tenantId: tenantId }
                    });
                    const tenantItems = await this.mikroOrmRepository.find(tenantWhere, tenantMikroOptions);
                    tenantSettings = tenantItems.map((entity) => this.serialize(entity));
                    break;
                }
                case utils_1.MultiORMEnum.TypeORM: {
                    tenantSettings = await this.typeOrmRepository.find({
                        where: { name: (0, typeorm_1.In)(names), tenantId: tenantId }
                    });
                    break;
                }
                default:
                    throw new Error(`Not implemented for ${this.ormType}`);
            }
            // Override with tenant-specific settings
            for (const setting of tenantSettings) {
                if (setting.value !== undefined && setting.value !== null) {
                    resolvedSettings[setting.name] = setting.value;
                }
            }
        }
        return resolvedSettings;
    }
    /**
     * Saves or updates global settings in the database (tenantId = NULL).
     *
     * @param {ITenantSetting} input - An object containing settings where keys are setting names and values are setting values.
     * @returns {Promise<ITenantSetting>} - Returns the updated settings as a key-value object.
     */
    async saveGlobalSettings(input) {
        let settings;
        switch (this.ormType) {
            case utils_1.MultiORMEnum.MikroORM: {
                const { where, mikroOptions } = (0, utils_1.parseTypeORMFindToMikroOrm)({
                    where: { name: (0, typeorm_1.In)((0, underscore_1.keys)(input)), tenantId: (0, typeorm_1.IsNull)() }
                });
                const items = await this.mikroOrmRepository.find(where, mikroOptions);
                settings = items.map((entity) => this.serialize(entity));
                break;
            }
            case utils_1.MultiORMEnum.TypeORM: {
                settings = await this.typeOrmRepository.find({
                    where: { name: (0, typeorm_1.In)((0, underscore_1.keys)(input)), tenantId: (0, typeorm_1.IsNull)() }
                });
                break;
            }
            default:
                throw new Error(`Not implemented for ${this.ormType}`);
        }
        const settingsByName = (0, underscore_1.indexBy)(settings, 'name');
        const saveInput = [];
        for (const key in input) {
            if (Object.prototype.hasOwnProperty.call(input, key)) {
                const setting = settingsByName[key];
                if (setting !== undefined) {
                    setting.value = input[key];
                    saveInput.push(setting);
                }
                else {
                    saveInput.push(new tenant_setting_entity_1.TenantSetting({
                        value: input[key],
                        name: key,
                        tenantId: null
                    }));
                }
            }
        }
        switch (this.ormType) {
            case utils_1.MultiORMEnum.MikroORM: {
                await this.mikroOrmRepository.getEntityManager().persistAndFlush(saveInput);
                break;
            }
            case utils_1.MultiORMEnum.TypeORM: {
                await this.typeOrmRepository.save(saveInput);
                break;
            }
            default:
                throw new Error(`Not implemented for ${this.ormType}`);
        }
        return (0, underscore_1.object)((0, underscore_1.pluck)(saveInput, 'name'), (0, underscore_1.pluck)(saveInput, 'value'));
    }
    /**
     * Retrieves global settings from the database (tenantId = NULL).
     *
     * @param {string[]} [names] - Optional array of setting names to retrieve. If not provided, all global settings are returned.
     * @returns {Promise<Record<string, any>>} - A key-value pair object with global settings.
     */
    async getGlobalSettings(names) {
        const whereClause = { tenantId: (0, typeorm_1.IsNull)() };
        if (names && names.length > 0) {
            whereClause.name = (0, typeorm_1.In)(names);
        }
        let settings;
        switch (this.ormType) {
            case utils_1.MultiORMEnum.MikroORM: {
                const { where, mikroOptions } = (0, utils_1.parseTypeORMFindToMikroOrm)({
                    where: whereClause
                });
                const items = await this.mikroOrmRepository.find(where, mikroOptions);
                settings = items.map((entity) => this.serialize(entity));
                break;
            }
            case utils_1.MultiORMEnum.TypeORM: {
                settings = await this.typeOrmRepository.find({ where: whereClause });
                break;
            }
            default:
                throw new Error(`Not implemented for ${this.ormType}`);
        }
        return (0, underscore_1.object)((0, underscore_1.pluck)(settings, 'name'), (0, underscore_1.pluck)(settings, 'value'));
    }
    /**
     * Retrieves tenant settings from the database based on the ORM type being used.
     *
     * @param {FindManyOptions} [request] - Optional query options for filtering settings.
     * @returns {Promise<Record<string, any>>} - A key-value pair object where keys are setting names and values are setting values.
     *
     * @throws {Error} - Throws an error if the ORM type is not implemented.
     */
    async getSettings(request) {
        let settings;
        switch (this.ormType) {
            case utils_1.MultiORMEnum.MikroORM: {
                const { where, mikroOptions } = (0, utils_1.parseTypeORMFindToMikroOrm)(request);
                const items = await this.mikroOrmRepository.find(where, mikroOptions);
                settings = items.map((entity) => this.serialize(entity));
                break;
            }
            case utils_1.MultiORMEnum.TypeORM: {
                settings = await this.typeOrmRepository.find(request);
                break;
            }
            default:
                throw new Error(`Not implemented for ${this.ormType}`);
        }
        return (0, underscore_1.object)((0, underscore_1.pluck)(settings, 'name'), (0, underscore_1.pluck)(settings, 'value'));
    }
    /**
     * Saves or updates tenant settings in the database.
     *
     * @param {ITenantSetting} input - An object containing tenant settings where keys are setting names and values are setting values.
     * @param {ID} tenantId - The unique identifier of the tenant.
     * @returns {Promise<ITenantSetting>} - Returns the updated settings as a key-value object.
     *
     * @throws {Error} - Throws an error if the operation fails.
     */
    async saveSettings(input, tenantId) {
        let settings;
        switch (this.ormType) {
            case utils_1.MultiORMEnum.MikroORM: {
                const { where, mikroOptions } = (0, utils_1.parseTypeORMFindToMikroOrm)({
                    where: { name: (0, typeorm_1.In)((0, underscore_1.keys)(input)), tenantId }
                });
                const items = await this.mikroOrmRepository.find(where, mikroOptions);
                settings = items.map((entity) => this.serialize(entity));
                break;
            }
            case utils_1.MultiORMEnum.TypeORM: {
                settings = await this.typeOrmRepository.findBy({ name: (0, typeorm_1.In)((0, underscore_1.keys)(input)), tenantId });
                break;
            }
            default:
                throw new Error(`Not implemented for ${this.ormType}`);
        }
        const settingsByName = (0, underscore_1.indexBy)(settings, 'name');
        const saveInput = [];
        for (const key in input) {
            if (Object.prototype.hasOwnProperty.call(input, key)) {
                const setting = settingsByName[key];
                if (setting !== undefined) {
                    setting.value = input[key];
                    saveInput.push(setting);
                }
                else {
                    saveInput.push(new tenant_setting_entity_1.TenantSetting({
                        value: input[key],
                        name: key,
                        tenantId
                    }));
                }
            }
        }
        switch (this.ormType) {
            case utils_1.MultiORMEnum.MikroORM: {
                await this.mikroOrmRepository.getEntityManager().persistAndFlush(saveInput);
                break;
            }
            case utils_1.MultiORMEnum.TypeORM: {
                await this.typeOrmRepository.save(saveInput);
                break;
            }
            default:
                throw new Error(`Not implemented for ${this.ormType}`);
        }
        return (0, underscore_1.object)((0, underscore_1.pluck)(saveInput, 'name'), (0, underscore_1.pluck)(saveInput, 'value'));
    }
    /**
     * Verify Wasabi Configuration
     * @param entity - Configuration details for Wasabi
     * @returns Promise containing the verification status
     */
    async verifyWasabiConfiguration(entity) {
        // Validate the input data (You can use class-validator for validation)
        if (!entity.wasabi_aws_access_key_id || !entity.wasabi_aws_secret_access_key) {
            throw new common_1.HttpException('Please include the required parameters as some are missing in your request.', common_1.HttpStatus.BAD_REQUEST);
        }
        // Create S3 wasabi endpoint
        const endpoint = entity.wasabi_aws_service_url;
        // Create S3 wasabi region
        const region = entity.wasabi_aws_default_region;
        // Create S3 client service object
        const s3Client = new client_s3_1.S3Client({
            credentials: {
                accessKeyId: entity.wasabi_aws_access_key_id,
                secretAccessKey: entity.wasabi_aws_secret_access_key
            },
            region,
            endpoint,
            /**
             * Whether to force path style URLs for S3 objects
             * (e.g., https://s3.amazonaws.com/<bucketName>/<key> instead of https://<bucketName>.s3.amazonaws.com/<key>
             */
            forcePathStyle: entity.wasabi_aws_force_path_style
        });
        // Create the parameters for calling createBucket
        const params = {
            Bucket: entity.wasabi_aws_bucket
        };
        try {
            // call S3 to create the bucket
            const data = await s3Client.send(new client_s3_1.CreateBucketCommand(params));
            return new Object({
                status: common_1.HttpStatus.CREATED,
                message: `${entity.wasabi_aws_bucket} is created successfully in ${entity.wasabi_aws_default_region}`,
                data
            });
        }
        catch (error) {
            console.log('Error while creating wasabi bucket: %s', params.Bucket);
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST, {
                description: `Error while creating wasabi bucket: ${params.Bucket}`
            });
        }
    }
};
exports.TenantSettingService = TenantSettingService;
exports.TenantSettingService = TenantSettingService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_tenant_setting_repository_1.TypeOrmTenantSettingRepository,
        mikro_orm_tenant_setting_repository_1.MikroOrmTenantSettingRepository])
], TenantSettingService);
//# sourceMappingURL=tenant-setting.service.js.map