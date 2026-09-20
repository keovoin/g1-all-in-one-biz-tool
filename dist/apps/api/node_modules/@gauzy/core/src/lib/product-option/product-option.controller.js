"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductOptionController = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const crud_1 = require("./../core/crud");
const common_1 = require("@nestjs/common");
const product_option_service_1 = require("./product-option.service");
const guards_1 = require("./../shared/guards");
let ProductOptionController = class ProductOptionController extends crud_1.CrudController {
    constructor(productOptionService) {
        super(productOptionService);
        this.productOptionService = productOptionService;
    }
};
exports.ProductOptionController = ProductOptionController;
exports.ProductOptionController = ProductOptionController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('ProductOption'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, common_1.Controller)('/product-options'),
    tslib_1.__metadata("design:paramtypes", [product_option_service_1.ProductOptionService])
], ProductOptionController);
//# sourceMappingURL=product-option.controller.js.map