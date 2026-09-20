"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationFilterEnum = exports.IntegrationTypeEnum = exports.IntegrationTypeGroupEnum = exports.IntegrationEntity = exports.IntegrationEnum = void 0;
var IntegrationEnum;
(function (IntegrationEnum) {
    IntegrationEnum["IMPORT_EXPORT"] = "Import_Export";
    IntegrationEnum["UPWORK"] = "Upwork";
    IntegrationEnum["HUBSTAFF"] = "Hubstaff";
    IntegrationEnum["GAUZY_AI"] = "Gauzy_AI";
    IntegrationEnum["GITHUB"] = "Github";
    IntegrationEnum["JIRA"] = "Jira";
    IntegrationEnum["MakeCom"] = "MakeCom";
    IntegrationEnum["ZAPIER"] = "Zapier";
    IntegrationEnum["ACTIVE_PIECES"] = "ActivePieces";
    IntegrationEnum["SIM"] = "Sim";
    IntegrationEnum["PLANE"] = "Plane";
    IntegrationEnum["EVER_ASYNC"] = "Ever_Async";
})(IntegrationEnum || (exports.IntegrationEnum = IntegrationEnum = {}));
var IntegrationEntity;
(function (IntegrationEntity) {
    IntegrationEntity["PROJECT"] = "Project";
    IntegrationEntity["ORGANIZATION"] = "Organization";
    IntegrationEntity["NOTE"] = "Note";
    IntegrationEntity["CLIENT"] = "Client";
    IntegrationEntity["TASK"] = "Task";
    IntegrationEntity["ISSUE"] = "Issue";
    IntegrationEntity["LABEL"] = "Label";
    IntegrationEntity["ACTIVITY"] = "Activity";
    IntegrationEntity["USER"] = "User";
    IntegrationEntity["EMPLOYEE"] = "Employee";
    IntegrationEntity["TIME_LOG"] = "TimeLog";
    IntegrationEntity["TIME_SLOT"] = "TimeSlot";
    IntegrationEntity["SCREENSHOT"] = "Screenshot";
    IntegrationEntity["INCOME"] = "Income";
    IntegrationEntity["EXPENSE"] = "Expense";
    IntegrationEntity["PROPOSAL"] = "Proposal";
    /** AI Integration Entity */
    IntegrationEntity["JOB_MATCHING"] = "JOB_MATCHING";
    IntegrationEntity["EMPLOYEE_PERFORMANCE"] = "EMPLOYEE_PERFORMANCE";
})(IntegrationEntity || (exports.IntegrationEntity = IntegrationEntity = {}));
var IntegrationTypeGroupEnum;
(function (IntegrationTypeGroupEnum) {
    IntegrationTypeGroupEnum["FEATURED"] = "Featured";
    IntegrationTypeGroupEnum["CATEGORIES"] = "Categories";
})(IntegrationTypeGroupEnum || (exports.IntegrationTypeGroupEnum = IntegrationTypeGroupEnum = {}));
var IntegrationTypeEnum;
(function (IntegrationTypeEnum) {
    IntegrationTypeEnum["ALL_INTEGRATIONS"] = "All Integrations";
    IntegrationTypeEnum["FOR_SALES_TEAMS"] = "For Sales Teams";
    IntegrationTypeEnum["FOR_ACCOUNTANTS"] = "For Accountants";
    IntegrationTypeEnum["FOR_SUPPORT_TEAMS"] = "For Support Teams";
    IntegrationTypeEnum["CRM"] = "CRM";
    IntegrationTypeEnum["SCHEDULING"] = "Scheduling";
    IntegrationTypeEnum["TOOLS"] = "Tools";
    IntegrationTypeEnum["PROJECT_MANAGEMENT"] = "Project Management";
    IntegrationTypeEnum["COMMUNICATION"] = "Communication";
    IntegrationTypeEnum["AUTOMATION_TOOLS"] = "Automation Tools";
    IntegrationTypeEnum["AI_AGENTS"] = "AI Agents";
})(IntegrationTypeEnum || (exports.IntegrationTypeEnum = IntegrationTypeEnum = {}));
var IntegrationFilterEnum;
(function (IntegrationFilterEnum) {
    IntegrationFilterEnum["ALL"] = "All";
    IntegrationFilterEnum["FREE"] = "Free";
    IntegrationFilterEnum["PAID"] = "Paid";
})(IntegrationFilterEnum || (exports.IntegrationFilterEnum = IntegrationFilterEnum = {}));
//# sourceMappingURL=integration.model.js.map