/**
 * Base interface for tenant and organization-scoped entities
 */
import { IBaseEntityModel, IBasePerTenantAndOrganizationEntityModel, ID } from './base-entity.model';
import { IEmployee } from './employee.model';
import { IPayment } from './payment.model';
import { IRole } from './role.model';
import { ITag } from './tag.model';
import { IUser } from './user.model';
export declare enum PluginScope {
    TENANT = "tenant",
    ORGANIZATION = "organization",
    USER = "user"
}
export declare enum PluginSettingDataType {
    STRING = "string",
    NUMBER = "number",
    BOOLEAN = "boolean",
    JSON = "json",
    FILE = "file"
}
/**
 * Defines the possible states of a plugin
 */
export declare enum PluginStatus {
    ACTIVE = "ACTIVE",// Plugin is available for use
    INACTIVE = "INACTIVE",// Plugin is not available for use
    DEPRECATED = "DEPRECATED",// Plugin is supported but will be removed in future
    ARCHIVED = "ARCHIVED"
}
/**
 * Defines the supported platform targets for plugins
 */
export declare enum PluginType {
    DESKTOP = "DESKTOP",// Native desktop application plugin
    WEB = "WEB",// Browser-based plugin
    MOBILE = "MOBILE"
}
export declare enum PluginSourceType {
    CDN = "CDN",
    NPM = "NPM",
    GAUZY = "GAUZY"
}
export declare enum PluginOSType {
    LINUX = "LINUX",
    MAC = "MAC",
    WINDOWS = "WINDOWS",
    UNIVERSAL = "UNIVERSAL"
}
export declare enum PluginOSArch {
    X64 = "X64",
    ARM = "ARM"
}
/**
 * Enum for plugin billing status
 */
export declare enum PluginBillingStatus {
    PENDING = "pending",
    PROCESSED = "processed",
    PAID = "paid",
    OVERDUE = "overdue",
    FAILED = "failed",
    CANCELLED = "cancelled",
    REFUNDED = "refunded",
    PARTIALLY_PAID = "partially_paid"
}
/**
 * Plugin subscription information
 */
export interface IPluginSubscription extends IBasePerTenantAndOrganizationEntityModel {
    status: PluginSubscriptionStatus;
    scope: PluginScope;
    startDate: Date;
    endDate?: Date;
    trialEndDate?: Date;
    autoRenew: boolean;
    externalSubscriptionId?: string;
    cancelledAt?: Date;
    cancellationReason?: string;
    plugin: IPlugin;
    pluginId: ID;
    pluginTenant: IPluginTenant;
    pluginTenantId: ID;
    subscriber?: IUser;
    subscriberId?: ID;
    metadata?: Record<string, any>;
    plan?: IPluginSubscriptionPlan;
    planId?: ID;
    parent?: IPluginSubscription;
    parentId?: ID;
    children?: IPluginSubscription[];
    billings?: IPluginBilling[];
    payments?: IPayment[];
}
export interface IPluginSubscriptionPlan extends IBaseEntityModel {
    name: string;
    description?: string;
    type: PluginSubscriptionType;
    price: number;
    currency: string;
    billingPeriod: PluginBillingPeriod;
    features: string[];
    limitations?: Record<string, any>;
    isActive: boolean;
    isPopular?: boolean;
    isRecommended?: boolean;
    trialDays?: number;
    setupFee?: number;
    discountPercentage?: number;
    metadata?: Record<string, any>;
    sortOrder?: number;
    plugin?: IPlugin;
    pluginId: ID;
    createdBy?: IUser;
    createdById?: ID;
    subscriptions?: IPluginSubscription[];
}
export interface IPluginSetting extends IBasePerTenantAndOrganizationEntityModel {
    key: string;
    value: string;
    dataType: PluginSettingDataType;
    defaultValue?: string;
    isRequired: boolean;
    isEncrypted: boolean;
    description?: string;
    order?: number;
    plugin: IPlugin;
    pluginId: ID;
    pluginTenant?: IPluginTenant;
    pluginTenantId?: string;
    category?: IPluginCategory;
    categoryId?: string;
}
export interface IPluginBilling extends IBasePerTenantAndOrganizationEntityModel {
    subscription: IPluginSubscription;
    subscriptionId: ID;
    amount: number;
    currency: string;
    billingDate: Date;
    dueDate: Date;
    status: PluginBillingStatus;
    billingPeriod: PluginBillingPeriod;
    billingPeriodStart: Date;
    billingPeriodEnd: Date;
    description?: string;
    metadata?: Record<string, any>;
}
export interface IPluginPayment extends IBasePerTenantAndOrganizationEntityModel {
    subscriptionId: string;
    billingId?: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    paymentMethod: PaymentMethod;
    transactionId: string;
    gatewayResponse?: Record<string, any>;
    processedAt: Date;
    refundedAt?: Date;
    refundAmount?: number;
    refundReason?: string;
}
export interface IPluginSubscriptionCreateInput {
    pluginId: string;
    planId?: string;
    scope: PluginScope;
    autoRenew?: boolean;
    paymentMethod?: string;
    paymentMethodId?: string;
    promoCode?: string;
    metadata?: Record<string, any>;
}
export type IPluginSubscriptionUpdateInput = Partial<IPluginSubscriptionCreateInput>;
export type IPluginPlanCreateInput = Partial<IPluginSubscriptionPlan>;
export declare enum PluginSubscriptionType {
    FREE = "free",
    TRIAL = "trial",
    BASIC = "basic",
    PREMIUM = "premium",
    ENTERPRISE = "enterprise",
    CUSTOM = "custom"
}
export declare enum PluginSubscriptionStatus {
    ACTIVE = "active",
    CANCELLED = "cancelled",
    EXPIRED = "expired",
    TRIAL = "trial",
    PAST_DUE = "past_due",
    SUSPENDED = "suspended",
    PENDING = "pending"
}
export declare enum PluginBillingPeriod {
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    QUARTERLY = "quarterly",
    YEARLY = "yearly",
    ONE_TIME = "one-time"
}
export declare enum BillingStatus {
    PENDING = "pending",
    PAID = "paid",
    FAILED = "failed",
    CANCELLED = "cancelled",
    REFUNDED = "refunded"
}
export declare enum PaymentStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled",
    REFUNDED = "refunded"
}
export declare enum PaymentMethod {
    CREDIT_CARD = "credit_card",
    DEBIT_CARD = "debit_card",
    PAYPAL = "paypal",
    STRIPE = "stripe",
    BANK_TRANSFER = "bank_transfer",
    CRYPTOCURRENCY = "cryptocurrency"
}
/**
 * CDN-hosted plugin source configuration
 */
export interface ICDNSource extends IPluginSource {
    type: PluginSourceType.CDN;
    url: string;
}
/**
 * NPM-hosted plugin source configuration
 */
export interface INPMSource extends IPluginSource {
    type: PluginSourceType.NPM;
    name: string;
}
/**
 * Gauzy-hosted plugin source configuration
 */
export interface IGauzySource extends IPluginSource {
    type: PluginSourceType.GAUZY;
    url?: string;
    file?: File;
    fileName?: string;
}
/**
 * IPluginTenant Interface
 * Defines the contract for plugin installation and configuration at tenant/organization level
 */
export interface IPluginTenant extends IBasePerTenantAndOrganizationEntityModel {
    /**
     * Whether the plugin is enabled for this tenant
     */
    enabled: boolean;
    /**
     * Scope of the plugin (USER, ORGANIZATION, TENANT)
     */
    scope: PluginScope;
    /**
     * Whether plugin can be installed automatically without user action
     */
    autoInstall?: boolean;
    /**
     * Whether plugin requires admin approval before installation
     */
    requiresApproval?: boolean;
    /**
     * Whether plugin is mandatory for all users in scope
     */
    isMandatory?: boolean;
    /**
     * Maximum number of installations allowed (-1 for unlimited, null for no limit)
     */
    maxInstallations?: number;
    /**
     * Maximum number of active users allowed (-1 for unlimited, null for no limit)
     */
    maxActiveUsers?: number;
    /**
     * Current number of installations
     */
    currentInstallations?: number;
    /**
     * Current number of active users
     */
    currentActiveUsers?: number;
    /**
     * Tenant-specific plugin configuration overrides
     */
    tenantConfiguration?: Record<string, any>;
    /**
     * Plugin preferences and UI customizations for this tenant
     */
    preferences?: Record<string, any>;
    /**
     * Timestamp when the plugin was approved for this tenant
     */
    approvedAt?: Date;
    /**
     * ID of the user who approved the plugin for this tenant
     */
    approvedById?: ID;
    /**
     * Whether plugin data handling complies with tenant data policies
     */
    isDataCompliant?: boolean;
    /**
     * List of compliance certifications applicable to this tenant
     */
    complianceCertifications?: string[];
    /**
     * Plugin ID
     */
    pluginId: ID;
    /**
     * The plugin this configuration applies to
     */
    plugin?: IPlugin;
    /**
     * User who approved the plugin for this tenant
     */
    approvedBy?: IUser;
    /**
     * Roles explicitly allowed to access this plugin
     */
    allowedRoles?: IRole[];
    /**
     * Users explicitly allowed to access this plugin
     */
    allowedUsers?: IUser[];
    /**
     * Users explicitly denied access to this plugin
     */
    deniedUsers?: IUser[];
    /**
     * Plugin settings specific to this tenant
     */
    settings?: IPluginSetting[];
    /**
     * Active subscriptions for this plugin tenant
     */
    subscriptions?: IPluginSubscription[];
    /**
     * Whether any quota (installations or users) is exceeded
     */
    isQuotaExceeded?: boolean;
    /**
     * Whether any limits are configured
     */
    hasLimits?: boolean;
    /**
     * Percentage of installation quota used (0-100)
     */
    installationUtilization?: number;
    /**
     * Percentage of user quota used (0-100)
     */
    userUtilization?: number;
}
export declare enum PluginPricingType {
    FREE = "free",
    ONE_TIME = "one_time",
    SUBSCRIPTION = "subscription",
    FREEMIUM = "freemium",
    USAGE_BASED = "usage_based"
}
/**
 * Main plugin interface definition
 */
export interface IPlugin extends IBaseEntityModel {
    name: string;
    description?: string;
    type: PluginType;
    status: PluginStatus;
    versions: IPluginVersion[];
    version?: IPluginVersion;
    installed: boolean;
    author?: string;
    license?: string;
    homepage?: string;
    repository?: string;
    uploadedBy?: IUser;
    uploadedById?: ID;
    uploadedAt?: Date;
    source?: IPluginSource;
    hasPlan: boolean;
    downloadCount: number;
    lastDownloadedAt?: Date;
    subscriptions?: IPluginSubscription[];
    requiresSubscription?: boolean;
    isFeatured?: boolean;
    isVerified?: boolean;
    categoryId?: ID;
    category?: IPluginCategory;
    tags?: IPluginTag[];
}
/**
 * Plugin category interface
 */
export interface IPluginCategory extends IBasePerTenantAndOrganizationEntityModel {
    name: string;
    description?: string;
    slug?: string;
    color?: string;
    icon?: string;
    order?: number;
    parentId?: ID;
    parent?: IPluginCategory;
}
/**
 * Plugin tag interface
 */
export interface IPluginTag extends IBasePerTenantAndOrganizationEntityModel {
    /**
     * The plugin associated with this tag relationship
     */
    plugin: IPlugin;
    /**
     * ID reference to the plugin
     */
    pluginId: ID;
    /**
     * The tag associated with this plugin relationship
     */
    tag: ITag;
    /**
     * ID reference to the tag
     */
    tagId: ID;
}
/**
 * Interface for creating a new plugin
 */
export interface ICreatePlugin extends Omit<IPlugin, 'id' | 'downloadCount' | 'uploadedAt' | 'lastDownloadedAt' | 'versions'> {
}
/**
 * Interface for updating an existing plugin
 */
export interface IUpdatePlugin extends Partial<ICreatePlugin> {
}
export interface IPluginVersion extends IBasePerTenantAndOrganizationEntityModel {
    number: string;
    changelog: string;
    releaseDate?: Date;
    downloadCount?: number;
    sources?: IPluginSource[];
    installations?: IPluginInstallation[];
    plugin?: IPlugin;
    pluginId?: ID;
    checksum?: string;
    signature?: string;
}
/**
 * Common interface for all plugin source types
 */
export interface IPluginSource extends IBasePerTenantAndOrganizationEntityModel {
    type: PluginSourceType;
    fullName?: string;
    operatingSystem: PluginOSType;
    architecture: PluginOSArch;
    url?: string;
    integrity?: string;
    crossOrigin?: string;
    name?: string;
    registry?: string;
    private?: boolean;
    scope?: string;
    file?: File;
    filePath?: string;
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    fileKey?: string;
    version?: IPluginVersion;
    versionId?: ID;
}
export declare enum PluginInstallationStatus {
    INSTALLED = "INSTALLED",
    UNINSTALLED = "UNINSTALLED",
    FAILED = "FAILED",
    IN_PROGRESS = "IN_PROGRESS"
}
/**
 * Plugin installation record
 */
export interface IPluginInstallation extends IBasePerTenantAndOrganizationEntityModel {
    plugin: IPlugin;
    pluginId?: ID;
    version: IPluginVersion;
    versionId?: ID;
    installedBy?: IEmployee;
    installedById?: ID;
    installedAt?: Date;
    uninstalledAt?: Date;
    status: PluginInstallationStatus;
}
export interface IPluginAccess {
    hasAccess: boolean;
    subscription: IPluginSubscription;
    accessLevel: PluginScope;
    canAssign: boolean;
    canActivate: boolean;
    requiresSubscription: boolean;
}
