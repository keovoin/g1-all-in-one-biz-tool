"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCategoryCreateHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const product_category_create_command_1 = require("../product-category.create.command");
const product_category_service_1 = require("./../../product-category.service");
let ProductCategoryCreateHandler = class ProductCategoryCreateHandler {
    constructor(productCategoryService) {
        this.productCategoryService = productCategoryService;
    }
    async execute(command) {
        try {
            const { input, language } = command;
            return await this.productCategoryService.mapTranslatedProductType(await this.productCategoryService.create(input), language);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
};
exports.ProductCategoryCreateHandler = ProductCategoryCreateHandler;
exports.ProductCategoryCreateHandler = ProductCategoryCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(product_category_create_command_1.ProductCategoryCreateCommand),
    tslib_1.__metadata("design:paramtypes", [product_category_service_1.ProductCategoryService])
], ProductCategoryCreateHandler);
//# sourceMappingURL=product-category.create.handler.js.map