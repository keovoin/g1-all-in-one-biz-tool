"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationSettingService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../core/crud");
const type_orm_integration_setting_repository_1 = require("./repository/type-orm-integration-setting.repository");
const mikro_orm_integration_setting_repository_1 = require("./repository/mikro-orm-integration-setting.repository");
let IntegrationSettingService = class IntegrationSettingService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmIntegrationSettingRepository, mikroOrmIntegrationSettingRepository) {
        super(typeOrmIntegrationSettingRepository, mikroOrmIntegrationSettingRepository);
        this.typeOrmIntegrationSettingRepository = typeOrmIntegrationSettingRepository;
        this.mikroOrmIntegrationSettingRepository = mikroOrmIntegrationSettingRepository;
    }
    /**
     * Bulk update or create integration settings for a specific integration.
     *
     * @param integrationId - The identifier of the integration for which settings are updated or created.
     * @param input - An array of integration settings or a single integration setting to update or create.
     * @returns {Promise<IIntegrationSetting[]>} - A promise that resolves with an array of updated or created integration settings.
     */
    async bulkUpdateOrCreate(integrationId, input) {
        try {
            // Delete existing settings for the given integration
            await this.delete({ integrationId });
            // Prepare an array of settings to be saved
            const settings = Array.isArray(input) ? input : [input];
            // Save the new settings to the database
            return await this.typeOrmIntegrationSettingRepository.save(settings);
        }
        catch (error) {
            // Handle any errors that occur during the bulk update or create process
            console.error('Bulk update or create of integration settings failed:', error);
        }
    }
};
exports.IntegrationSettingService = IntegrationSettingService;
exports.IntegrationSettingService = IntegrationSettingService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_integration_setting_repository_1.TypeOrmIntegrationSettingRepository,
        mikro_orm_integration_setting_repository_1.MikroOrmIntegrationSettingRepository])
], IntegrationSettingService);
//# sourceMappingURL=integration-setting.service.js.map