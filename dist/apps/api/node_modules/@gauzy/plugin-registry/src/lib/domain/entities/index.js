"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entities = void 0;
const tslib_1 = require("tslib");
const plugin_billing_entity_1 = require("./plugin-billing.entity");
const plugin_category_entity_1 = require("./plugin-category.entity");
const plugin_installation_entity_1 = require("./plugin-installation.entity");
const plugin_setting_entity_1 = require("./plugin-setting.entity");
const plugin_source_entity_1 = require("./plugin-source.entity");
const plugin_subscription_plan_entity_1 = require("./plugin-subscription-plan.entity");
const plugin_subscription_entity_1 = require("./plugin-subscription.entity");
const plugin_tag_entity_1 = require("./plugin-tag.entity");
const plugin_tenant_entity_1 = require("./plugin-tenant.entity");
const plugin_version_entity_1 = require("./plugin-version.entity");
const plugin_entity_1 = require("./plugin.entity");
exports.entities = [
    plugin_installation_entity_1.PluginInstallation,
    plugin_source_entity_1.PluginSource,
    plugin_tag_entity_1.PluginTag,
    plugin_tenant_entity_1.PluginTenant,
    plugin_version_entity_1.PluginVersion,
    plugin_entity_1.Plugin,
    plugin_setting_entity_1.PluginSetting,
    plugin_subscription_entity_1.PluginSubscription,
    plugin_billing_entity_1.PluginBilling,
    plugin_category_entity_1.PluginCategory,
    plugin_subscription_plan_entity_1.PluginSubscriptionPlan
];
tslib_1.__exportStar(require("./plugin-billing.entity"), exports);
tslib_1.__exportStar(require("./plugin-category.entity"), exports);
tslib_1.__exportStar(require("./plugin-installation.entity"), exports);
tslib_1.__exportStar(require("./plugin-setting.entity"), exports);
tslib_1.__exportStar(require("./plugin-source.entity"), exports);
tslib_1.__exportStar(require("./plugin-subscription-plan.entity"), exports);
tslib_1.__exportStar(require("./plugin-subscription.entity"), exports);
tslib_1.__exportStar(require("./plugin-tag.entity"), exports);
tslib_1.__exportStar(require("./plugin-tenant.entity"), exports);
tslib_1.__exportStar(require("./plugin-version.entity"), exports);
tslib_1.__exportStar(require("./plugin.entity"), exports);
//# sourceMappingURL=index.js.map