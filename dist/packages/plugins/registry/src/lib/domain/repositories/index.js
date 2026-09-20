"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.repositories = void 0;
const tslib_1 = require("tslib");
const mikro_orm_plugin_billing_repository_1 = require("./mikro-orm-plugin-billing.repository");
const mikro_orm_plugin_category_repository_1 = require("./mikro-orm-plugin-category.repository");
const mikro_orm_plugin_installation_repository_1 = require("./mikro-orm-plugin-installation.repository");
const mikro_orm_plugin_setting_repository_1 = require("./mikro-orm-plugin-setting.repository");
const mikro_orm_plugin_source_repository_1 = require("./mikro-orm-plugin-source.repository");
const mikro_orm_plugin_subscription_plan_reposittory_1 = require("./mikro-orm-plugin-subscription-plan.reposittory");
const mikro_orm_plugin_subscription_repository_1 = require("./mikro-orm-plugin-subscription.repository");
const mikro_orm_plugin_tag_repository_1 = require("./mikro-orm-plugin-tag.repository");
const mikro_orm_plugin_version_repository_1 = require("./mikro-orm-plugin-version.repository");
const mikro_orm_plugin_repository_1 = require("./mikro-orm-plugin.repository");
const mikro_orm_plugin_tenant_repository_1 = require("./tenant/mikro-orm-plugin-tenant.repository");
const type_orm_plugin_tenant_repository_1 = require("./tenant/type-orm-plugin-tenant.repository");
const type_orm_plugin_billing_repository_1 = require("./type-orm-plugin-billing.repository");
const type_orm_plugin_category_repository_1 = require("./type-orm-plugin-category.repository");
const type_orm_plugin_installation_repository_1 = require("./type-orm-plugin-installation.repository");
const type_orm_plugin_setting_repository_1 = require("./type-orm-plugin-setting.repository");
const type_orm_plugin_source_repository_1 = require("./type-orm-plugin-source.repository");
const type_orm_plugin_subscription_plan_reposittory_1 = require("./type-orm-plugin-subscription-plan.reposittory");
const type_orm_plugin_subscription_repository_1 = require("./type-orm-plugin-subscription.repository");
const type_orm_plugin_tag_repository_1 = require("./type-orm-plugin-tag.repository");
const type_orm_plugin_version_repository_1 = require("./type-orm-plugin-version.repository");
const type_orm_plugin_repository_1 = require("./type-orm-plugin.repository");
exports.repositories = [
    type_orm_plugin_source_repository_1.TypeOrmPluginSourceRepository,
    type_orm_plugin_version_repository_1.TypeOrmPluginVersionRepository,
    type_orm_plugin_repository_1.TypeOrmPluginRepository,
    type_orm_plugin_installation_repository_1.TypeOrmPluginInstallationRepository,
    type_orm_plugin_tenant_repository_1.TypeOrmPluginTenantRepository,
    type_orm_plugin_setting_repository_1.TypeOrmPluginSettingRepository,
    type_orm_plugin_subscription_repository_1.TypeOrmPluginSubscriptionRepository,
    type_orm_plugin_tag_repository_1.TypeOrmPluginTagRepository,
    mikro_orm_plugin_source_repository_1.MikroOrmPluginSourceRepository,
    mikro_orm_plugin_version_repository_1.MikroOrmPluginVersionRepository,
    mikro_orm_plugin_repository_1.MikroOrmPluginRepository,
    mikro_orm_plugin_installation_repository_1.MikroOrmPluginInstallationRepository,
    mikro_orm_plugin_tenant_repository_1.MikroOrmPluginTenantRepository,
    mikro_orm_plugin_setting_repository_1.MikroOrmPluginSettingRepository,
    mikro_orm_plugin_subscription_repository_1.MikroOrmPluginSubscriptionRepository,
    mikro_orm_plugin_tag_repository_1.MikroOrmPluginTagRepository,
    type_orm_plugin_billing_repository_1.TypeOrmPluginBillingRepository,
    mikro_orm_plugin_billing_repository_1.MikroOrmPluginBillingRepository,
    type_orm_plugin_category_repository_1.TypeOrmPluginCategoryRepository,
    mikro_orm_plugin_category_repository_1.MikroOrmPluginCategoryRepository,
    mikro_orm_plugin_subscription_plan_reposittory_1.MikroOrmPluginSubscriptionPlanRepository,
    type_orm_plugin_subscription_plan_reposittory_1.TypeOrmPluginSubscriptionPlanRepository
];
// Export individual repositories
tslib_1.__exportStar(require("./mikro-orm-plugin-billing.repository"), exports);
tslib_1.__exportStar(require("./mikro-orm-plugin-category.repository"), exports);
tslib_1.__exportStar(require("./mikro-orm-plugin-installation.repository"), exports);
tslib_1.__exportStar(require("./mikro-orm-plugin-setting.repository"), exports);
tslib_1.__exportStar(require("./mikro-orm-plugin-source.repository"), exports);
tslib_1.__exportStar(require("./mikro-orm-plugin-subscription-plan.reposittory"), exports);
tslib_1.__exportStar(require("./mikro-orm-plugin-subscription.repository"), exports);
tslib_1.__exportStar(require("./mikro-orm-plugin-tag.repository"), exports);
tslib_1.__exportStar(require("./mikro-orm-plugin-version.repository"), exports);
tslib_1.__exportStar(require("./mikro-orm-plugin.repository"), exports);
tslib_1.__exportStar(require("./tenant/mikro-orm-plugin-tenant.repository"), exports);
tslib_1.__exportStar(require("./tenant/type-orm-plugin-tenant.repository"), exports);
tslib_1.__exportStar(require("./type-orm-plugin-billing.repository"), exports);
tslib_1.__exportStar(require("./type-orm-plugin-category.repository"), exports);
tslib_1.__exportStar(require("./type-orm-plugin-installation.repository"), exports);
tslib_1.__exportStar(require("./type-orm-plugin-setting.repository"), exports);
tslib_1.__exportStar(require("./type-orm-plugin-source.repository"), exports);
tslib_1.__exportStar(require("./type-orm-plugin-subscription-plan.reposittory"), exports);
tslib_1.__exportStar(require("./type-orm-plugin-subscription.repository"), exports);
tslib_1.__exportStar(require("./type-orm-plugin-tag.repository"), exports);
tslib_1.__exportStar(require("./type-orm-plugin-version.repository"), exports);
tslib_1.__exportStar(require("./type-orm-plugin.repository"), exports);
//# sourceMappingURL=index.js.map