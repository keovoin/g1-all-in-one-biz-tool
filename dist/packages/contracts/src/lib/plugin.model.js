"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginInstallationStatus = exports.PluginPricingType = exports.PaymentMethod = exports.PaymentStatus = exports.BillingStatus = exports.PluginBillingPeriod = exports.PluginSubscriptionStatus = exports.PluginSubscriptionType = exports.PluginBillingStatus = exports.PluginOSArch = exports.PluginOSType = exports.PluginSourceType = exports.PluginType = exports.PluginStatus = exports.PluginSettingDataType = exports.PluginScope = void 0;
var PluginScope;
(function (PluginScope) {
    PluginScope["TENANT"] = "tenant";
    PluginScope["ORGANIZATION"] = "organization";
    PluginScope["USER"] = "user";
})(PluginScope || (exports.PluginScope = PluginScope = {}));
var PluginSettingDataType;
(function (PluginSettingDataType) {
    PluginSettingDataType["STRING"] = "string";
    PluginSettingDataType["NUMBER"] = "number";
    PluginSettingDataType["BOOLEAN"] = "boolean";
    PluginSettingDataType["JSON"] = "json";
    PluginSettingDataType["FILE"] = "file";
})(PluginSettingDataType || (exports.PluginSettingDataType = PluginSettingDataType = {}));
/**
 * Defines the possible states of a plugin
 */
var PluginStatus;
(function (PluginStatus) {
    PluginStatus["ACTIVE"] = "ACTIVE";
    PluginStatus["INACTIVE"] = "INACTIVE";
    PluginStatus["DEPRECATED"] = "DEPRECATED";
    PluginStatus["ARCHIVED"] = "ARCHIVED"; // Plugin is no longer available for new installations
})(PluginStatus || (exports.PluginStatus = PluginStatus = {}));
/**
 * Defines the supported platform targets for plugins
 */
var PluginType;
(function (PluginType) {
    PluginType["DESKTOP"] = "DESKTOP";
    PluginType["WEB"] = "WEB";
    PluginType["MOBILE"] = "MOBILE"; // Added mobile support
})(PluginType || (exports.PluginType = PluginType = {}));
var PluginSourceType;
(function (PluginSourceType) {
    PluginSourceType["CDN"] = "CDN";
    PluginSourceType["NPM"] = "NPM";
    PluginSourceType["GAUZY"] = "GAUZY";
})(PluginSourceType || (exports.PluginSourceType = PluginSourceType = {}));
var PluginOSType;
(function (PluginOSType) {
    PluginOSType["LINUX"] = "LINUX";
    PluginOSType["MAC"] = "MAC";
    PluginOSType["WINDOWS"] = "WINDOWS";
    PluginOSType["UNIVERSAL"] = "UNIVERSAL";
})(PluginOSType || (exports.PluginOSType = PluginOSType = {}));
var PluginOSArch;
(function (PluginOSArch) {
    PluginOSArch["X64"] = "X64";
    PluginOSArch["ARM"] = "ARM";
})(PluginOSArch || (exports.PluginOSArch = PluginOSArch = {}));
/**
 * Enum for plugin billing status
 */
var PluginBillingStatus;
(function (PluginBillingStatus) {
    PluginBillingStatus["PENDING"] = "pending";
    PluginBillingStatus["PROCESSED"] = "processed";
    PluginBillingStatus["PAID"] = "paid";
    PluginBillingStatus["OVERDUE"] = "overdue";
    PluginBillingStatus["FAILED"] = "failed";
    PluginBillingStatus["CANCELLED"] = "cancelled";
    PluginBillingStatus["REFUNDED"] = "refunded";
    PluginBillingStatus["PARTIALLY_PAID"] = "partially_paid";
})(PluginBillingStatus || (exports.PluginBillingStatus = PluginBillingStatus = {}));
var PluginSubscriptionType;
(function (PluginSubscriptionType) {
    PluginSubscriptionType["FREE"] = "free";
    PluginSubscriptionType["TRIAL"] = "trial";
    PluginSubscriptionType["BASIC"] = "basic";
    PluginSubscriptionType["PREMIUM"] = "premium";
    PluginSubscriptionType["ENTERPRISE"] = "enterprise";
    PluginSubscriptionType["CUSTOM"] = "custom";
})(PluginSubscriptionType || (exports.PluginSubscriptionType = PluginSubscriptionType = {}));
var PluginSubscriptionStatus;
(function (PluginSubscriptionStatus) {
    PluginSubscriptionStatus["ACTIVE"] = "active";
    PluginSubscriptionStatus["CANCELLED"] = "cancelled";
    PluginSubscriptionStatus["EXPIRED"] = "expired";
    PluginSubscriptionStatus["TRIAL"] = "trial";
    PluginSubscriptionStatus["PAST_DUE"] = "past_due";
    PluginSubscriptionStatus["SUSPENDED"] = "suspended";
    PluginSubscriptionStatus["PENDING"] = "pending";
})(PluginSubscriptionStatus || (exports.PluginSubscriptionStatus = PluginSubscriptionStatus = {}));
var PluginBillingPeriod;
(function (PluginBillingPeriod) {
    PluginBillingPeriod["DAILY"] = "daily";
    PluginBillingPeriod["WEEKLY"] = "weekly";
    PluginBillingPeriod["MONTHLY"] = "monthly";
    PluginBillingPeriod["QUARTERLY"] = "quarterly";
    PluginBillingPeriod["YEARLY"] = "yearly";
    PluginBillingPeriod["ONE_TIME"] = "one-time";
})(PluginBillingPeriod || (exports.PluginBillingPeriod = PluginBillingPeriod = {}));
var BillingStatus;
(function (BillingStatus) {
    BillingStatus["PENDING"] = "pending";
    BillingStatus["PAID"] = "paid";
    BillingStatus["FAILED"] = "failed";
    BillingStatus["CANCELLED"] = "cancelled";
    BillingStatus["REFUNDED"] = "refunded";
})(BillingStatus || (exports.BillingStatus = BillingStatus = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["COMPLETED"] = "completed";
    PaymentStatus["FAILED"] = "failed";
    PaymentStatus["CANCELLED"] = "cancelled";
    PaymentStatus["REFUNDED"] = "refunded";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CREDIT_CARD"] = "credit_card";
    PaymentMethod["DEBIT_CARD"] = "debit_card";
    PaymentMethod["PAYPAL"] = "paypal";
    PaymentMethod["STRIPE"] = "stripe";
    PaymentMethod["BANK_TRANSFER"] = "bank_transfer";
    PaymentMethod["CRYPTOCURRENCY"] = "cryptocurrency";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var PluginPricingType;
(function (PluginPricingType) {
    PluginPricingType["FREE"] = "free";
    PluginPricingType["ONE_TIME"] = "one_time";
    PluginPricingType["SUBSCRIPTION"] = "subscription";
    PluginPricingType["FREEMIUM"] = "freemium";
    PluginPricingType["USAGE_BASED"] = "usage_based";
})(PluginPricingType || (exports.PluginPricingType = PluginPricingType = {}));
var PluginInstallationStatus;
(function (PluginInstallationStatus) {
    PluginInstallationStatus["INSTALLED"] = "INSTALLED";
    PluginInstallationStatus["UNINSTALLED"] = "UNINSTALLED";
    PluginInstallationStatus["FAILED"] = "FAILED";
    PluginInstallationStatus["IN_PROGRESS"] = "IN_PROGRESS";
})(PluginInstallationStatus || (exports.PluginInstallationStatus = PluginInstallationStatus = {}));
//# sourceMappingURL=plugin.model.js.map