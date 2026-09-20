import { EntityRepositoryType } from '@mikro-orm/core';
import { CurrenciesEnum, IEmployee, PayPeriodEnum, IContact, ISkill, IUser, IOrganizationPosition, IOrganizationTeam, ITimeLog, IOrganizationDepartment, IOrganizationEmploymentType, IInvoiceItem, IRequestApprovalEmployee, IOrganizationProject, IOrganizationContact, IEmployeeSetting, ITimeOffPolicy, ITimeOff as ITimeOffRequest, IExpense, ITimesheet, ITask, ITimeSlot, ITimeSlotSession, IGoal, ICandidate, IEmployeeAward, IEquipmentSharing, IEmployeePhone, IDailyPlan, IOrganizationProjectModule, ID, IFavorite, IComment, IOrganizationSprint, IEmployeeAvailability } from '@gauzy/contracts';
import { Tag, TaskEstimation, TenantOrganizationBaseEntity } from '../core/entities/internal';
import { HasCustomFields } from '../core/entities/custom-entity-fields';
import { EmployeeEntityCustomFields } from '../core/entities/custom-entity-fields/employee';
import { Taggable } from '../tags/tag.types';
import { MikroOrmEmployeeRepository } from './repository/mikro-orm-employee.repository';
export declare class Employee extends TenantOrganizationBaseEntity implements IEmployee, Taggable, HasCustomFields {
    [EntityRepositoryType]?: MikroOrmEmployeeRepository;
    valueDate?: Date;
    short_description?: string;
    description?: string;
    startedWorkOn?: Date;
    endWork?: Date;
    payPeriod?: PayPeriodEnum;
    billRateValue?: number;
    minimumBillingRate?: number;
    billRateCurrency?: CurrenciesEnum;
    reWeeklyLimit?: number;
    offerDate?: Date;
    acceptDate?: Date;
    rejectDate?: Date;
    employeeLevel?: string;
    anonymousBonus?: boolean;
    averageIncome?: number;
    averageBonus?: number;
    totalWorkHours?: number;
    averageExpenses?: number;
    show_anonymous_bonus?: boolean;
    show_average_bonus?: boolean;
    show_average_expenses?: boolean;
    show_average_income?: boolean;
    show_billrate?: boolean;
    show_payperiod?: boolean;
    show_start_work_on?: boolean;
    isJobSearchActive?: boolean;
    linkedInUrl?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    twitterUrl?: string;
    githubUrl?: string;
    gitlabUrl?: string;
    upworkUrl?: string;
    stackoverflowUrl?: string;
    isVerified?: boolean;
    isVetted?: boolean;
    totalJobs?: number;
    jobSuccess?: number;
    profile_link?: string;
    /**
     * Enabled/Disabled Time Tracking Feature
     */
    isTrackingEnabled: boolean;
    /** Employee status (Online/Offline) */
    isOnline?: boolean;
    isAway?: boolean;
    /** Employee time tracking status */
    isTrackingTime?: boolean;
    /**
     * Enabled/Disabled Screen Capture Feature
     */
    allowScreenshotCapture?: boolean;
    /**
     * Indicates whether manual time entry is allowed for time tracking
     * for a specific employee.
     */
    allowManualTime?: boolean;
    /**
     * Indicates whether modification of time entries is allowed for time tracking
     * for a specific employee.
     */
    allowModifyTime?: boolean;
    /**
     * Indicates whether deletion of time entries is allowed for time tracking
     * for a specific employee.
     */
    allowDeleteTime?: boolean;
    /**
     * Indicates whether the agent app exit is allowed for a specific employee.
     * Used ONLY in Agent app to block the user from exiting the application.
     */
    allowAgentAppExit?: boolean;
    /**
     * Indicates whether logout from agent app is allowed for a specific employee.
     * Used ONLY in Agent app to block user from logging out.
     */
    allowLogoutFromAgentApp?: boolean;
    /**
     * Indicates whether keyboard and mouse activity tracking is enabled.
     * Used in all desktop apps/agent to allow keyboard/mouse full activity tracking,
     * including keystrokes and exact mouse movements.
     */
    trackKeyboardMouseActivity?: boolean;
    /**
     * Indicates whether to track all displays or only the primary display.
     * Allows tracking all displays or only primary display.
     */
    trackAllDisplays?: boolean;
    /** Upwork ID */
    upworkId?: string;
    /** LinkedIn ID */
    linkedInId?: string;
    /** Additional virtual columns */
    fullName?: string;
    isDeleted?: boolean;
    /**
     * User
     * Note: Changed from @MultiORMOneToOne to @MultiORMManyToOne to allow
     * one User to have multiple Employee records across different organizations.
     * See: https://github.com/ever-co/ever-gauzy/wiki/Users-vs-Employees
     */
    user: IUser;
    userId: ID;
    /**
     * Contact
     */
    contact?: IContact;
    contactId?: ID;
    /**
     * Candidate
     */
    candidate?: ICandidate;
    organizationPosition?: IOrganizationPosition;
    organizationPositionId?: ID;
    teams?: IOrganizationTeam[];
    projects?: IOrganizationProject[];
    sprints?: IOrganizationSprint[];
    modules?: IOrganizationProjectModule[];
    /**
     * One-to-many relationship with EmployeeAvailability.
     * An employee can have multiple availability records.
     */
    availabilities?: IEmployeeAvailability[];
    /**
     * Estimations
     */
    estimations?: TaskEstimation[];
    /**
     * Time Tracking (Timesheets)
     */
    timesheets?: ITimesheet[];
    /**
     * Time Tracking (Time Logs)
     */
    timeLogs?: ITimeLog[];
    /**
     * Time Tracking (Time Slots)
     */
    timeSlots?: ITimeSlot[];
    /**
     * Time Tracking (Time Slot Sessions)
     */
    timeSlotSessions?: ITimeSlotSession[];
    /**
     *
     */
    invoiceItems?: IInvoiceItem[];
    /**
     *
     */
    requestApprovals?: IRequestApprovalEmployee[];
    settings?: IEmployeeSetting[];
    expenses?: IExpense[];
    /**
     * Goal
     */
    goals?: IGoal[];
    /**
     * Lead
     */
    leads?: IGoal[];
    /**
     * Awards
     */
    awards?: IEmployeeAward[];
    /**
     * Phone Numbers
     */
    phoneNumbers?: IEmployeePhone[];
    /**
     * Daily Plans
     */
    dailyPlans?: IDailyPlan[];
    /**
     * Favorites entity records
     */
    favorites?: IFavorite[];
    /**
     * Employee Tags
     */
    tags?: Tag[];
    /**
     * Employee Skills
     */
    skills?: ISkill[];
    /**
     * Organization Departments
     */
    organizationDepartments?: IOrganizationDepartment[];
    /**
     * Organization Employment Types
     */
    organizationEmploymentTypes?: IOrganizationEmploymentType[];
    /**
     * Employee Organization Contacts
     */
    organizationContacts?: IOrganizationContact[];
    /**
     * TimeOffPolicy
     */
    timeOffPolicies?: ITimeOffPolicy[];
    /**
     * TimeOffRequest
     */
    timeOffRequests?: ITimeOffRequest[];
    /**
     * Task
     */
    tasks?: ITask[];
    /**
     * Equipment Sharing
     */
    equipmentSharings?: IEquipmentSharing[];
    /**
     * Comments
     */
    assignedComments?: IComment[];
    customFields?: EmployeeEntityCustomFields;
}
