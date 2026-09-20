"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHelpCenter = void 0;
const help_center_entity_1 = require("./help-center.entity");
const default_help_centers_1 = require("./default-help-centers");
const createHelpCenter = async (dataSource, tenants, tenantOrganizationsMap) => {
    const helpCenterMenuList = default_help_centers_1.DEFAULT_HELP_CENTER_MENUS;
    for (const tenant of tenants) {
        const organizations = tenantOrganizationsMap.get(tenant);
        for await (const organization of organizations) {
            for (const node of helpCenterMenuList) {
                const helpCenter = {
                    ...node,
                    tenant,
                    organization
                };
                helpCenter.children.forEach((child) => {
                    child.organization = organization;
                    child.tenant = tenant;
                });
                const entity = await createEntity(dataSource, helpCenter);
                await dataSource.manager.save(entity);
            }
        }
    }
    return helpCenterMenuList;
};
exports.createHelpCenter = createHelpCenter;
const createEntity = async (dataSource, node) => {
    if (!node) {
        return;
    }
    return dataSource.manager.create(help_center_entity_1.HelpCenter, node);
};
//# sourceMappingURL=help-center.seed.js.map