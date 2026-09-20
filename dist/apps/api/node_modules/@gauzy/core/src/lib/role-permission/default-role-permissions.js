"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_ROLE_PERMISSIONS = void 0;
const contracts_1 = require("@gauzy/contracts");
exports.DEFAULT_ROLE_PERMISSIONS = [
    {
        role: contracts_1.RolesEnum.SUPER_ADMIN,
        defaultEnabledPermissions: [
            contracts_1.PermissionsEnum.ADMIN_DASHBOARD_VIEW,
            contracts_1.PermissionsEnum.TEAM_DASHBOARD,
            contracts_1.PermissionsEnum.PROJECT_MANAGEMENT_DASHBOARD,
            contracts_1.PermissionsEnum.TIME_TRACKING_DASHBOARD,
            contracts_1.PermissionsEnum.ACCOUNTING_DASHBOARD,
            contracts_1.PermissionsEnum.HUMAN_RESOURCE_DASHBOARD,
            contracts_1.PermissionsEnum.ORG_PAYMENT_VIEW,
            contracts_1.PermissionsEnum.ORG_PAYMENT_ADD_EDIT,
            contracts_1.PermissionsEnum.ORG_INCOMES_VIEW,
            contracts_1.PermissionsEnum.ORG_INCOMES_EDIT,
            /** Payroll Permissions Start */
            contracts_1.PermissionsEnum.ORG_PAYROLL_VIEW,
            contracts_1.PermissionsEnum.ORG_PAYROLL_EDIT,
            contracts_1.PermissionsEnum.ORG_PAYROLL_APPROVE,
            /** Payroll Permissions End */
            contracts_1.PermissionsEnum.ORG_EXPENSES_VIEW,
            contracts_1.PermissionsEnum.ORG_EXPENSES_EDIT,
            contracts_1.PermissionsEnum.EMPLOYEE_EXPENSES_VIEW,
            contracts_1.PermissionsEnum.EMPLOYEE_EXPENSES_EDIT,
            contracts_1.PermissionsEnum.ORG_PROPOSALS_VIEW,
            contracts_1.PermissionsEnum.ORG_PROPOSALS_EDIT,
            contracts_1.PermissionsEnum.ORG_PROPOSAL_TEMPLATES_VIEW,
            contracts_1.PermissionsEnum.ORG_PROPOSAL_TEMPLATES_EDIT,
            contracts_1.PermissionsEnum.ORG_TASK_ADD,
            contracts_1.PermissionsEnum.ORG_TASK_VIEW,
            contracts_1.PermissionsEnum.ORG_TASK_EDIT,
            contracts_1.PermissionsEnum.ORG_TASK_DELETE,
            contracts_1.PermissionsEnum.SELECT_EMPLOYEE,
            /** Organization Task Setting Permissions Start */
            contracts_1.PermissionsEnum.ORG_TASK_SETTING,
            /** Organization Task Setting Permissions End */
            /** Employee CRUD Permissions Start */
            contracts_1.PermissionsEnum.ORG_EMPLOYEES_ADD,
            contracts_1.PermissionsEnum.ORG_EMPLOYEES_VIEW,
            contracts_1.PermissionsEnum.ORG_EMPLOYEES_EDIT,
            contracts_1.PermissionsEnum.ORG_EMPLOYEES_DELETE,
            /** Employee CRUD Permissions End */
            /** Member View Permissions Start */
            contracts_1.PermissionsEnum.ORG_MEMBERS_VIEW,
            /** Member View Permissions End */
            contracts_1.PermissionsEnum.ORG_CANDIDATES_VIEW,
            contracts_1.PermissionsEnum.ORG_CANDIDATES_EDIT,
            contracts_1.PermissionsEnum.ORG_CANDIDATES_TASK_EDIT,
            contracts_1.PermissionsEnum.ORG_CANDIDATES_INTERVIEW_EDIT,
            contracts_1.PermissionsEnum.ORG_CANDIDATES_INTERVIEW_VIEW,
            contracts_1.PermissionsEnum.ORG_CANDIDATES_INTERVIEWERS_EDIT,
            contracts_1.PermissionsEnum.ORG_CANDIDATES_INTERVIEWERS_VIEW,
            contracts_1.PermissionsEnum.ORG_INVENTORY_VIEW,
            contracts_1.PermissionsEnum.ORG_INVENTORY_PRODUCT_EDIT,
            contracts_1.PermissionsEnum.ORG_CANDIDATES_DOCUMENTS_VIEW,
            contracts_1.PermissionsEnum.ORG_HELP_CENTER_EDIT,
            contracts_1.PermissionsEnum.ORG_USERS_VIEW,
            contracts_1.PermissionsEnum.ORG_USERS_EDIT,
            contracts_1.PermissionsEnum.ALL_ORG_VIEW,
            contracts_1.PermissionsEnum.ALL_ORG_EDIT,
            /** Equipment Sharing Policy Permissions Start */
            contracts_1.PermissionsEnum.EQUIPMENT_SHARING_POLICY_ADD,
            contracts_1.PermissionsEnum.EQUIPMENT_SHARING_POLICY_VIEW,
            contracts_1.PermissionsEnum.EQUIPMENT_SHARING_POLICY_EDIT,
            contracts_1.PermissionsEnum.EQUIPMENT_SHARING_POLICY_DELETE,
            /** Equipment Sharing Policy Permissions End */
            contracts_1.PermissionsEnum.APPROVAL_POLICY_EDIT,
            contracts_1.PermissionsEnum.APPROVAL_POLICY_VIEW,
            contracts_1.PermissionsEnum.REQUEST_APPROVAL_EDIT,
            contracts_1.PermissionsEnum.REQUEST_APPROVAL_VIEW,
            /** Time Off Permissions Start */
            contracts_1.PermissionsEnum.TIME_OFF_ADD,
            contracts_1.PermissionsEnum.TIME_OFF_VIEW,
            contracts_1.PermissionsEnum.TIME_OFF_EDIT,
            contracts_1.PermissionsEnum.TIME_OFF_DELETE,
            /** Time Off Permissions End */
            contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE,
            contracts_1.PermissionsEnum.CHANGE_SELECTED_CANDIDATE,
            contracts_1.PermissionsEnum.CHANGE_SELECTED_ORGANIZATION,
            contracts_1.PermissionsEnum.CHANGE_ROLES_PERMISSIONS,
            contracts_1.PermissionsEnum.ORG_INVITE_VIEW,
            contracts_1.PermissionsEnum.ORG_INVITE_EDIT,
            contracts_1.PermissionsEnum.ACCESS_PRIVATE_PROJECTS,
            contracts_1.PermissionsEnum.TIMESHEET_EDIT_TIME,
            contracts_1.PermissionsEnum.SUPER_ADMIN_EDIT,
            contracts_1.PermissionsEnum.PUBLIC_PAGE_EDIT,
            contracts_1.PermissionsEnum.INVOICES_VIEW,
            contracts_1.PermissionsEnum.INVOICES_EDIT,
            contracts_1.PermissionsEnum.ESTIMATES_VIEW,
            contracts_1.PermissionsEnum.ESTIMATES_EDIT,
            contracts_1.PermissionsEnum.ORG_CANDIDATES_FEEDBACK_EDIT,
            /** Tags Permissions Start */
            contracts_1.PermissionsEnum.ORG_TAGS_ADD,
            contracts_1.PermissionsEnum.ORG_TAGS_VIEW,
            contracts_1.PermissionsEnum.ORG_TAGS_EDIT,
            contracts_1.PermissionsEnum.ORG_TAGS_DELETE,
            /** Tags Permissions End */
            /** Tags Types Permissions Start */
            contracts_1.PermissionsEnum.ORG_TAG_TYPES_ADD,
            contracts_1.PermissionsEnum.ORG_TAG_TYPES_VIEW,
            contracts_1.PermissionsEnum.ORG_TAG_TYPES_EDIT,
            contracts_1.PermissionsEnum.ORG_TAG_TYPES_DELETE,
            /** Tags Types Permissions End */
            contracts_1.PermissionsEnum.VIEW_ALL_EMAILS,
            contracts_1.PermissionsEnum.VIEW_ALL_EMAIL_TEMPLATES,
            contracts_1.PermissionsEnum.VIEW_SALES_PIPELINES,
            contracts_1.PermissionsEnum.EDIT_SALES_PIPELINES,
            contracts_1.PermissionsEnum.CAN_APPROVE_TIMESHEET,
            contracts_1.PermissionsEnum.ORG_SPRINT_ADD,
            contracts_1.PermissionsEnum.ORG_SPRINT_EDIT,
            contracts_1.PermissionsEnum.ORG_SPRINT_VIEW,
            contracts_1.PermissionsEnum.ORG_SPRINT_DELETE,
            contracts_1.PermissionsEnum.ORG_PROJECT_ADD,
            contracts_1.PermissionsEnum.ORG_PROJECT_VIEW,
            contracts_1.PermissionsEnum.ORG_PROJECT_EDIT,
            contracts_1.PermissionsEnum.ORG_PROJECT_DELETE,
            contracts_1.PermissionsEnum.ORG_CONTACT_EDIT,
            contracts_1.PermissionsEnum.ORG_CONTACT_VIEW,
            /** Daily CRUD Permissions Start */
            contracts_1.PermissionsEnum.DAILY_PLAN_CREATE,
            contracts_1.PermissionsEnum.DAILY_PLAN_READ,
            contracts_1.PermissionsEnum.DAILY_PLAN_UPDATE,
            contracts_1.PermissionsEnum.DAILY_PLAN_DELETE,
            /** Daily CRUD Permissions End */
            /** Project Module Permissions start */
            contracts_1.PermissionsEnum.PROJECT_MODULE_CREATE,
            contracts_1.PermissionsEnum.PROJECT_MODULE_READ,
            contracts_1.PermissionsEnum.PROJECT_MODULE_UPDATE,
            contracts_1.PermissionsEnum.PROJECT_MODULE_DELETE,
            /** Project Module Permissions end */
            /** Dashboard Permissions Start */
            contracts_1.PermissionsEnum.DASHBOARD_CREATE,
            contracts_1.PermissionsEnum.DASHBOARD_READ,
            contracts_1.PermissionsEnum.DASHBOARD_UPDATE,
            contracts_1.PermissionsEnum.DASHBOARD_DELETE,
            /** Dashboard Permissions End */
            /** Organization Team */
            contracts_1.PermissionsEnum.ORG_TEAM_ADD,
            contracts_1.PermissionsEnum.ORG_TEAM_VIEW,
            contracts_1.PermissionsEnum.ORG_TEAM_EDIT,
            contracts_1.PermissionsEnum.ORG_TEAM_DELETE,
            contracts_1.PermissionsEnum.ORG_TEAM_EDIT_ACTIVE_TASK,
            contracts_1.PermissionsEnum.ORG_TEAM_REMOVE_ACCOUNT_AS_MEMBER,
            contracts_1.PermissionsEnum.ORG_TEAM_JOIN_REQUEST_VIEW,
            contracts_1.PermissionsEnum.ORG_TEAM_JOIN_REQUEST_EDIT,
            contracts_1.PermissionsEnum.ORG_CONTRACT_EDIT,
            contracts_1.PermissionsEnum.EVENT_TYPES_VIEW,
            contracts_1.PermissionsEnum.TENANT_ADD_EXISTING_USER,
            /** Integration CRUD Permissions Start */
            contracts_1.PermissionsEnum.INTEGRATION_ADD,
            contracts_1.PermissionsEnum.INTEGRATION_VIEW,
            contracts_1.PermissionsEnum.INTEGRATION_EDIT,
            contracts_1.PermissionsEnum.INTEGRATION_DELETE,
            /** Integration CRUD Permissions End */
            /** AI Chat Permissions Start */
            contracts_1.PermissionsEnum.AI_CHAT_ACCESS,
            contracts_1.PermissionsEnum.AI_CHAT_SETTINGS,
            /** AI Chat Permissions End */
            /** Documents Permissions Start */
            contracts_1.PermissionsEnum.DOCS_READ,
            contracts_1.PermissionsEnum.DOCS_CREATE,
            contracts_1.PermissionsEnum.DOCS_UPDATE,
            contracts_1.PermissionsEnum.DOCS_DELETE,
            contracts_1.PermissionsEnum.DOCS_MANAGE,
            contracts_1.PermissionsEnum.DOCS_REVIEW,
            contracts_1.PermissionsEnum.DOCS_AI_IMPORT,
            /** Documents Permissions End */
            contracts_1.PermissionsEnum.IMPORT_ADD,
            contracts_1.PermissionsEnum.EXPORT_ADD,
            contracts_1.PermissionsEnum.FILE_STORAGE_VIEW,
            contracts_1.PermissionsEnum.PAYMENT_GATEWAY_VIEW,
            contracts_1.PermissionsEnum.SMS_GATEWAY_VIEW,
            contracts_1.PermissionsEnum.CUSTOM_SMTP_VIEW,
            /** Job Post Permissions Start */
            contracts_1.PermissionsEnum.ORG_JOB_EMPLOYEE_VIEW,
            contracts_1.PermissionsEnum.ORG_JOB_MATCHING_VIEW,
            contracts_1.PermissionsEnum.ORG_JOB_SEARCH,
            contracts_1.PermissionsEnum.ORG_JOB_APPLY,
            contracts_1.PermissionsEnum.ORG_JOB_EDIT,
            /** Job Post Permissions End */
            contracts_1.PermissionsEnum.ORG_EQUIPMENT_VIEW,
            contracts_1.PermissionsEnum.ORG_EQUIPMENT_EDIT,
            contracts_1.PermissionsEnum.ORG_EQUIPMENT_SHARING_VIEW,
            contracts_1.PermissionsEnum.ORG_EQUIPMENT_SHARING_EDIT,
            contracts_1.PermissionsEnum.EQUIPMENT_MAKE_REQUEST,
            contracts_1.PermissionsEnum.EQUIPMENT_APPROVE_REQUEST,
            contracts_1.PermissionsEnum.ORG_PRODUCT_TYPES_VIEW,
            contracts_1.PermissionsEnum.ORG_PRODUCT_TYPES_EDIT,
            contracts_1.PermissionsEnum.ORG_PRODUCT_CATEGORIES_VIEW,
            contracts_1.PermissionsEnum.ORG_PRODUCT_CATEGORIES_EDIT,
            contracts_1.PermissionsEnum.VIEW_ALL_ACCOUNTING_TEMPLATES,
            contracts_1.PermissionsEnum.MIGRATE_GAUZY_CLOUD,
            contracts_1.PermissionsEnum.INVENTORY_GALLERY_ADD,
            contracts_1.PermissionsEnum.INVENTORY_GALLERY_VIEW,
            contracts_1.PermissionsEnum.INVENTORY_GALLERY_EDIT,
            contracts_1.PermissionsEnum.INVENTORY_GALLERY_DELETE,
            contracts_1.PermissionsEnum.MEDIA_GALLERY_ADD,
            contracts_1.PermissionsEnum.MEDIA_GALLERY_VIEW,
            contracts_1.PermissionsEnum.MEDIA_GALLERY_EDIT,
            contracts_1.PermissionsEnum.MEDIA_GALLERY_DELETE,
            contracts_1.PermissionsEnum.ACCESS_DELETE_ACCOUNT,
            contracts_1.PermissionsEnum.ACCESS_DELETE_ALL_DATA,
            contracts_1.PermissionsEnum.PROFILE_EDIT,
            contracts_1.PermissionsEnum.TIME_TRACKER,
            contracts_1.PermissionsEnum.TENANT_SETTING,
            contracts_1.PermissionsEnum.GLOBAL_SETTING,
            contracts_1.PermissionsEnum.ALLOW_DELETE_TIME,
            contracts_1.PermissionsEnum.ALLOW_MODIFY_TIME,
            contracts_1.PermissionsEnum.ALLOW_MANUAL_TIME,
            contracts_1.PermissionsEnum.DELETE_SCREENSHOTS,
            contracts_1.PermissionsEnum.ORG_MEMBER_LAST_LOG_VIEW,
            /** API Call Log */
            contracts_1.PermissionsEnum.API_CALL_LOG_READ,
            contracts_1.PermissionsEnum.API_CALL_LOG_DELETE,
            /** Tenant API Key */
            contracts_1.PermissionsEnum.TENANT_API_KEY_CREATE,
            contracts_1.PermissionsEnum.TENANT_API_KEY_VIEW,
            contracts_1.PermissionsEnum.TENANT_API_KEY_DELETE,
            /** OAuth App Client Registry (multi-app OAuth provider) */
            contracts_1.PermissionsEnum.OAUTH_CLIENT_VIEW,
            contracts_1.PermissionsEnum.OAUTH_CLIENT_EDIT,
            /** Employee Availability */
            contracts_1.PermissionsEnum.EMPLOYEE_AVAILABILITY_CREATE,
            contracts_1.PermissionsEnum.EMPLOYEE_AVAILABILITY_READ,
            contracts_1.PermissionsEnum.EMPLOYEE_AVAILABILITY_UPDATE,
            contracts_1.PermissionsEnum.EMPLOYEE_AVAILABILITY_DELETE,
            /** Broadcast Permissions Start */
            contracts_1.PermissionsEnum.BROADCAST_CREATE,
            contracts_1.PermissionsEnum.BROADCAST_READ,
            contracts_1.PermissionsEnum.BROADCAST_UPDATE,
            contracts_1.PermissionsEnum.BROADCAST_DELETE,
            /** Broadcast Permissions End */
            /** Organization Strategic Initiative Permissions Start */
            contracts_1.PermissionsEnum.ORG_STRATEGIC_INITIATIVE_CREATE,
            contracts_1.PermissionsEnum.ORG_STRATEGIC_INITIATIVE_READ,
            contracts_1.PermissionsEnum.ORG_STRATEGIC_INITIATIVE_UPDATE,
            contracts_1.PermissionsEnum.ORG_STRATEGIC_INITIATIVE_DELETE,
            /** Organization Strategic Initiative Permissions End */
            // Plugin permissions
            contracts_1.PermissionsEnum.PLUGIN_VIEW,
            contracts_1.PermissionsEnum.PLUGIN_DISCOVER,
            contracts_1.PermissionsEnum.PLUGIN_INSTALL,
            contracts_1.PermissionsEnum.PLUGIN_UNINSTALL,
            contracts_1.PermissionsEnum.PLUGIN_UPDATE,
            contracts_1.PermissionsEnum.PLUGIN_ENABLE,
            contracts_1.PermissionsEnum.PLUGIN_DISABLE,
            contracts_1.PermissionsEnum.PLUGIN_CONFIGURE,
            contracts_1.PermissionsEnum.PLUGIN_PUBLISH,
            contracts_1.PermissionsEnum.PLUGIN_RESTRICT,
            contracts_1.PermissionsEnum.PLUGIN_DELETE,
            contracts_1.PermissionsEnum.PLUGIN_DELETE_FOREVER,
            contracts_1.PermissionsEnum.PLUGIN_ASSIGN_ACCESS
        ]
    },
    {
        role: contracts_1.RolesEnum.ADMIN,
        defaultEnabledPermissions: [
            contracts_1.PermissionsEnum.ADMIN_DASHBOARD_VIEW,
            contracts_1.PermissionsEnum.TEAM_DASHBOARD,
            contracts_1.PermissionsEnum.PROJECT_MANAGEMENT_DASHBOARD,
            contracts_1.PermissionsEnum.TIME_TRACKING_DASHBOARD,
            contracts_1.PermissionsEnum.ACCOUNTING_DASHBOARD,
            contracts_1.PermissionsEnum.HUMAN_RESOURCE_DASHBOARD,
            contracts_1.PermissionsEnum.ORG_PAYMENT_VIEW,
            contracts_1.PermissionsEnum.ORG_PAYMENT_ADD_EDIT,
            contracts_1.PermissionsEnum.ORG_INCOMES_VIEW,
            contracts_1.PermissionsEnum.ORG_INCOMES_EDIT,
            /** Payroll Permissions Start */
            contracts_1.PermissionsEnum.ORG_PAYROLL_VIEW,
            contracts_1.PermissionsEnum.ORG_PAYROLL_EDIT,
            contracts_1.PermissionsEnum.ORG_PAYROLL_APPROVE,
            /** Payroll Permissions End */
            contracts_1.PermissionsEnum.ORG_EXPENSES_VIEW,
            contracts_1.PermissionsEnum.ORG_EXPENSES_EDIT,
            contracts_1.PermissionsEnum.EMPLOYEE_EXPENSES_VIEW,
            contracts_1.PermissionsEnum.EMPLOYEE_EXPENSES_EDIT,
            contracts_1.PermissionsEnum.ORG_PROPOSALS_VIEW,
            contracts_1.PermissionsEnum.ORG_PROPOSALS_EDIT,
            contracts_1.PermissionsEnum.ORG_PROPOSAL_TEMPLATES_VIEW,
            contracts_1.PermissionsEnum.ORG_PROPOSAL_TEMPLATES_EDIT,
            contracts_1.PermissionsEnum.ORG_TASK_ADD,
            contracts_1.PermissionsEnum.ORG_TASK_VIEW,
            contracts_1.PermissionsEnum.ORG_TASK_EDIT,
            contracts_1.PermissionsEnum.ORG_TASK_DELETE,
            contracts_1.PermissionsEnum.SELECT_EMPLOYEE,
            /** Organization Task Setting */
            contracts_1.PermissionsEnum.ORG_TASK_SETTING,
            /** Employee CRUD Permissions Start */
            contracts_1.PermissionsEnum.ORG_EMPLOYEES_ADD,
            contracts_1.PermissionsEnum.ORG_EMPLOYEES_VIEW,
            contracts_1.PermissionsEnum.ORG_EMPLOYEES_EDIT,
            contracts_1.PermissionsEnum.ORG_EMPLOYEES_DELETE,
            /** Employee CRUD Permissions End */
            /** Member View Permissions Start */
            contracts_1.PermissionsEnum.ORG_MEMBERS_VIEW,
            /** Member View Permissions End */
            contracts_1.PermissionsEnum.ORG_EMPLOYEES_EDIT,
            contracts_1.PermissionsEnum.ORG_CANDIDATES_VIEW,
            contracts_1.PermissionsEnum.ORG_CANDIDATES_EDIT,
            contracts_1.PermissionsEnum.ORG_CANDIDATES_TASK_EDIT,
            contracts_1.PermissionsEnum.ORG_CANDIDATES_INTERVIEW_EDIT,
            contracts_1.PermissionsEnum.ORG_CANDIDATES_INTERVIEW_VIEW,
            contracts_1.PermissionsEnum.ORG_CANDIDATES_INTERVIEWERS_EDIT,
            contracts_1.PermissionsEnum.ORG_CANDIDATES_INTERVIEWERS_VIEW,
            contracts_1.PermissionsEnum.ORG_INVENTORY_VIEW,
            contracts_1.PermissionsEnum.ORG_INVENTORY_PRODUCT_EDIT,
            contracts_1.PermissionsEnum.ORG_CANDIDATES_DOCUMENTS_VIEW,
            contracts_1.PermissionsEnum.ORG_HELP_CENTER_EDIT,
            contracts_1.PermissionsEnum.ORG_USERS_VIEW,
            contracts_1.PermissionsEnum.ORG_USERS_EDIT,
            contracts_1.PermissionsEnum.ALL_ORG_VIEW,
            contracts_1.PermissionsEnum.ALL_ORG_EDIT,
            /** Equipment Sharing Policy Permissions Start */
            contracts_1.PermissionsEnum.EQUIPMENT_SHARING_POLICY_ADD,
            contracts_1.PermissionsEnum.EQUIPMENT_SHARING_POLICY_VIEW,
            contracts_1.PermissionsEnum.EQUIPMENT_SHARING_POLICY_EDIT,
            contracts_1.PermissionsEnum.EQUIPMENT_SHARING_POLICY_DELETE,
            /** Equipment Sharing Policy Permissions End */
            contracts_1.PermissionsEnum.APPROVAL_POLICY_EDIT,
            contracts_1.PermissionsEnum.APPROVAL_POLICY_VIEW,
            contracts_1.PermissionsEnum.REQUEST_APPROVAL_EDIT,
            contracts_1.PermissionsEnum.REQUEST_APPROVAL_VIEW,
            /** Time Off Permissions Start */
            contracts_1.PermissionsEnum.TIME_OFF_ADD,
            contracts_1.PermissionsEnum.TIME_OFF_VIEW,
            contracts_1.PermissionsEnum.TIME_OFF_EDIT,
            contracts_1.PermissionsEnum.TIME_OFF_DELETE,
            /** Time Off Permissions End */
            contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE,
            contracts_1.PermissionsEnum.CHANGE_SELECTED_CANDIDATE,
            contracts_1.PermissionsEnum.CHANGE_SELECTED_ORGANIZATION,
            contracts_1.PermissionsEnum.CHANGE_ROLES_PERMISSIONS,
            contracts_1.PermissionsEnum.ORG_INVITE_VIEW,
            contracts_1.PermissionsEnum.ORG_INVITE_EDIT,
            contracts_1.PermissionsEnum.ACCESS_PRIVATE_PROJECTS,
            contracts_1.PermissionsEnum.TIMESHEET_EDIT_TIME,
            contracts_1.PermissionsEnum.PUBLIC_PAGE_EDIT,
            contracts_1.PermissionsEnum.INVOICES_VIEW,
            contracts_1.PermissionsEnum.INVOICES_EDIT,
            contracts_1.PermissionsEnum.ESTIMATES_VIEW,
            contracts_1.PermissionsEnum.ESTIMATES_EDIT,
            contracts_1.PermissionsEnum.ORG_CANDIDATES_FEEDBACK_EDIT,
            /** Tags Permissions Start */
            contracts_1.PermissionsEnum.ORG_TAGS_ADD,
            contracts_1.PermissionsEnum.ORG_TAGS_VIEW,
            contracts_1.PermissionsEnum.ORG_TAGS_EDIT,
            contracts_1.PermissionsEnum.ORG_TAGS_DELETE,
            /** Tags Permissions End */
            /** Tags Types Permissions Start */
            contracts_1.PermissionsEnum.ORG_TAG_TYPES_ADD,
            contracts_1.PermissionsEnum.ORG_TAG_TYPES_VIEW,
            contracts_1.PermissionsEnum.ORG_TAG_TYPES_EDIT,
            contracts_1.PermissionsEnum.ORG_TAG_TYPES_DELETE,
            /** Tags Types Permissions End */
            contracts_1.PermissionsEnum.VIEW_ALL_EMAILS,
            contracts_1.PermissionsEnum.VIEW_ALL_EMAIL_TEMPLATES,
            contracts_1.PermissionsEnum.VIEW_SALES_PIPELINES,
            contracts_1.PermissionsEnum.EDIT_SALES_PIPELINES,
            contracts_1.PermissionsEnum.CAN_APPROVE_TIMESHEET,
            contracts_1.PermissionsEnum.ORG_SPRINT_ADD,
            contracts_1.PermissionsEnum.ORG_SPRINT_EDIT,
            contracts_1.PermissionsEnum.ORG_SPRINT_VIEW,
            contracts_1.PermissionsEnum.ORG_SPRINT_DELETE,
            contracts_1.PermissionsEnum.ORG_PROJECT_ADD,
            contracts_1.PermissionsEnum.ORG_PROJECT_VIEW,
            contracts_1.PermissionsEnum.ORG_PROJECT_EDIT,
            contracts_1.PermissionsEnum.ORG_PROJECT_DELETE,
            contracts_1.PermissionsEnum.ORG_CONTACT_EDIT,
            contracts_1.PermissionsEnum.ORG_CONTACT_VIEW,
            /** Daily CRUD Permissions Start */
            contracts_1.PermissionsEnum.DAILY_PLAN_CREATE,
            contracts_1.PermissionsEnum.DAILY_PLAN_READ,
            contracts_1.PermissionsEnum.DAILY_PLAN_UPDATE,
            contracts_1.PermissionsEnum.DAILY_PLAN_DELETE,
            /** Daily CRUD Permissions End */
            /** Project Module Permissions start */
            contracts_1.PermissionsEnum.PROJECT_MODULE_CREATE,
            contracts_1.PermissionsEnum.PROJECT_MODULE_READ,
            contracts_1.PermissionsEnum.PROJECT_MODULE_UPDATE,
            contracts_1.PermissionsEnum.PROJECT_MODULE_DELETE,
            /** Project Module Permissions end */
            /** Dashboard Permissions Start */
            contracts_1.PermissionsEnum.DASHBOARD_CREATE,
            contracts_1.PermissionsEnum.DASHBOARD_READ,
            contracts_1.PermissionsEnum.DASHBOARD_UPDATE,
            contracts_1.PermissionsEnum.DASHBOARD_DELETE,
            /** Dashboard Permissions End */
            /** Organization Team */
            contracts_1.PermissionsEnum.ORG_TEAM_ADD,
            contracts_1.PermissionsEnum.ORG_TEAM_VIEW,
            contracts_1.PermissionsEnum.ORG_TEAM_EDIT,
            contracts_1.PermissionsEnum.ORG_TEAM_EDIT_ACTIVE_TASK,
            contracts_1.PermissionsEnum.ORG_TEAM_DELETE,
            contracts_1.PermissionsEnum.ORG_TEAM_REMOVE_ACCOUNT_AS_MEMBER,
            contracts_1.PermissionsEnum.ORG_TEAM_JOIN_REQUEST_VIEW,
            contracts_1.PermissionsEnum.ORG_TEAM_JOIN_REQUEST_EDIT,
            contracts_1.PermissionsEnum.ORG_CONTRACT_EDIT,
            contracts_1.PermissionsEnum.EVENT_TYPES_VIEW,
            contracts_1.PermissionsEnum.TENANT_ADD_EXISTING_USER,
            /** Integration CRUD Permissions Start */
            contracts_1.PermissionsEnum.INTEGRATION_ADD,
            contracts_1.PermissionsEnum.INTEGRATION_VIEW,
            contracts_1.PermissionsEnum.INTEGRATION_EDIT,
            contracts_1.PermissionsEnum.INTEGRATION_DELETE,
            /** Integration CRUD Permissions End */
            /** AI Chat Permissions Start */
            contracts_1.PermissionsEnum.AI_CHAT_ACCESS,
            contracts_1.PermissionsEnum.AI_CHAT_SETTINGS,
            /** AI Chat Permissions End */
            /** Documents Permissions Start */
            contracts_1.PermissionsEnum.DOCS_READ,
            contracts_1.PermissionsEnum.DOCS_CREATE,
            contracts_1.PermissionsEnum.DOCS_UPDATE,
            contracts_1.PermissionsEnum.DOCS_DELETE,
            contracts_1.PermissionsEnum.DOCS_MANAGE,
            contracts_1.PermissionsEnum.DOCS_REVIEW,
            contracts_1.PermissionsEnum.DOCS_AI_IMPORT,
            /** Documents Permissions End */
            contracts_1.PermissionsEnum.IMPORT_ADD,
            contracts_1.PermissionsEnum.EXPORT_ADD,
            contracts_1.PermissionsEnum.FILE_STORAGE_VIEW,
            contracts_1.PermissionsEnum.PAYMENT_GATEWAY_VIEW,
            contracts_1.PermissionsEnum.SMS_GATEWAY_VIEW,
            contracts_1.PermissionsEnum.CUSTOM_SMTP_VIEW,
            /** Job Post Permissions Start */
            contracts_1.PermissionsEnum.ORG_JOB_EMPLOYEE_VIEW,
            contracts_1.PermissionsEnum.ORG_JOB_MATCHING_VIEW,
            contracts_1.PermissionsEnum.ORG_JOB_SEARCH,
            contracts_1.PermissionsEnum.ORG_JOB_APPLY,
            contracts_1.PermissionsEnum.ORG_JOB_EDIT,
            /** Job Post Permissions End */
            contracts_1.PermissionsEnum.ORG_EQUIPMENT_VIEW,
            contracts_1.PermissionsEnum.ORG_EQUIPMENT_EDIT,
            contracts_1.PermissionsEnum.ORG_EQUIPMENT_SHARING_VIEW,
            contracts_1.PermissionsEnum.ORG_EQUIPMENT_SHARING_EDIT,
            contracts_1.PermissionsEnum.EQUIPMENT_MAKE_REQUEST,
            contracts_1.PermissionsEnum.EQUIPMENT_APPROVE_REQUEST,
            contracts_1.PermissionsEnum.ORG_PRODUCT_TYPES_VIEW,
            contracts_1.PermissionsEnum.ORG_PRODUCT_TYPES_EDIT,
            contracts_1.PermissionsEnum.ORG_PRODUCT_CATEGORIES_VIEW,
            contracts_1.PermissionsEnum.ORG_PRODUCT_CATEGORIES_EDIT,
            contracts_1.PermissionsEnum.VIEW_ALL_ACCOUNTING_TEMPLATES,
            contracts_1.PermissionsEnum.MIGRATE_GAUZY_CLOUD,
            contracts_1.PermissionsEnum.INVENTORY_GALLERY_ADD,
            contracts_1.PermissionsEnum.INVENTORY_GALLERY_VIEW,
            contracts_1.PermissionsEnum.INVENTORY_GALLERY_EDIT,
            contracts_1.PermissionsEnum.INVENTORY_GALLERY_DELETE,
            contracts_1.PermissionsEnum.MEDIA_GALLERY_ADD,
            contracts_1.PermissionsEnum.MEDIA_GALLERY_VIEW,
            contracts_1.PermissionsEnum.MEDIA_GALLERY_EDIT,
            contracts_1.PermissionsEnum.MEDIA_GALLERY_DELETE,
            contracts_1.PermissionsEnum.ACCESS_DELETE_ACCOUNT,
            contracts_1.PermissionsEnum.ACCESS_DELETE_ALL_DATA,
            contracts_1.PermissionsEnum.PROFILE_EDIT,
            contracts_1.PermissionsEnum.TIME_TRACKER,
            contracts_1.PermissionsEnum.TENANT_SETTING,
            contracts_1.PermissionsEnum.ALLOW_DELETE_TIME,
            contracts_1.PermissionsEnum.ALLOW_MODIFY_TIME,
            contracts_1.PermissionsEnum.ALLOW_MANUAL_TIME,
            contracts_1.PermissionsEnum.DELETE_SCREENSHOTS,
            contracts_1.PermissionsEnum.ORG_MEMBER_LAST_LOG_VIEW,
            /** API Call Log */
            contracts_1.PermissionsEnum.API_CALL_LOG_READ,
            contracts_1.PermissionsEnum.API_CALL_LOG_DELETE,
            /** Tenant API Key */
            contracts_1.PermissionsEnum.TENANT_API_KEY_CREATE,
            contracts_1.PermissionsEnum.TENANT_API_KEY_VIEW,
            contracts_1.PermissionsEnum.TENANT_API_KEY_DELETE,
            /** OAuth App Client Registry (multi-app OAuth provider) */
            contracts_1.PermissionsEnum.OAUTH_CLIENT_VIEW,
            contracts_1.PermissionsEnum.OAUTH_CLIENT_EDIT,
            /** Employee Availability */
            contracts_1.PermissionsEnum.EMPLOYEE_AVAILABILITY_CREATE,
            contracts_1.PermissionsEnum.EMPLOYEE_AVAILABILITY_READ,
            contracts_1.PermissionsEnum.EMPLOYEE_AVAILABILITY_UPDATE,
            contracts_1.PermissionsEnum.EMPLOYEE_AVAILABILITY_DELETE,
            /** Broadcast Permissions Start */
            contracts_1.PermissionsEnum.BROADCAST_CREATE,
            contracts_1.PermissionsEnum.BROADCAST_READ,
            contracts_1.PermissionsEnum.BROADCAST_UPDATE,
            contracts_1.PermissionsEnum.BROADCAST_DELETE,
            /** Broadcast Permissions End */
            /** Organization Strategic Initiative Permissions Start */
            contracts_1.PermissionsEnum.ORG_STRATEGIC_INITIATIVE_CREATE,
            contracts_1.PermissionsEnum.ORG_STRATEGIC_INITIATIVE_READ,
            contracts_1.PermissionsEnum.ORG_STRATEGIC_INITIATIVE_UPDATE,
            contracts_1.PermissionsEnum.ORG_STRATEGIC_INITIATIVE_DELETE,
            /** Organization Strategic Initiative Permissions End */
            // Plugin permissions
            contracts_1.PermissionsEnum.PLUGIN_VIEW,
            contracts_1.PermissionsEnum.PLUGIN_DISCOVER,
            contracts_1.PermissionsEnum.PLUGIN_INSTALL,
            contracts_1.PermissionsEnum.PLUGIN_UNINSTALL,
            contracts_1.PermissionsEnum.PLUGIN_UPDATE,
            contracts_1.PermissionsEnum.PLUGIN_ENABLE,
            contracts_1.PermissionsEnum.PLUGIN_DISABLE,
            contracts_1.PermissionsEnum.PLUGIN_CONFIGURE,
            contracts_1.PermissionsEnum.PLUGIN_PUBLISH,
            contracts_1.PermissionsEnum.PLUGIN_RESTRICT,
            contracts_1.PermissionsEnum.PLUGIN_ASSIGN_ACCESS,
            contracts_1.PermissionsEnum.PLUGIN_DELETE,
            contracts_1.PermissionsEnum.PLUGIN_DELETE_FOREVER
        ]
    },
    {
        role: contracts_1.RolesEnum.DATA_ENTRY,
        defaultEnabledPermissions: [
            contracts_1.PermissionsEnum.ORG_PAYMENT_VIEW,
            contracts_1.PermissionsEnum.ORG_PAYMENT_ADD_EDIT,
            contracts_1.PermissionsEnum.ORG_EXPENSES_EDIT,
            contracts_1.PermissionsEnum.ORG_EXPENSES_VIEW,
            contracts_1.PermissionsEnum.ORG_INCOMES_EDIT,
            contracts_1.PermissionsEnum.ORG_INCOMES_VIEW,
            contracts_1.PermissionsEnum.CHANGE_SELECTED_ORGANIZATION,
            contracts_1.PermissionsEnum.INVOICES_VIEW,
            contracts_1.PermissionsEnum.INVOICES_EDIT,
            contracts_1.PermissionsEnum.ESTIMATES_VIEW,
            contracts_1.PermissionsEnum.ESTIMATES_EDIT,
            contracts_1.PermissionsEnum.ORG_TASK_ADD,
            contracts_1.PermissionsEnum.ORG_TASK_VIEW,
            contracts_1.PermissionsEnum.ORG_TASK_EDIT,
            contracts_1.PermissionsEnum.ORG_TASK_DELETE,
            contracts_1.PermissionsEnum.PROJECT_MODULE_CREATE,
            contracts_1.PermissionsEnum.PROJECT_MODULE_READ,
            contracts_1.PermissionsEnum.PROJECT_MODULE_UPDATE,
            contracts_1.PermissionsEnum.PROJECT_MODULE_DELETE,
            contracts_1.PermissionsEnum.DASHBOARD_CREATE,
            contracts_1.PermissionsEnum.DASHBOARD_READ,
            contracts_1.PermissionsEnum.DASHBOARD_UPDATE,
            contracts_1.PermissionsEnum.DASHBOARD_DELETE,
            contracts_1.PermissionsEnum.ORG_CANDIDATES_TASK_EDIT,
            contracts_1.PermissionsEnum.ORG_CANDIDATES_INTERVIEW_EDIT,
            contracts_1.PermissionsEnum.ORG_CANDIDATES_INTERVIEW_VIEW,
            contracts_1.PermissionsEnum.ORG_CANDIDATES_INTERVIEWERS_EDIT,
            contracts_1.PermissionsEnum.ORG_CANDIDATES_INTERVIEWERS_VIEW,
            contracts_1.PermissionsEnum.ORG_INVENTORY_PRODUCT_EDIT,
            contracts_1.PermissionsEnum.ORG_HELP_CENTER_EDIT,
            contracts_1.PermissionsEnum.PROFILE_EDIT,
            contracts_1.PermissionsEnum.SELECT_EMPLOYEE,
            /** Documents Permissions Start */
            contracts_1.PermissionsEnum.DOCS_READ,
            contracts_1.PermissionsEnum.DOCS_CREATE,
            contracts_1.PermissionsEnum.DOCS_UPDATE,
            /** Documents Permissions End */
            contracts_1.PermissionsEnum.ORG_STRATEGIC_INITIATIVE_READ,
            contracts_1.PermissionsEnum.PLUGIN_VIEW,
            contracts_1.PermissionsEnum.PLUGIN_DISCOVER,
            contracts_1.PermissionsEnum.PLUGIN_CONFIGURE
        ]
    },
    {
        role: contracts_1.RolesEnum.EMPLOYEE,
        defaultEnabledPermissions: [
            contracts_1.PermissionsEnum.ADMIN_DASHBOARD_VIEW,
            contracts_1.PermissionsEnum.PROJECT_MANAGEMENT_DASHBOARD,
            contracts_1.PermissionsEnum.TIME_TRACKING_DASHBOARD,
            contracts_1.PermissionsEnum.HUMAN_RESOURCE_DASHBOARD,
            contracts_1.PermissionsEnum.CHANGE_SELECTED_ORGANIZATION,
            contracts_1.PermissionsEnum.ORG_PROPOSALS_VIEW,
            contracts_1.PermissionsEnum.ORG_PROPOSALS_EDIT,
            contracts_1.PermissionsEnum.ORG_PROPOSAL_TEMPLATES_VIEW,
            contracts_1.PermissionsEnum.ORG_PROPOSAL_TEMPLATES_EDIT,
            contracts_1.PermissionsEnum.SELECT_EMPLOYEE,
            /** AI Chat Permissions Start */
            contracts_1.PermissionsEnum.AI_CHAT_ACCESS,
            /** AI Chat Permissions End */
            /** Documents Permissions Start */
            contracts_1.PermissionsEnum.DOCS_READ,
            contracts_1.PermissionsEnum.DOCS_CREATE,
            contracts_1.PermissionsEnum.DOCS_UPDATE,
            /** Documents Permissions End */
            /** Time Off Permissions Start */
            contracts_1.PermissionsEnum.TIME_OFF_VIEW,
            /** Time Off Permissions End */
            contracts_1.PermissionsEnum.ORG_INVITE_VIEW,
            contracts_1.PermissionsEnum.ORG_INVITE_EDIT,
            /** Equipment Sharing Policy Permissions Start */
            contracts_1.PermissionsEnum.EQUIPMENT_SHARING_POLICY_VIEW,
            /** Equipment Sharing Policy Permissions End */
            contracts_1.PermissionsEnum.APPROVAL_POLICY_EDIT,
            contracts_1.PermissionsEnum.APPROVAL_POLICY_VIEW,
            contracts_1.PermissionsEnum.REQUEST_APPROVAL_EDIT,
            contracts_1.PermissionsEnum.REQUEST_APPROVAL_VIEW,
            contracts_1.PermissionsEnum.ORG_TASK_ADD,
            contracts_1.PermissionsEnum.ORG_TASK_VIEW,
            contracts_1.PermissionsEnum.ORG_TASK_EDIT,
            /** Member View Permissions Start */
            contracts_1.PermissionsEnum.ORG_MEMBERS_VIEW,
            /** Member View Permissions End */
            contracts_1.PermissionsEnum.ORG_CANDIDATES_TASK_EDIT,
            contracts_1.PermissionsEnum.EVENT_TYPES_VIEW,
            contracts_1.PermissionsEnum.TIME_TRACKER,
            contracts_1.PermissionsEnum.INVOICES_VIEW,
            contracts_1.PermissionsEnum.INVOICES_EDIT,
            contracts_1.PermissionsEnum.ESTIMATES_VIEW,
            contracts_1.PermissionsEnum.ESTIMATES_EDIT,
            contracts_1.PermissionsEnum.ORG_CONTACT_VIEW,
            contracts_1.PermissionsEnum.ORG_PROJECT_ADD,
            contracts_1.PermissionsEnum.ORG_PROJECT_VIEW,
            /** Daily Plan */
            contracts_1.PermissionsEnum.DAILY_PLAN_CREATE,
            contracts_1.PermissionsEnum.DAILY_PLAN_READ,
            contracts_1.PermissionsEnum.DAILY_PLAN_UPDATE,
            contracts_1.PermissionsEnum.DAILY_PLAN_DELETE,
            /** Project Module */
            contracts_1.PermissionsEnum.PROJECT_MODULE_CREATE,
            contracts_1.PermissionsEnum.PROJECT_MODULE_READ,
            contracts_1.PermissionsEnum.PROJECT_MODULE_UPDATE,
            contracts_1.PermissionsEnum.PROJECT_MODULE_DELETE,
            /** Dashboard */
            contracts_1.PermissionsEnum.DASHBOARD_CREATE,
            contracts_1.PermissionsEnum.DASHBOARD_READ,
            contracts_1.PermissionsEnum.DASHBOARD_UPDATE,
            contracts_1.PermissionsEnum.DASHBOARD_DELETE,
            /** Organization Team */
            contracts_1.PermissionsEnum.ORG_TEAM_ADD,
            contracts_1.PermissionsEnum.ORG_TEAM_VIEW,
            contracts_1.PermissionsEnum.ORG_TEAM_EDIT,
            contracts_1.PermissionsEnum.ORG_TEAM_DELETE,
            contracts_1.PermissionsEnum.ORG_TEAM_EDIT_ACTIVE_TASK,
            contracts_1.PermissionsEnum.ORG_TEAM_REMOVE_ACCOUNT_AS_MEMBER,
            contracts_1.PermissionsEnum.ORG_TEAM_JOIN_REQUEST_VIEW,
            /** Tags Permissions Start */
            contracts_1.PermissionsEnum.ORG_TAGS_ADD,
            contracts_1.PermissionsEnum.ORG_TAGS_VIEW,
            contracts_1.PermissionsEnum.ORG_TAGS_EDIT,
            contracts_1.PermissionsEnum.ORG_TAGS_DELETE,
            /** Tags Permissions End */
            /** Tags Types Permissions Start */
            contracts_1.PermissionsEnum.ORG_TAG_TYPES_ADD,
            contracts_1.PermissionsEnum.ORG_TAG_TYPES_VIEW,
            contracts_1.PermissionsEnum.ORG_TAG_TYPES_EDIT,
            contracts_1.PermissionsEnum.ORG_TAG_TYPES_DELETE,
            /** Tags Types Permissions End */
            contracts_1.PermissionsEnum.EMPLOYEE_EXPENSES_VIEW,
            contracts_1.PermissionsEnum.EMPLOYEE_EXPENSES_EDIT,
            contracts_1.PermissionsEnum.INVENTORY_GALLERY_ADD,
            contracts_1.PermissionsEnum.INVENTORY_GALLERY_VIEW,
            contracts_1.PermissionsEnum.INVENTORY_GALLERY_EDIT,
            contracts_1.PermissionsEnum.INVENTORY_GALLERY_DELETE,
            contracts_1.PermissionsEnum.MEDIA_GALLERY_ADD,
            contracts_1.PermissionsEnum.MEDIA_GALLERY_VIEW,
            contracts_1.PermissionsEnum.MEDIA_GALLERY_EDIT,
            contracts_1.PermissionsEnum.MEDIA_GALLERY_DELETE,
            contracts_1.PermissionsEnum.ORG_INVENTORY_VIEW,
            contracts_1.PermissionsEnum.ORG_EQUIPMENT_VIEW,
            contracts_1.PermissionsEnum.ORG_EQUIPMENT_SHARING_VIEW,
            contracts_1.PermissionsEnum.EQUIPMENT_MAKE_REQUEST,
            contracts_1.PermissionsEnum.ORG_PRODUCT_TYPES_VIEW,
            contracts_1.PermissionsEnum.ORG_PRODUCT_CATEGORIES_VIEW,
            contracts_1.PermissionsEnum.ACCESS_DELETE_ACCOUNT,
            contracts_1.PermissionsEnum.PROFILE_EDIT,
            contracts_1.PermissionsEnum.ALLOW_DELETE_TIME,
            contracts_1.PermissionsEnum.ALLOW_MODIFY_TIME,
            contracts_1.PermissionsEnum.ALLOW_MANUAL_TIME,
            contracts_1.PermissionsEnum.DELETE_SCREENSHOTS,
            contracts_1.PermissionsEnum.ORG_MEMBER_LAST_LOG_VIEW,
            /** Employee Availability */
            contracts_1.PermissionsEnum.EMPLOYEE_AVAILABILITY_CREATE,
            contracts_1.PermissionsEnum.EMPLOYEE_AVAILABILITY_READ,
            contracts_1.PermissionsEnum.EMPLOYEE_AVAILABILITY_UPDATE,
            contracts_1.PermissionsEnum.EMPLOYEE_AVAILABILITY_DELETE,
            /** Broadcast Permissions Start */
            contracts_1.PermissionsEnum.BROADCAST_CREATE,
            contracts_1.PermissionsEnum.BROADCAST_READ,
            contracts_1.PermissionsEnum.BROADCAST_UPDATE,
            contracts_1.PermissionsEnum.BROADCAST_DELETE,
            /** Broadcast Permissions End */
            /** Organization Strategic Initiative Permissions Start */
            contracts_1.PermissionsEnum.ORG_STRATEGIC_INITIATIVE_READ,
            /** Organization Strategic Initiative Permissions End */
            // Plugin permissions
            contracts_1.PermissionsEnum.PLUGIN_VIEW,
            contracts_1.PermissionsEnum.PLUGIN_DISCOVER,
            contracts_1.PermissionsEnum.PLUGIN_INSTALL,
            contracts_1.PermissionsEnum.PLUGIN_UNINSTALL
        ]
    },
    {
        role: contracts_1.RolesEnum.INTERVIEWER,
        defaultEnabledPermissions: [
            contracts_1.PermissionsEnum.ORG_CANDIDATES_INTERVIEW_EDIT,
            contracts_1.PermissionsEnum.ORG_CANDIDATES_INTERVIEW_VIEW,
            contracts_1.PermissionsEnum.ORG_CANDIDATES_DOCUMENTS_VIEW,
            contracts_1.PermissionsEnum.ORG_STRATEGIC_INITIATIVE_READ,
            contracts_1.PermissionsEnum.PLUGIN_VIEW
        ]
    },
    {
        role: contracts_1.RolesEnum.CANDIDATE,
        defaultEnabledPermissions: [
            contracts_1.PermissionsEnum.ORG_STRATEGIC_INITIATIVE_READ,
            contracts_1.PermissionsEnum.PLUGIN_VIEW
        ]
    },
    {
        role: contracts_1.RolesEnum.MANAGER,
        defaultEnabledPermissions: [
            /** Organization Strategic Initiative Permissions Start */
            contracts_1.PermissionsEnum.ORG_STRATEGIC_INITIATIVE_CREATE,
            contracts_1.PermissionsEnum.ORG_STRATEGIC_INITIATIVE_READ,
            contracts_1.PermissionsEnum.ORG_STRATEGIC_INITIATIVE_UPDATE,
            contracts_1.PermissionsEnum.ORG_STRATEGIC_INITIATIVE_DELETE,
            /** Organization Strategic Initiative Permissions End */
            /** Documents Permissions Start */
            contracts_1.PermissionsEnum.DOCS_READ,
            contracts_1.PermissionsEnum.DOCS_CREATE,
            contracts_1.PermissionsEnum.DOCS_UPDATE,
            contracts_1.PermissionsEnum.DOCS_DELETE,
            contracts_1.PermissionsEnum.DOCS_REVIEW,
            contracts_1.PermissionsEnum.DOCS_AI_IMPORT,
            /** Documents Permissions End */
            // Plugin permissions
            contracts_1.PermissionsEnum.PLUGIN_VIEW,
            contracts_1.PermissionsEnum.PLUGIN_DISCOVER,
            contracts_1.PermissionsEnum.PLUGIN_INSTALL,
            contracts_1.PermissionsEnum.PLUGIN_UNINSTALL,
            contracts_1.PermissionsEnum.PLUGIN_UPDATE,
            contracts_1.PermissionsEnum.PLUGIN_ENABLE,
            contracts_1.PermissionsEnum.PLUGIN_DISABLE,
            contracts_1.PermissionsEnum.PLUGIN_CONFIGURE,
            contracts_1.PermissionsEnum.PLUGIN_DELETE
        ]
    },
    {
        role: contracts_1.RolesEnum.VIEWER,
        defaultEnabledPermissions: [
            contracts_1.PermissionsEnum.ORG_STRATEGIC_INITIATIVE_READ,
            /** Documents Permissions Start */
            contracts_1.PermissionsEnum.DOCS_READ,
            /** Documents Permissions End */
            contracts_1.PermissionsEnum.PLUGIN_VIEW,
            contracts_1.PermissionsEnum.PLUGIN_DISCOVER
        ]
    }
];
//# sourceMappingURL=default-role-permissions.js.map