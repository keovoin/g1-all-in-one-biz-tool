"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRandomProductType = exports.createDefaultProductTypes = void 0;
const seed = require("./product-type.seed.json");
const contracts_1 = require("@gauzy/contracts");
const product_type_entity_1 = require("./product-type.entity");
const faker_1 = require("@faker-js/faker");
const product_category_entity_1 = require("../product-category/product-category.entity");
const product_entity_1 = require("../product/product.entity");
const product_type_translation_entity_1 = require("./product-type-translation.entity");
const createDefaultProductTypes = async (dataSource, organizations) => {
    const seedProductTypes = [];
    organizations.forEach((organization) => {
        seed.forEach((seedProductType) => {
            const newType = new product_type_entity_1.ProductType();
            newType.icon = seedProductType.icon;
            newType.organization = organization;
            newType.translations = [];
            seedProductType.translations.forEach((translation) => {
                const newTranslation = new product_type_translation_entity_1.ProductTypeTranslation();
                Object.assign(newTranslation, translation);
                newType.translations.push(newTranslation);
            });
            seedProductTypes.push(newType);
        });
    });
    await insertProductTypes(dataSource, seedProductTypes);
    return seedProductTypes;
};
exports.createDefaultProductTypes = createDefaultProductTypes;
const insertProductTypes = async (dataSource, productTypes) => {
    await dataSource.manager.save(productTypes);
};
const createRandomProductType = async (dataSource, tenants, tenantOrganizationsMap) => {
    if (!tenantOrganizationsMap) {
        console.warn('Warning: tenantOrganizationsMap not found, ProductType will not be created');
        return;
    }
    console.log('createRandomProductType');
    const productTypes = [];
    for (const tenant of tenants) {
        const { id: tenantId } = tenant;
        const tenantOrgs = tenantOrganizationsMap.get(tenant);
        for (const tenantOrg of tenantOrgs) {
            const { id: organizationId } = tenantOrg;
            const productCategories = await dataSource.manager.find(product_category_entity_1.ProductCategory, {
                where: {
                    tenantId,
                    organizationId
                }
            });
            for (const productCategory of productCategories) {
                const products = await dataSource.manager.find(product_entity_1.Product, {
                    where: {
                        tenantId,
                        organizationId,
                        productCategoryId: productCategory.id
                    }
                });
                const productType = new product_type_entity_1.ProductType();
                const productTypeTranslation = [];
                productType.icon = faker_1.faker.helpers.arrayElement(Object.keys(contracts_1.ProductTypesIconsEnum));
                productType.products = products;
                productType.organization = tenantOrg;
                productType.translations = productTypeTranslation;
                productTypes.push(productType);
            }
        }
    }
    await dataSource.manager.save(productTypes);
};
exports.createRandomProductType = createRandomProductType;
//# sourceMappingURL=product-type.seed.js.map