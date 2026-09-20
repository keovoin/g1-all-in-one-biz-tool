import { DefaultValueDateTypeEnum, IOrganization, WeekDaysEnum, IContact, ITag, IInvoice, IEmployee, IDeal, ISkill, IPayment, IOrganizationSprint, IInvoiceEstimateHistory, IOrganizationAward, IOrganizationLanguage, IFeatureOrganization, IAccountingTemplate, IReportOrganization, IImageAsset, ID, BonusTypeEnum } from '@gauzy/contracts';
import { TenantBaseEntity } from '../core/entities/internal';
export declare class Organization extends TenantBaseEntity implements IOrganization {
    name: string;
    isDefault: boolean;
    profile_link: string;
    banner: string;
    totalEmployees: number;
    short_description: string;
    client_focus: string;
    overview: string;
    imageUrl?: string;
    /**
     * Currency
     *
     * The currency used by the organization, selected from the CurrenciesEnum.
     */
    currency: string;
    valueDate?: Date;
    /**
     * Default Value Date Type
     *
     * The type of default value for a date field, which can be one of the values from DefaultValueDateTypeEnum.
     */
    defaultValueDateType: DefaultValueDateTypeEnum;
    defaultAlignmentType?: string;
    timeZone?: string;
    /**
     * Region Code
     *
     * The code representing a specific region, such as a country or geographical area.
     */
    regionCode?: string;
    brandColor?: string;
    dateFormat?: string;
    officialName?: string;
    /**
     * Start Week On
     *
     * Specifies which day the week starts on. The value must be one of the days from WeekDaysEnum.
     */
    startWeekOn?: WeekDaysEnum;
    taxId?: string;
    numberFormat?: string;
    minimumProjectSize?: string;
    /**
     * Bonus Type
     *
     * The type of bonus, which can be one of the values from BonusTypeEnum.
     */
    bonusType?: BonusTypeEnum;
    /**
     * Bonus Percentage
     *
     * The percentage of profit-based bonus (between 0 and 100).
     */
    bonusPercentage?: number;
    invitesAllowed?: boolean;
    show_income?: boolean;
    show_profits?: boolean;
    show_bonuses_paid?: boolean;
    show_total_hours?: boolean;
    show_minimum_project_size?: boolean;
    show_projects_count?: boolean;
    show_clients_count?: boolean;
    show_clients?: boolean;
    show_employees_count?: boolean;
    /**
     * Default Organization Invite Expiry Period
     *
     * The default period (in days) after which an organization invite expires.
     */
    inviteExpiryPeriod?: number;
    fiscalStartDate?: Date;
    fiscalEndDate?: Date;
    registrationDate?: Date;
    futureDateAllowed?: boolean;
    /**
     * Indicates whether manual time entry is allowed for time tracking.
     *
     * @column
     * @default true
     * @type boolean
     */
    allowManualTime?: boolean;
    /**
     * Indicates whether modification of time entries is allowed for time tracking.
     *
     * @column
     * @default true
     * @type boolean
     */
    allowModifyTime?: boolean;
    /**
     * Indicates whether deletion of time entries is allowed for time tracking.
     *
     * @column
     * @default true
     * @type boolean
     */
    allowDeleteTime?: boolean;
    allowTrackInactivity?: boolean;
    inactivityTimeLimit?: number;
    activityProofDuration?: number;
    requireReason?: boolean;
    requireDescription?: boolean;
    requireProject?: boolean;
    requireTask?: boolean;
    requireClient?: boolean;
    timeFormat?: 12 | 24;
    separateInvoiceItemTaxAndDiscount?: boolean;
    website?: string;
    fiscalInformation?: string;
    currencyPosition?: string;
    discountAfterTax?: boolean;
    defaultStartTime?: string;
    defaultEndTime?: string;
    defaultInvoiceEstimateTerms?: string;
    convertAcceptedEstimates?: boolean;
    daysUntilDue?: number;
    isRemoveIdleTime?: boolean;
    allowScreenshotCapture?: boolean;
    /** Upwork Organization ID */
    upworkOrganizationId?: string;
    /** Upwork Organization Name */
    upworkOrganizationName?: string;
    /**
     * Indicates whether random screenshots are enabled. Defaults to false if not provided.
     */
    randomScreenshot?: boolean;
    /**
     * Indicates whether tracking is enabled during sleep.
     */
    trackOnSleep?: boolean;
    /**
     * Specifies the frequency of capturing screenshots. Defaults to 10 if not provided.
     */
    screenshotFrequency?: number;
    /**
     * Indicates whether a certain rule or behavior is enforced. Defaults to false if not provided.
     */
    enforced?: boolean;
    /**
     * Standard work hours per day for the organization.
     */
    standardWorkHoursPerDay?: number;
    /**
     * Agent Settings
     */
    /**
     * Indicates whether employees can exit the Agent app.
     *
     * @column
     * @default true
     * @type boolean
     */
    allowAgentAppExit?: boolean;
    /**
     * Indicates whether employees can logout from the Agent app.
     *
     * @column
     * @default true
     * @type boolean
     */
    allowLogoutFromAgentApp?: boolean;
    /**
     * Timer Settings
     */
    /**
     * Indicates whether keyboard and mouse activity tracking is enabled.
     *
     * @column
     * @default false
     * @type boolean
     */
    trackKeyboardMouseActivity?: boolean;
    /**
     * Indicates whether tracking should include all displays or just the primary one.
     *
     * @column
     * @default false
     * @type boolean
     */
    trackAllDisplays?: boolean;
    contact: IContact;
    contactId?: ID;
    /**
     * ImageAsset
     */
    image?: IImageAsset;
    imageId?: ID;
    invoices?: IInvoice[];
    employees?: IEmployee[];
    deals?: IDeal[];
    awards?: IOrganizationAward[];
    languages?: IOrganizationLanguage[];
    featureOrganizations?: IFeatureOrganization[];
    payments?: IPayment[];
    organizationSprints?: IOrganizationSprint[];
    invoiceEstimateHistories?: IInvoiceEstimateHistory[];
    accountingTemplates?: IAccountingTemplate[];
    reportOrganizations?: IReportOrganization[];
    tags?: ITag[];
    /**
     * Organization Skills
     */
    skills: ISkill[];
}
