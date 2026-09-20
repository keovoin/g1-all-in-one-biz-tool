"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationEntitySettingService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../core/crud");
const mikro_orm_integration_entity_setting_repository_1 = require("./repository/mikro-orm-integration-entity-setting.repository");
const type_orm_integration_entity_setting_repository_1 = require("./repository/type-orm-integration-entity-setting.repository");
let IntegrationEntitySettingService = class IntegrationEntitySettingService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmIntegrationEntitySettingRepository, mikroOrmIntegrationEntitySettingRepository) {
        super(typeOrmIntegrationEntitySettingRepository, mikroOrmIntegrationEntitySettingRepository);
        this.typeOrmIntegrationEntitySettingRepository = typeOrmIntegrationEntitySettingRepository;
        this.mikroOrmIntegrationEntitySettingRepository = mikroOrmIntegrationEntitySettingRepository;
    }
    /**
     * Get integration entity settings by integration ID.
     *
     * @param integrationId - The ID of the integration.
     * @returns A promise resolving to an array of integration entity settings.
     */
    async getIntegrationEntitySettings(integrationId) {
        return await super.findAll({
            where: {
                integrationId
            },
            relations: {
                integration: true,
                tiedEntities: true
            }
        });
    }
    /**
     * Create or update integration entity settings in bulk by integration.
     *
     * @param input - An individual IIntegrationEntitySetting or an array of IIntegrationEntitySetting objects to be created or updated.
     * @returns A promise resolving to an array of created or updated IIntegrationEntitySetting objects.
     */
    async bulkUpdateOrCreate(input) {
        // Prepare an array of settings to be saved
        const settings = Array.isArray(input) ? input : [input];
        // Save the new settings to the database
        return await this.typeOrmIntegrationEntitySettingRepository.save(settings);
    }
};
exports.IntegrationEntitySettingService = IntegrationEntitySettingService;
exports.IntegrationEntitySettingService = IntegrationEntitySettingService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_integration_entity_setting_repository_1.TypeOrmIntegrationEntitySettingRepository,
        mikro_orm_integration_entity_setting_repository_1.MikroOrmIntegrationEntitySettingRepository])
], IntegrationEntitySettingService);
//# sourceMappingURL=integration-entity-setting.service.js.map