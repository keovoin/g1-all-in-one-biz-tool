"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.services = void 0;
const tslib_1 = require("tslib");
const plugin_billing_service_1 = require("./plugin-billing.service");
const plugin_category_service_1 = require("./plugin-category.service");
const plugin_installation_service_1 = require("./plugin-installation.service");
const plugin_security_service_1 = require("./plugin-security.service");
const plugin_setting_service_1 = require("./plugin-setting.service");
const plugin_source_service_1 = require("./plugin-source.service");
const plugin_subscription_access_service_1 = require("./plugin-subscription-access.service");
const plugin_subscription_plan_service_1 = require("./plugin-subscription-plan.service");
const plugin_subscription_service_1 = require("./plugin-subscription.service");
const plugin_tag_service_1 = require("./plugin-tag.service");
const plugin_tenant_service_1 = require("./plugin-tenant.service");
const plugin_user_assignment_service_1 = require("./plugin-user-assignment.service");
const plugin_version_service_1 = require("./plugin-version.service");
const plugin_service_1 = require("./plugin.service");
exports.services = [
    plugin_service_1.PluginService,
    plugin_installation_service_1.PluginInstallationService,
    plugin_source_service_1.PluginSourceService,
    plugin_tag_service_1.PluginTagService,
    plugin_version_service_1.PluginVersionService,
    plugin_security_service_1.PluginSecurityService,
    plugin_setting_service_1.PluginSettingService,
    plugin_tenant_service_1.PluginTenantService,
    plugin_subscription_service_1.PluginSubscriptionService,
    plugin_subscription_access_service_1.PluginSubscriptionAccessService,
    plugin_subscription_plan_service_1.PluginSubscriptionPlanService,
    plugin_billing_service_1.PluginBillingService,
    plugin_category_service_1.PluginCategoryService,
    plugin_user_assignment_service_1.PluginUserAssignmentService
];
// Export individual services
tslib_1.__exportStar(require("./plugin-billing.service"), exports);
tslib_1.__exportStar(require("./plugin-category.service"), exports);
tslib_1.__exportStar(require("./plugin-installation.service"), exports);
tslib_1.__exportStar(require("./plugin-security.service"), exports);
tslib_1.__exportStar(require("./plugin-setting.service"), exports);
tslib_1.__exportStar(require("./plugin-source.service"), exports);
tslib_1.__exportStar(require("./plugin-subscription-access.service"), exports);
tslib_1.__exportStar(require("./plugin-subscription-plan.service"), exports);
tslib_1.__exportStar(require("./plugin-subscription.service"), exports);
tslib_1.__exportStar(require("./plugin-tag.service"), exports);
tslib_1.__exportStar(require("./plugin-tenant.service"), exports);
tslib_1.__exportStar(require("./plugin-user-assignment.service"), exports);
tslib_1.__exportStar(require("./plugin-version.service"), exports);
tslib_1.__exportStar(require("./plugin.service"), exports);
//# sourceMappingURL=index.js.map