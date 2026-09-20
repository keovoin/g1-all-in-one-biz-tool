"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductVariantDeleteHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const product_variant_delete_command_1 = require("../product-variant.delete.command");
const product_variant_service_1 = require("../../product-variant.service");
const product_setting_service_1 = require("../../../product-setting/product-setting.service");
const product_variant_price_service_1 = require("../../../product-variant-price/product-variant-price.service");
let ProductVariantDeleteHandler = class ProductVariantDeleteHandler {
    constructor(productVariantService, productVariantSettingsService, productVariantPricesService) {
        this.productVariantService = productVariantService;
        this.productVariantSettingsService = productVariantSettingsService;
        this.productVariantPricesService = productVariantPricesService;
    }
    async execute(command) {
        const { productVariantId } = command;
        const productVariant = await this.productVariantService.findOneByIdString(productVariantId);
        const deleteRes = [
            await this.productVariantService.delete(productVariant.id),
            await this.productVariantPricesService.delete(productVariant.price.id),
            await this.productVariantSettingsService.delete(productVariant.setting.id)
        ];
        return {
            raw: deleteRes.map((res) => res.affected),
            affected: deleteRes
                .map((res) => (res.affected ? res.affected : 0))
                .reduce((acc, value) => acc + value)
        };
    }
};
exports.ProductVariantDeleteHandler = ProductVariantDeleteHandler;
exports.ProductVariantDeleteHandler = ProductVariantDeleteHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(product_variant_delete_command_1.ProductVariantDeleteCommand),
    tslib_1.__metadata("design:paramtypes", [product_variant_service_1.ProductVariantService,
        product_setting_service_1.ProductVariantSettingService,
        product_variant_price_service_1.ProductVariantPriceService])
], ProductVariantDeleteHandler);
//# sourceMappingURL=product-variant.delete.handler.js.map