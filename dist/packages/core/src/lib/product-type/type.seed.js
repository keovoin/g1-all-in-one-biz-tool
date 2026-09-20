"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRandomProductType = exports.createDefaultProductType = void 0;
const product_type_entity_1 = require("./product-type.entity");
const seed = require("./product-type.seed.json");
const product_type_translation_entity_1 = require("./product-type-translation.entity");
const createDefaultProductType = async (dataSource, tenant, organizations) => {
    const seedProductTypes = [];
    for (const organization of organizations) {
        const productTypes = await generateProductType(tenant, organization);
        seedProductTypes.push(...productTypes);
    }
    return await insertProductTypes(dataSource, seedProductTypes);
};
exports.createDefaultProductType = createDefaultProductType;
const insertProductTypes = async (dataSource, productTypes) => {
    return await dataSource.manager.save(productTypes);
};
const createRandomProductType = async (dataSource, tenants, tenantOrganizationsMap) => {
    if (!tenantOrganizationsMap) {
        console.warn('Warning: tenantOrganizationsMap not found, Random Product Type will not be created');
        return;
    }
    const seedProductTypes = [];
    for await (const tenant of tenants) {
        const organizations = tenantOrganizationsMap.get(tenant);
        for await (const organization of organizations) {
            const productTypes = await generateProductType(tenant, organization);
            seedProductTypes.push(...productTypes);
        }
    }
    return await insertProductTypes(dataSource, seedProductTypes);
};
exports.createRandomProductType = createRandomProductType;
const generateProductType = async (tenant, organization) => {
    const productTypes = [];
    for (const seedProductType of seed) {
        const productType = new product_type_entity_1.ProductType();
        productType.icon = seedProductType.icon;
        productType.organization = organization;
        productType.tenant = tenant;
        productType.translations = [];
        seedProductType.translations.forEach((translation) => {
            const newTranslation = new product_type_translation_entity_1.ProductTypeTranslation();
            newTranslation.organization = organization;
            newTranslation.tenant = tenant;
            Object.assign(newTranslation, translation);
            productType.translations.push(newTranslation);
        });
        productTypes.push(productType);
    }
    return productTypes;
};
//# sourceMappingURL=type.seed.js.map