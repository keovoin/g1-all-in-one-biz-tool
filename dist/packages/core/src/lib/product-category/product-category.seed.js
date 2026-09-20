"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultProductCategories = void 0;
const product_category_entity_1 = require("./product-category.entity");
const seed = require("./product-category.seed.json");
const faker_1 = require("@faker-js/faker");
const product_category_translation_entity_1 = require("./product-category-translation.entity");
const createDefaultProductCategories = async (dataSource, organizations) => {
    const seedProductCategories = [];
    organizations.forEach((organization) => {
        seed.forEach((seedProductCategory) => {
            const image = faker_1.faker.image.url();
            const newCategory = new product_category_entity_1.ProductCategory();
            newCategory.imageUrl = image;
            newCategory.organization = organization;
            newCategory.translations = [];
            seedProductCategory.translations.forEach((translation) => {
                const newTranslation = new product_category_translation_entity_1.ProductCategoryTranslation();
                Object.assign(newTranslation, translation);
                newCategory.translations.push(newTranslation);
            });
            seedProductCategories.push(newCategory);
        });
    });
    await insertProductCategories(dataSource, seedProductCategories);
    return seedProductCategories;
};
exports.createDefaultProductCategories = createDefaultProductCategories;
const insertProductCategories = async (dataSource, categories) => {
    await dataSource.manager.save(categories);
};
//# sourceMappingURL=product-category.seed.js.map