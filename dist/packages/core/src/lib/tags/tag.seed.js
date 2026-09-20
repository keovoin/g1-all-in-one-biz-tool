"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRandomOrganizationTags = exports.createTags = exports.createDefaultTags = void 0;
const faker_1 = require("@faker-js/faker");
const default_tags_1 = require("./default-tags");
const internal_1 = require("./../core/entities/internal");
const createDefaultTags = async (dataSource, tenant, organizations, organizationTagTypes) => {
    let tags = [];
    for (const organization of organizations) {
        const organizationTags = Object.values(default_tags_1.DEFAULT_GLOBAL_TAGS).map((name) => {
            const orgTags = new internal_1.Tag();
            orgTags.name = name;
            orgTags.description = '';
            orgTags.color = faker_1.faker.color.human();
            if (orgTags.color === 'white') {
                orgTags.color = 'red';
            }
            orgTags.organization = organization;
            orgTags.tenant = tenant;
            orgTags.tagTypeId = organizationTagTypes[Math.floor(Math.random() * organizationTagTypes.length)]?.id;
            return orgTags;
        });
        tags = [...tags, ...organizationTags];
    }
    return await dataSource.manager.save(tags);
};
exports.createDefaultTags = createDefaultTags;
const createTags = async (dataSource) => {
    const tags = [];
    for (const name of default_tags_1.DEFAULT_ORGANIZATION_TAGS) {
        const tag = new internal_1.Tag();
        tag.name = name;
        tag.description = '';
        tag.color = faker_1.faker.color.human();
        if (tag.color === 'white') {
            tag.color = 'red';
        }
        tags.push(tag);
    }
    await dataSource.createQueryBuilder().insert().into(internal_1.Tag).values(tags).execute();
    return tags;
};
exports.createTags = createTags;
/**
 * Creates random organization tags for given tenants and their organizations.
 *
 * @param dataSource - The TypeORM data source instance for database operations.
 * @param tenants - An array of tenant entities.
 * @param tenantOrganizationsMap - A map linking each tenant to its organizations.
 * @returns A promise that resolves to an array of created Tag entities.
 */
const createRandomOrganizationTags = async (dataSource, tenants, tenantOrganizationsMap, organizationTagTypes) => {
    let tags = [];
    for (const tenant of tenants) {
        // Fetch organizations for the current tenant
        const organizations = tenantOrganizationsMap.get(tenant);
        if (!organizations || organizations.length === 0) {
            console.warn(`No organizations found for tenant ID: ${tenant.id}`);
            continue; // Skip to the next tenant if no organizations are found
        }
        for (const organization of organizations) {
            // If DEFAULT_ORGANIZATION_TAGS is an object, use Object.values; otherwise, use it directly if it's already an array
            const tags = Array.isArray(default_tags_1.DEFAULT_ORGANIZATION_TAGS)
                ? default_tags_1.DEFAULT_ORGANIZATION_TAGS
                : Object.values(default_tags_1.DEFAULT_ORGANIZATION_TAGS);
            // Create Tag instances for the current organization
            const organizationTags = tags.map((name) => {
                const tag = new internal_1.Tag();
                tag.name = name;
                tag.description = ''; // Consider adding meaningful descriptions if applicable
                tag.color = faker_1.faker.color.human();
                tag.organization = organization;
                tag.tenant = tenant;
                tag.tagTypeId = organizationTagTypes[Math.floor(Math.random() * organizationTagTypes.length)]?.id;
                return tag;
            });
            // Efficiently add the new tags to the 'tags' array using push with spread
            tags.push(...organizationTags);
        }
    }
    // Bulk save all tags
    return await dataSource.manager.save(tags);
};
exports.createRandomOrganizationTags = createRandomOrganizationTags;
//# sourceMappingURL=tag.seed.js.map