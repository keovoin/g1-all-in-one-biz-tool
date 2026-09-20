"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controllers = void 0;
const tslib_1 = require("tslib");
const plugin_activation_controller_1 = require("./plugin-activation.controller");
const plugin_analytics_controller_1 = require("./plugin-analytics.controller");
const plugin_billing_controller_1 = require("./plugin-billing.controller");
const plugin_category_controller_1 = require("./plugin-category.controller");
const plugin_installation_controller_1 = require("./plugin-installation.controller");
const plugin_management_controller_1 = require("./plugin-management.controller");
const plugin_security_controller_1 = require("./plugin-security.controller");
const plugin_setting_controller_1 = require("./plugin-setting.controller");
const plugin_source_controller_1 = require("./plugin-source.controller");
const plugin_subscription_access_controller_1 = require("./plugin-subscription-access.controller");
const plugin_subscription_analytics_controller_1 = require("./plugin-subscription-analytics.controller");
const plugin_subscription_plan_controller_1 = require("./plugin-subscription-plan.controller");
const plugin_subscription_controller_1 = require("./plugin-subscription.controller");
const plugin_tag_management_controller_1 = require("./plugin-tag-management.controller");
const plugin_tag_controller_1 = require("./plugin-tag.controller");
const plugin_tenant_controller_1 = require("./plugin-tenant.controller");
const plugin_user_assignment_controller_1 = require("./plugin-user-assignment.controller");
const plugin_version_controller_1 = require("./plugin-version.controller");
const plugin_controller_1 = require("./plugin.controller");
const user_subscribed_plugins_controller_1 = require("./user-subscribed-plugins.controller");
exports.controllers = [
    plugin_user_assignment_controller_1.PluginUserAssignmentController,
    plugin_setting_controller_1.PluginSettingController,
    plugin_subscription_controller_1.PluginSubscriptionController,
    plugin_subscription_access_controller_1.PluginSubscriptionAccessController,
    plugin_subscription_plan_controller_1.PluginSubscriptionPlanController,
    plugin_billing_controller_1.PluginBillingController,
    plugin_tag_management_controller_1.PluginTagsController,
    plugin_tag_management_controller_1.PluginRecommendationsController,
    plugin_activation_controller_1.PluginActivationController,
    plugin_installation_controller_1.PluginInstallationController,
    plugin_source_controller_1.PluginSourceController,
    plugin_version_controller_1.PluginVersionController,
    plugin_controller_1.PluginController,
    plugin_management_controller_1.PluginManagementController,
    plugin_security_controller_1.PluginSecurityController,
    plugin_tag_management_controller_1.TagPluginsController,
    plugin_tag_controller_1.PluginTagController,
    plugin_category_controller_1.PluginCategoryController,
    plugin_user_assignment_controller_1.UserPluginAssignmentController,
    plugin_user_assignment_controller_1.PluginUserAssignmentManagementController,
    plugin_analytics_controller_1.PluginAnalyticsController,
    plugin_subscription_analytics_controller_1.PluginSubscriptionAnalyticsController,
    plugin_tenant_controller_1.PluginTenantController,
    user_subscribed_plugins_controller_1.UserSubscribedPluginsController
];
tslib_1.__exportStar(require("./plugin-activation.controller"), exports);
tslib_1.__exportStar(require("./plugin-analytics.controller"), exports);
tslib_1.__exportStar(require("./plugin-billing.controller"), exports);
tslib_1.__exportStar(require("./plugin-category.controller"), exports);
tslib_1.__exportStar(require("./plugin-installation.controller"), exports);
tslib_1.__exportStar(require("./plugin-management.controller"), exports);
tslib_1.__exportStar(require("./plugin-security.controller"), exports);
tslib_1.__exportStar(require("./plugin-setting.controller"), exports);
tslib_1.__exportStar(require("./plugin-source.controller"), exports);
tslib_1.__exportStar(require("./plugin-subscription-access.controller"), exports);
tslib_1.__exportStar(require("./plugin-subscription-analytics.controller"), exports);
tslib_1.__exportStar(require("./plugin-subscription-plan.controller"), exports);
tslib_1.__exportStar(require("./plugin-subscription.controller"), exports);
tslib_1.__exportStar(require("./plugin-tag-management.controller"), exports);
tslib_1.__exportStar(require("./plugin-tag.controller"), exports);
tslib_1.__exportStar(require("./plugin-tenant.controller"), exports);
tslib_1.__exportStar(require("./plugin-user-assignment.controller"), exports);
tslib_1.__exportStar(require("./plugin-version.controller"), exports);
tslib_1.__exportStar(require("./plugin.controller"), exports);
tslib_1.__exportStar(require("./user-subscribed-plugins.controller"), exports);
//# sourceMappingURL=index.js.map