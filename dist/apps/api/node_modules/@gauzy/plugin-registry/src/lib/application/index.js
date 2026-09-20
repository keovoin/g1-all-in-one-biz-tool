"use strict";
// Application Layer - Domain-Based Organization
// Each domain encapsulates related commands, queries, and handlers
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlers = void 0;
const tslib_1 = require("tslib");
const plugin_1 = require("./plugin");
const plugin_billing_1 = require("./plugin-billing");
const handlers_1 = require("./plugin-category/commands/handlers");
const handlers_2 = require("./plugin-category/queries/handlers");
const plugin_installation_1 = require("./plugin-installation");
const plugin_setting_1 = require("./plugin-setting");
const plugin_source_1 = require("./plugin-source");
const handlers_3 = require("./plugin-source/commands/handlers");
const plugin_subscription_1 = require("./plugin-subscription");
const handlers_4 = require("./plugin-tag/commands/handlers");
const handlers_5 = require("./plugin-tenant/commands/handlers");
const handlers_6 = require("./plugin-tenant/queries/handlers");
const plugin_user_assignment_1 = require("./plugin-user-assignment");
const plugin_version_1 = require("./plugin-version");
const handlers_7 = require("./plugin/queries/handlers");
// Export commands handlers array
const commands = [
    // Plugin Management Command Handlers
    plugin_installation_1.ActivatePluginCommandHandler,
    plugin_1.CreatePluginCommandHandler,
    plugin_installation_1.DeactivatePluginCommandHandler,
    plugin_1.DeletePluginCommandHandler,
    plugin_installation_1.InstallPluginCommandHandler,
    plugin_installation_1.UninstallPluginCommandHandler,
    plugin_1.UpdatePluginCommandHandler,
    plugin_1.VerifyPluginCommandHandler,
    // Plugin User Assignment Command Handlers
    plugin_user_assignment_1.AssignUsersToPluginCommandHandler,
    plugin_user_assignment_1.UnassignUsersFromPluginCommandHandler,
    plugin_user_assignment_1.BulkAssignUsersToPluginsCommandHandler,
    // Plugin Version Command Handlers
    plugin_version_1.CreatePluginVersionCommandHandler,
    plugin_version_1.DeletePluginVersionCommandHandler,
    plugin_version_1.RecoverPluginVersionCommandHandler,
    plugin_version_1.UpdatePluginVersionCommandHandler,
    // Plugin Source Command Handlers
    handlers_3.CreatePluginSourceCommandHandler,
    handlers_3.DeletePluginSourceCommandHandler,
    handlers_3.RecoverPluginSourceCommandHandler,
    // Plugin Category Command Handlers
    handlers_1.CreatePluginCategoryHandler,
    handlers_1.DeletePluginCategoryHandler,
    handlers_1.UpdatePluginCategoryHandler,
    // Plugin Subscription Command Handlers
    plugin_user_assignment_1.AssignPluginSubscriptionUsersCommandHandler,
    plugin_subscription_1.CancelPluginSubscriptionCommandHandler,
    plugin_subscription_1.CreatePluginSubscriptionCommandHandler,
    plugin_subscription_1.DeletePluginSubscriptionCommandHandler,
    plugin_subscription_1.DowngradePluginSubscriptionCommandHandler,
    plugin_subscription_1.ExtendTrialSubscriptionCommandHandler,
    plugin_billing_1.PluginBillingCreateHandler,
    plugin_billing_1.PluginBillingProcessPaymentHandler,
    plugin_billing_1.ProcessBillingCommandHandler,
    plugin_subscription_1.PurchasePluginSubscriptionCommandHandler,
    plugin_subscription_1.RenewPluginSubscriptionCommandHandler,
    plugin_user_assignment_1.RevokePluginSubscriptionUsersCommandHandler,
    plugin_subscription_1.UpdatePluginSubscriptionCommandHandler,
    plugin_subscription_1.UpgradePluginSubscriptionCommandHandler,
    // Plugin Subscription Plan Command Handlers
    plugin_subscription_1.BulkPluginPlanOperationCommandHandler,
    plugin_subscription_1.BulkCreatePluginPlansHandler,
    plugin_subscription_1.CopyPluginPlanCommandHandler,
    plugin_subscription_1.CreatePluginSubscriptionPlanCommandHandler,
    plugin_subscription_1.DeletePluginSubscriptionPlanCommandHandler,
    plugin_subscription_1.UpdatePluginSubscriptionPlanCommandHandler,
    // Plugin Settings Command Handlers
    plugin_setting_1.BulkUpdatePluginSettingsHandler,
    plugin_setting_1.CreatePluginSettingHandler,
    plugin_setting_1.DeletePluginSettingHandler,
    plugin_setting_1.SetPluginSettingValueHandler,
    plugin_setting_1.UpdatePluginSettingHandler,
    // Plugin Configuration Command Handlers
    plugin_setting_1.PluginConfigGetHandler,
    plugin_setting_1.PluginConfigSetHandler,
    // Plugin Tag Command Handlers
    handlers_4.AutoTagPluginHandler,
    handlers_4.BulkCreatePluginTagsHandler,
    handlers_4.BulkDeletePluginTagsHandler,
    handlers_4.BulkUpdatePluginTagsHandler,
    handlers_4.CreatePluginTagHandler,
    handlers_4.DeletePluginTagHandler,
    handlers_4.ReplacePluginTagsHandler,
    handlers_4.UpdatePluginTagHandler,
    handlers_4.UpdatePluginTagsPriorityHandler,
    // Plugin Tenant Command Handlers
    handlers_5.ApprovePluginTenantCommandHandler,
    handlers_5.BulkUpdatePluginTenantCommandHandler,
    handlers_5.CreatePluginTenantCommandHandler,
    handlers_5.DeletePluginTenantCommandHandler,
    handlers_5.DisablePluginTenantCommandHandler,
    handlers_5.EnablePluginTenantCommandHandler,
    handlers_5.ManagePluginTenantUsersCommandHandler,
    handlers_5.UpdatePluginTenantCommandHandler,
    handlers_5.UpdatePluginTenantConfigurationCommandHandler
];
const queries = [
    handlers_7.GetPluginQueryHandler,
    handlers_7.ListPluginsQueryHandler,
    plugin_version_1.ListPluginVersionsQueryHandler,
    plugin_source_1.ListPluginSourcesQueryHandler,
    handlers_7.SearchPluginsQueryHandler,
    handlers_2.GetPluginCategoriesHandler,
    handlers_2.GetPluginCategoryHandler,
    handlers_2.GetPluginCategoryTreeHandler,
    plugin_subscription_1.GetPluginSubscriptionsQueryHandler,
    plugin_subscription_1.GetPluginSubscriptionByIdQueryHandler,
    plugin_subscription_1.GetPluginSubscriptionsByPluginIdQueryHandler,
    plugin_subscription_1.GetPluginSubscriptionsBySubscriberIdQueryHandler,
    plugin_subscription_1.GetActivePluginSubscriptionQueryHandler,
    plugin_subscription_1.GetUserSubscribedPluginsQueryHandler,
    handlers_7.CheckPluginAccessQueryHandler,
    plugin_subscription_1.CheckUserSubscriptionAccessQueryHandler,
    plugin_subscription_1.GetSubscriptionAccessQueryHandler,
    plugin_subscription_1.GetExpiringSubscriptionsQueryHandler,
    // Plugin Subscription Plan Query Handlers
    plugin_subscription_1.GetActivePluginPlansQueryHandler,
    plugin_subscription_1.GetPluginPlanAnalyticsQueryHandler,
    plugin_subscription_1.GetPluginSubscriptionPlanByIdQueryHandler,
    plugin_subscription_1.GetPluginSubscriptionPlansByPluginIdQueryHandler,
    plugin_subscription_1.ListPluginSubscriptionPlansQueryHandler,
    // Plugin Settings Query Handlers
    plugin_setting_1.GetPluginSettingsHandler,
    plugin_setting_1.GetPluginSettingByIdHandler,
    plugin_setting_1.GetPluginSettingsByPluginIdHandler,
    plugin_setting_1.GetPluginSettingsByTenantIdHandler,
    plugin_setting_1.GetPluginSettingByKeyHandler,
    plugin_setting_1.GetPluginSettingsByCategoryHandler,
    plugin_setting_1.GetPluginSettingValueHandler,
    // Plugin User Assignment Query Handlers
    plugin_user_assignment_1.GetPluginUserAssignmentsQueryHandler,
    plugin_user_assignment_1.GetUserPluginAssignmentsQueryHandler,
    plugin_user_assignment_1.CheckUserPluginAccessQueryHandler,
    plugin_user_assignment_1.GetAllPluginUserAssignmentsQueryHandler,
    // Plugin Tenant Query Handlers
    handlers_6.CheckPluginTenantAccessHandler,
    handlers_6.GetAllPluginTenantsHandler,
    handlers_6.GetPluginTenantByIdHandler,
    handlers_6.GetPluginTenantByPluginHandler,
    handlers_6.GetPluginTenantQuotaInfoHandler,
    handlers_6.GetPluginTenantStatisticsHandler,
    handlers_6.GetPluginTenantsByPluginHandler,
    handlers_6.GetPluginTenantsByTenantHandler,
    handlers_6.GetPluginTenantUsersHandler
];
exports.handlers = [...commands, ...queries];
// Core Plugin Management
tslib_1.__exportStar(require("./plugin"), exports);
// Plugin Categorization
tslib_1.__exportStar(require("./plugin-category"), exports);
// Plugin Configuration & Settings
tslib_1.__exportStar(require("./plugin-setting"), exports);
// Plugin Subscriptions & Plans
tslib_1.__exportStar(require("./plugin-subscription"), exports);
// Plugin Source Code Management
tslib_1.__exportStar(require("./plugin-source"), exports);
// Plugin Version Management
tslib_1.__exportStar(require("./plugin-version"), exports);
// Plugin Tagging System
tslib_1.__exportStar(require("./plugin-tag"), exports);
// Plugin Billing & Payments
tslib_1.__exportStar(require("./plugin-billing"), exports);
// Plugin User Access Management
tslib_1.__exportStar(require("./plugin-user-assignment"), exports);
// Plugin Tenant Management
tslib_1.__exportStar(require("./plugin-tenant"), exports);
// exports for backward compatibility
tslib_1.__exportStar(require("./strategies"), exports);
// export for installations
tslib_1.__exportStar(require("./plugin-installation"), exports);
//# sourceMappingURL=index.js.map