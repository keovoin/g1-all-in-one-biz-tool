"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRandomProductVariant = void 0;
const typeorm_1 = require("typeorm");
const contracts_1 = require("@gauzy/contracts");
const faker_1 = require("@faker-js/faker");
const _ = require("underscore");
const product_variant_entity_1 = require("./product-variant.entity");
const internal_1 = require("./../core/entities/internal");
const createRandomProductVariant = async (dataSource, tenants, tenantOrganizationsMap, numberOfVariantPerProduct) => {
    if (!tenantOrganizationsMap) {
        console.warn('Warning: tenantOrganizationsMap not found, Product Variant will not be created');
        return;
    }
    for await (const tenant of tenants) {
        const { id: tenantId } = tenant;
        const organizations = tenantOrganizationsMap.get(tenant);
        for await (const organization of organizations) {
            const { id: organizationId } = organization;
            const productCategories = await dataSource.manager.findBy(internal_1.ProductCategory, {
                organizationId,
                tenantId
            });
            for await (const productCategory of productCategories) {
                const products = await dataSource.manager.findBy(internal_1.Product, {
                    productCategoryId: productCategory.id
                });
                const productVariants = [];
                for await (const product of products) {
                    const productOptionGroups = await dataSource.manager.findBy(internal_1.ProductOptionGroup, {
                        productId: product.id
                    });
                    const productOptionGroupsIds = _.pluck(productOptionGroups, 'id');
                    const productOptions = await dataSource.manager.find(internal_1.ProductOption, {
                        where: {
                            group: (0, typeorm_1.In)(productOptionGroupsIds),
                        }
                    });
                    for (let i = 0; i < numberOfVariantPerProduct; i++) {
                        const productVariant = new product_variant_entity_1.ProductVariant();
                        productVariant.notes = faker_1.faker.person.jobDescriptor();
                        productVariant.productId = product.id;
                        productVariant.quantity = faker_1.faker.number.int(20);
                        productVariant.billingInvoicingPolicy = faker_1.faker.helpers.arrayElement(Object.keys(contracts_1.BillingInvoicingPolicyEnum));
                        productVariant.enabled = faker_1.faker.datatype.boolean();
                        productVariant.options = productOptions;
                        productVariant.setting = new internal_1.ProductVariantSetting();
                        productVariant.price = new internal_1.ProductVariantPrice();
                        productVariant.product = product;
                        productVariant.tenant = tenant;
                        productVariant.organization = organization;
                        productVariants.push(productVariant);
                    }
                }
                await dataSource.manager.save(productVariants);
            }
        }
    }
};
exports.createRandomProductVariant = createRandomProductVariant;
//# sourceMappingURL=product-variant.seed.js.map