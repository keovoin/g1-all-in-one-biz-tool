"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductUpdateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const product_service_1 = require("../../../product/product.service");
const product_option_service_1 = require("../../../product-option/product-option.service");
const product_update_command_1 = require("../product.update.command");
const product_option_group_service_1 = require("../../../product-option/product-option-group.service");
const internal_1 = require("../../../core/entities/internal");
let ProductUpdateHandler = class ProductUpdateHandler {
    constructor(productOptionService, productService, productOptionsGroupService) {
        this.productOptionService = productOptionService;
        this.productService = productService;
        this.productOptionsGroupService = productOptionsGroupService;
    }
    async execute(command) {
        const { productUpdateRequest } = command;
        const optionDeleteInputs = productUpdateRequest.optionDeleteInputs;
        const optionGroupCreateInputs = productUpdateRequest.optionGroupCreateInputs;
        const optionGroupUpdateInputs = productUpdateRequest.optionGroupUpdateInputs;
        const optionGroupDeleteInputs = productUpdateRequest.optionGroupDeleteInputs;
        const product = await this.productService.findById(productUpdateRequest.id, { relations: ['optionGroups'] });
        await Promise.all((optionDeleteInputs || []).map((option) => this.productOptionService.deleteOptionTranslationsBulk(option.translations)));
        await this.productOptionService.deleteBulk(optionDeleteInputs);
        await Promise.all((optionGroupDeleteInputs || []).map((group) => this.productOptionsGroupService.deleteGroupTranslationsBulk(group.translations)));
        await this.productOptionsGroupService.deleteBulk(optionGroupDeleteInputs);
        /**
         * create new option group
         */
        const optionsGroupsCreate = await Promise.all(optionGroupCreateInputs.map(async (group) => {
            let newGroup = new internal_1.ProductOptionGroup();
            newGroup.name = group.name;
            newGroup.productId = productUpdateRequest.id;
            newGroup.translations = [];
            newGroup.options = [];
            const savedGroup = await this.productOptionsGroupService.save(newGroup);
            /**
             * save group options with their translations
             */
            for await (const optionInput of group.options || []) {
                const option = Object.assign(new internal_1.ProductOption(), {
                    ...optionInput,
                    groupId: savedGroup.id
                });
                const savedOption = await this.productOptionService.save(option);
                const optionsTranslationEntities = await Promise.all((option.translations || []).map((optionTranslation) => {
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
            /**
             * save group translations.
             */
            const groupTranslationsEntities = await Promise.all((group.translations || []).map((groupTranslation) => {
                let groupTranslationObj = Object.assign(new internal_1.ProductOptionGroupTranslation(), {
                    ...groupTranslation,
                    referenceId: savedGroup.id
                });
                return this.productOptionsGroupService.createTranslation(groupTranslationObj);
            }));
            savedGroup.translations = (await groupTranslationsEntities);
            return savedGroup;
        }));
        /**
         * update product option groups
         */
        const optionGroupsUpdate = await Promise.all((optionGroupUpdateInputs || []).map(async (group) => {
            for await (let option of group.options) {
                let isNewOption = false;
                if (!option.id) {
                    option = Object.assign(new internal_1.ProductOption(), {
                        ...option,
                        groupId: group.id
                    });
                    isNewOption = true;
                }
                let optionEntity = isNewOption
                    ? await this.productOptionService.save(option)
                    : await this.productOptionService.findOneByIdString(option.id);
                const optionsTranslationEntities = await Promise.all((option.translations || []).map(async (optionTranslation) => {
                    if (this.productOptionTranslationUpdated(optionEntity, optionTranslation) ||
                        !optionTranslation.id) {
                        return this.productOptionService.saveProductOptionTranslation({
                            referenceId: optionEntity.id || null,
                            ...optionTranslation
                        });
                    }
                }));
                optionEntity.translations = (option.translations || []).concat(optionsTranslationEntities.filter((tr) => !!tr));
                if (isNewOption) {
                    group.options.push(optionEntity);
                }
            }
            /**
             * save group translations.
             */
            let existingGroup = await this.productOptionsGroupService.findOneByIdString(group.id);
            const groupTranslationsEntities = Promise.all((group.translations || []).map((groupTranslation) => {
                if (this.productOptionGroupTranslationUpdated(existingGroup, groupTranslation)) {
                    return this.productOptionsGroupService.createTranslation({
                        referenceId: group.id || null,
                        ...groupTranslation
                    });
                }
            }));
            group.translations = existingGroup.translations.concat((await groupTranslationsEntities).filter((tr) => !!tr));
            return group;
        }));
        let newProductOptions = await this.productOptionsGroupService.saveMany(optionsGroupsCreate);
        await this.productOptionsGroupService.saveMany(optionGroupsUpdate);
        product.optionGroups = product.optionGroups?.concat(newProductOptions);
        product.productCategory = productUpdateRequest.category;
        product.productType = productUpdateRequest.type;
        product.tags = productUpdateRequest.tags;
        const productTranslations = await Promise.all((productUpdateRequest.translations || []).map((optionTranslation) => {
            return this.productService.saveProductTranslation(optionTranslation);
        }));
        product.translations = productTranslations;
        const updatedProduct = await this.productService.saveProduct(product);
        return updatedProduct;
    }
    /**
     * check if product option translation has been changed and needs updating
     */
    productOptionTranslationUpdated(productOption, productOptionTranslation) {
        if (!productOption)
            return true;
        let currentTranslation = productOption.translations.find((translation) => translation.languageCode == productOptionTranslation.languageCode);
        if (!currentTranslation)
            return true;
        if (currentTranslation.name !== productOptionTranslation.name ||
            currentTranslation.description !== productOptionTranslation.description) {
            return true;
        }
        return false;
    }
    /**
     * check if product option group translation has been changed and needs updating
     */
    productOptionGroupTranslationUpdated(optionGroup, optionGroupTranslation) {
        if (!optionGroup)
            return false;
        let currentTranslation = optionGroup.translations.find((translation) => translation.languageCode == optionGroupTranslation.languageCode);
        if (!currentTranslation)
            return true;
        if (currentTranslation.name !== optionGroupTranslation.name) {
            return true;
        }
        return false;
    }
};
exports.ProductUpdateHandler = ProductUpdateHandler;
exports.ProductUpdateHandler = ProductUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(product_update_command_1.ProductUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [product_option_service_1.ProductOptionService,
        product_service_1.ProductService,
        product_option_group_service_1.ProductOptionGroupService])
], ProductUpdateHandler);
//# sourceMappingURL=product.update.handler.js.map