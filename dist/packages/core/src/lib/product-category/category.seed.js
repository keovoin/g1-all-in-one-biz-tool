"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRandomProductCategories = exports.createCategories = void 0;
const product_category_entity_1 = require("./product-category.entity");
const faker_1 = require("@faker-js/faker");
const categories = require("./product-category.seed.json");
const product_category_translation_entity_1 = require("./product-category-translation.entity");
const createCategories = async (dataSource, tenant, organizations) => {
    const seedProductCategories = [];
    for (const organization of organizations) {
        for (const seedProductCategory of categories) {
            const image = faker_1.faker.image.url();
            const newCategory = new product_category_entity_1.ProductCategory();
            newCategory.imageUrl = image;
            newCategory.organization = organization;
            newCategory.tenant = tenant;
            newCategory.translations = [];
            seedProductCategory.translations.forEach((translation) => {
                const newTranslation = new product_category_translation_entity_1.ProductCategoryTranslation();
                newTranslation.organization = organization;
                newTranslation.tenant = tenant;
                Object.assign(newTranslation, translation);
                newCategory.translations.push(newTranslation);
            });
            seedProductCategories.push(newCategory);
        }
    }
    return await insertProductCategories(dataSource, seedProductCategories);
};
exports.createCategories = createCategories;
const insertProductCategories = async (dataSource, categories) => {
    return await dataSource.manager.save(categories);
};
const createRandomProductCategories = async (dataSource, tenants, tenantOrganizationsMap) => {
    const seedProductCategories = [];
    for (const tenant of tenants) {
        const organizations = tenantOrganizationsMap.get(tenant);
        for (const organization of organizations) {
            for (const seedProductCategory of categories) {
                const image = faker_1.faker.image.url();
                const newCategory = new product_category_entity_1.ProductCategory();
                newCategory.imageUrl = image;
                newCategory.organization = organization;
                newCategory.tenant = tenant;
                newCategory.translations = [];
                seedProductCategory.translations.forEach((translation) => {
                    const newTranslation = new product_category_translation_entity_1.ProductCategoryTranslation();
                    newTranslation.organization = organization;
                    newTranslation.tenant = tenant;
                    Object.assign(newTranslation, translation);
                    newCategory.translations.push(newTranslation);
                });
                seedProductCategories.push(newCategory);
            }
        }
    }
    await insertProductCategories(dataSource, seedProductCategories);
    return seedProductCategories;
};
exports.createRandomProductCategories = createRandomProductCategories;
//# sourceMappingURL=category.seed.js.map