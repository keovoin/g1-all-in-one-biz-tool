"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductVariantSettingService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("../core/crud");
const product_setting_entity_1 = require("./product-setting.entity");
const type_orm_product_setting_repository_1 = require("./repository/type-orm-product-setting.repository");
const mikro_orm_product_setting_repository_1 = require("./repository/mikro-orm-product-setting.repository");
let ProductVariantSettingService = class ProductVariantSettingService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmProductVariantSettingRepository, mikroOrmProductVariantSettingRepository) {
        super(typeOrmProductVariantSettingRepository, mikroOrmProductVariantSettingRepository);
    }
    /**
     * Create default variant settings
     *
     * @returns - ProductVariantSetting
     */
    async createDefaultVariantSettings() {
        const newProductVariantSettings = new product_setting_entity_1.ProductVariantSetting();
        return this.save(newProductVariantSettings);
    }
    /**
     * Delete many product variant settings
     *
     * @param productVariantSettings
     * @returns
     */
    async deleteManySettings(productVariantSettings) {
        const ids = productVariantSettings.map((s) => s.id).filter((id) => !!id);
        if (ids.length > 0) {
            await super.deleteMany(ids);
        }
        return productVariantSettings;
    }
};
exports.ProductVariantSettingService = ProductVariantSettingService;
exports.ProductVariantSettingService = ProductVariantSettingService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_product_setting_repository_1.TypeOrmProductVariantSettingRepository,
        mikro_orm_product_setting_repository_1.MikroOrmProductVariantSettingRepository])
], ProductVariantSettingService);
//# sourceMappingURL=product-setting.service.js.map