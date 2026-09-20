"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductDeleteHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const product_delete_command_1 = require("../product.delete.command");
const product_service_1 = require("../../product.service");
const product_variant_service_1 = require("../../../product-variant/product-variant.service");
const product_setting_service_1 = require("../../../product-setting/product-setting.service");
const product_variant_price_service_1 = require("../../../product-variant-price/product-variant-price.service");
const product_option_service_1 = require("../../../product-option/product-option.service");
const product_option_group_service_1 = require("../../../product-option/product-option-group.service");
let ProductDeleteHandler = class ProductDeleteHandler {
    constructor(productService, productOptionService, productOptionsGroupService, productVariantService, productVariantSettingsService, productVariantPricesService) {
        this.productService = productService;
        this.productOptionService = productOptionService;
        this.productOptionsGroupService = productOptionsGroupService;
        this.productVariantService = productVariantService;
        this.productVariantSettingsService = productVariantSettingsService;
        this.productVariantPricesService = productVariantPricesService;
    }
    async execute(command) {
        const { productId } = command;
        const product = await this.productService.findOneByOptions({
            where: { id: productId },
            relations: {
                variants: true,
                optionGroups: {
                    options: {
                        translations: true
                    },
                    translations: true
                }
            }
        });
        if (!product) {
            return { raw: [], affected: 0 };
        }
        const variants = product.variants ?? [];
        const optionGroups = product.optionGroups ?? [];
        // Collect related entities in single pass
        const settingsToDelete = variants.map((v) => v.setting).filter(Boolean);
        const pricesToDelete = variants.map((v) => v.price).filter(Boolean);
        // ---------- DELETE OPTION GROUPS ----------
        await Promise.all(optionGroups.map(async (group) => {
            // Delete option translations in parallel
            await Promise.all((group.options ?? []).map((option) => this.productOptionService.deleteOptionTranslationsBulk(option.translations ?? [])));
            // Delete options
            await this.productOptionService.deleteMany((group.options ?? []).map((o) => o.id));
            // Delete group translations
            await this.productOptionsGroupService.deleteGroupTranslationsBulk(group.translations ?? []);
        }));
        // Delete groups
        await this.productOptionsGroupService.deleteMany(optionGroups.map((g) => g.id));
        // ---------- DELETE VARIANTS + RELATED ----------
        const deleteResults = await Promise.all([
            this.productVariantService.deleteManyVariants(variants),
            this.productVariantSettingsService.deleteManySettings(settingsToDelete),
            this.productVariantPricesService.deleteManyPrices(pricesToDelete),
            this.productService.delete(product.id)
        ]);
        return {
            raw: deleteResults,
            affected: this.calculateAffected(deleteResults)
        };
    }
    calculateAffected(results) {
        return results.reduce((total, result) => {
            if (Array.isArray(result)) {
                return total + result.length;
            }
            return total + (result?.affected ?? 0);
        }, 0);
    }
};
exports.ProductDeleteHandler = ProductDeleteHandler;
exports.ProductDeleteHandler = ProductDeleteHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(product_delete_command_1.ProductDeleteCommand),
    tslib_1.__metadata("design:paramtypes", [product_service_1.ProductService,
        product_option_service_1.ProductOptionService,
        product_option_group_service_1.ProductOptionGroupService,
        product_variant_service_1.ProductVariantService,
        product_setting_service_1.ProductVariantSettingService,
        product_variant_price_service_1.ProductVariantPriceService])
], ProductDeleteHandler);
//# sourceMappingURL=product.delete.handler.js.map