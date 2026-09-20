"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHelpCenterArticle = void 0;
const typeorm_1 = require("typeorm");
const faker_1 = require("@faker-js/faker");
const help_center_article_entity_1 = require("./help-center-article.entity");
const help_center_1 = require("./../help-center");
const createHelpCenterArticle = async (dataSource, tenants, tenantOrganizationsMap, numberOfHelpCenterArticle) => {
    const helpCenterArticles = [];
    for await (const tenant of tenants) {
        const organizations = tenantOrganizationsMap.get(tenant);
        for await (const organization of organizations) {
            const organizationId = organization.id;
            const tenantId = organization.tenantId;
            const helpCenters = await dataSource.manager.findBy(help_center_1.HelpCenter, {
                parentId: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()),
                tenantId,
                organizationId
            });
            for (let i = 0; i <= numberOfHelpCenterArticle; i++) {
                const article = new help_center_article_entity_1.HelpCenterArticle();
                article.organizationId = organizationId;
                article.tenantId = tenantId;
                article.name = faker_1.faker.person.jobTitle();
                article.description = faker_1.faker.person.jobDescriptor();
                article.data = faker_1.faker.commerce.productMaterial();
                const helpCenter = faker_1.faker.helpers.arrayElement(helpCenters);
                article.categoryId = (helpCenter) ? helpCenter.id : null;
                article.draft = faker_1.faker.datatype.boolean();
                article.privacy = faker_1.faker.datatype.boolean();
                article.index = i;
                helpCenterArticles.push(article);
            }
        }
    }
    return await dataSource.manager.save(helpCenterArticles);
};
exports.createHelpCenterArticle = createHelpCenterArticle;
//# sourceMappingURL=help-center-article.seed.js.map