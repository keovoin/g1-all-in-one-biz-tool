"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductVariantCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const product_variant_entity_1 = require("../../product-variant.entity");
const product_variant_create_command_1 = require("../product-variant.create.command");
const product_variant_service_1 = require("../../product-variant.service");
const product_variant_price_service_1 = require("../../../product-variant-price/product-variant-price.service");
const product_setting_service_1 = require("../../../product-setting/product-setting.service");
const product_service_1 = require("../../../product/product.service");
let ProductVariantCreateHandler = class ProductVariantCreateHandler {
    constructor(productService, productVariantService, productVariantPriceService, productVariantSettingsService) {
        this.productService = productService;
        this.productVariantService = productVariantService;
        this.productVariantPriceService = productVariantPriceService;
        this.productVariantSettingsService = productVariantSettingsService;
    }
    async execute(command) {
        const variantCreateInput = command.productInput;
        // Fetch the product with all necessary relations, ensuring options and translations are loaded
        const product = await this.productService.findById(variantCreateInput.product.id, {
            relations: ['optionGroups', 'optionGroups.options', 'optionGroups.options.translations']
        });
        // Extract all product options from optionGroups
        let productOptions = product.optionGroups.flatMap((optionGroup) => optionGroup.options);
        const optionCombinations = variantCreateInput.optionCombinations;
        const { organizationId, tenantId } = variantCreateInput.product;
        const arrVariants = [];
        // Iterate over each option combination
        for (const optionCombination of optionCombinations) {
            const newProductVariant = new product_variant_entity_1.ProductVariant();
            let variantOptions = [];
            for (const dbOption of productOptions) {
                for (const option of optionCombination.options) {
                    if (dbOption.translations?.some((translation) => translation.name === option)) {
                        variantOptions.push(dbOption);
                    }
                }
            }
            // Set product variant properties
            newProductVariant.options = variantOptions;
            newProductVariant.internalReference = variantOptions.map((option) => option.name).join('-');
            newProductVariant.organizationId = organizationId;
            newProductVariant.tenantId = tenantId;
            // Execute multiple async calls in parallel using `Promise.all` for better performance
            const [setting, price, productEntity] = await Promise.all([
                this.productVariantSettingsService.create({ tenantId, organizationId }),
                this.productVariantPriceService.create({ tenantId, organizationId }),
                this.productService.findOneByIdString(variantCreateInput.product.id)
            ]);
            // Assign fetched values to the product variant
            newProductVariant.setting = setting;
            newProductVariant.price = price;
            newProductVariant.product = productEntity;
            // Create and store the new product variant
            const createdVariant = await this.productVariantService.createVariant(newProductVariant);
            arrVariants.push(createdVariant);
        }
        return arrVariants;
    }
};
exports.ProductVariantCreateHandler = ProductVariantCreateHandler;
exports.ProductVariantCreateHandler = ProductVariantCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(product_variant_create_command_1.ProductVariantCreateCommand),
    tslib_1.__metadata("design:paramtypes", [product_service_1.ProductService,
        product_variant_service_1.ProductVariantService,
        product_variant_price_service_1.ProductVariantPriceService,
        product_setting_service_1.ProductVariantSettingService])
], ProductVariantCreateHandler);
//# sourceMappingURL=product-variant.create.handler.js.map