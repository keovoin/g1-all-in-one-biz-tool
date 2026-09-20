"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductVariantPriceController = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const crud_1 = require("./../core/crud");
const common_1 = require("@nestjs/common");
const product_variant_price_service_1 = require("./product-variant-price.service");
const guards_1 = require("./../shared/guards");
let ProductVariantPriceController = class ProductVariantPriceController extends crud_1.CrudController {
    constructor(productVariantPriceService) {
        super(productVariantPriceService);
        this.productVariantPriceService = productVariantPriceService;
    }
};
exports.ProductVariantPriceController = ProductVariantPriceController;
exports.ProductVariantPriceController = ProductVariantPriceController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('ProductVariantPrice'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, common_1.Controller)('/product-variant-price'),
    tslib_1.__metadata("design:paramtypes", [product_variant_price_service_1.ProductVariantPriceService])
], ProductVariantPriceController);
//# sourceMappingURL=product-variant-price.controller.js.map