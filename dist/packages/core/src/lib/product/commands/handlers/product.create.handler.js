"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const product_service_1 = require("../../../product/product.service");
const product_create_command_1 = require("../product.create.command");
const product_option_service_1 = require("../../../product-option/product-option.service");
const product_entity_1 = require("../../product.entity");
const internal_1 = require("../../../core/entities/internal");
const product_option_group_service_1 = require("../../../product-option/product-option-group.service");
let ProductCreateHandler = class ProductCreateHandler {
    constructor(productOptionService, productService, productOptionsGroupService) {
        this.productOptionService = productOptionService;
        this.productService = productService;
        this.productOptionsGroupService = productOptionsGroupService;
    }
    async execute(command) {
        const { productInput } = command;
        const { optionGroupCreateInputs: optionGroupsUpdate, ...others } = productInput;
        const product = Object.assign(new product_entity_1.Product(), { ...others });
        const savedProduct = await this.productService.save(product);
        const optionsGroupsCreate = await Promise.all(optionGroupsUpdate.map(async (group) => {
            let newGroup = new internal_1.ProductOptionGroup();
            newGroup.name = group.name;
            newGroup.productId = savedProduct.id;
            newGroup.translations = [];
            newGroup.options = [];
            const savedGroup = await this.productOptionsGroupService.save(newGroup);
            // save group options with their translations
            for await (const optionInput of group.options) {
                const option = Object.assign(new internal_1.ProductOption(), {
                    ...optionInput,
                    groupId: savedGroup.id
                });
                const savedOption = await this.productOptionService.save(option);
                const optionsTranslationEntities = await Promise.all(option.translations.map((optionTranslation) => {
                    let optionTranslationEntity = Object.assign(new internal_1.ProductOptionTranslation(), {
                        ...optionTranslation,
                        referenceId: savedOption.id
                    });
                    return this.productOptionService.saveProductOptionTranslation(optionTranslationEntity);
                }));
                savedOption.translations = optionsTranslationEntities;
                const optionEntity = await this.productOptionService.save(savedOption);
                if (optionEntity) {
                    savedGroup.options.push(optionEntity);
                }
            }
            //save group translations
            const groupTranslationsEntities = Promise.all(group.translations.map((groupTranslation) => {
                let groupTranslationObj = Object.assign(new internal_1.ProductOptionGroupTranslation(), {
                    ...groupTranslation,
                    referenceId: savedGroup.id
                });
                return this.productOptionsGroupService.createTranslation(groupTranslationObj);
            }));
            savedGroup.translations = await groupTranslationsEntities;
            return savedGroup;
        }));
        savedProduct.optionGroups = await this.productOptionsGroupService.saveMany(optionsGroupsCreate);
        const updatedProduct = await this.productService.saveProduct(savedProduct);
        return updatedProduct;
    }
};
exports.ProductCreateHandler = ProductCreateHandler;
exports.ProductCreateHandler = ProductCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(product_create_command_1.ProductCreateCommand),
    tslib_1.__metadata("design:paramtypes", [product_option_service_1.ProductOptionService,
        product_service_1.ProductService,
        product_option_group_service_1.ProductOptionGroupService])
], ProductCreateHandler);
//# sourceMappingURL=product.create.handler.js.map