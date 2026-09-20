"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductTypeCreateHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const product_type_service_1 = require("./../../product-type.service");
const product_type_create_command_1 = require("../product-type.create.command");
let ProductTypeCreateHandler = class ProductTypeCreateHandler {
    constructor(productTypeService) {
        this.productTypeService = productTypeService;
    }
    async execute(command) {
        try {
            const { input, language } = command;
            return await this.productTypeService.mapTranslatedProductType(await this.productTypeService.create(input), language);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
};
exports.ProductTypeCreateHandler = ProductTypeCreateHandler;
exports.ProductTypeCreateHandler = ProductTypeCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(product_type_create_command_1.ProductTypeCreateCommand),
    tslib_1.__metadata("design:paramtypes", [product_type_service_1.ProductTypeService])
], ProductTypeCreateHandler);
//# sourceMappingURL=product-type.create.handler.js.map