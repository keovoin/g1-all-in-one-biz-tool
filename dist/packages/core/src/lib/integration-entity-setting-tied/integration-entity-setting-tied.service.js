"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationEntitySettingTiedService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../core/crud");
const mikro_orm_integration_entity_setting_tied_repository_1 = require("./repository/mikro-orm-integration-entity-setting-tied.repository");
const type_orm_integration_entity_setting_tied_repository_1 = require("./repository/type-orm-integration-entity-setting-tied.repository");
let IntegrationEntitySettingTiedService = class IntegrationEntitySettingTiedService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmIntegrationEntitySettingTiedRepository, mikroOrmIntegrationEntitySettingTiedRepository) {
        super(typeOrmIntegrationEntitySettingTiedRepository, mikroOrmIntegrationEntitySettingTiedRepository);
        this.typeOrmIntegrationEntitySettingTiedRepository = typeOrmIntegrationEntitySettingTiedRepository;
        this.mikroOrmIntegrationEntitySettingTiedRepository = mikroOrmIntegrationEntitySettingTiedRepository;
    }
    /**
     * Create or update bulk integration entity settings tied entities by integration.
     *
     * @param input - The integration entity setting tied input data, either a single entity or an array of entities.
     * @returns A promise that resolves to an array of created or updated IIntegrationEntitySettingTied instances.
     */
    async bulkUpdateOrCreate(input) {
        // Ensure that the input is always an array for consistency
        const settings = Array.isArray(input) ? input : [input];
        // Save the array of integration entity settings to the database
        const savedSettings = await this.typeOrmIntegrationEntitySettingTiedRepository.save(settings);
        // Return the array of created or updated integration entity settings
        return savedSettings;
    }
};
exports.IntegrationEntitySettingTiedService = IntegrationEntitySettingTiedService;
exports.IntegrationEntitySettingTiedService = IntegrationEntitySettingTiedService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_integration_entity_setting_tied_repository_1.TypeOrmIntegrationEntitySettingTiedRepository,
        mikro_orm_integration_entity_setting_tied_repository_1.MikroOrmIntegrationEntitySettingTiedRepository])
], IntegrationEntitySettingTiedService);
//# sourceMappingURL=integration-entity-setting-tied.service.js.map