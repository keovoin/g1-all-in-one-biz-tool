"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEntityEnum = exports.ActorTypeEnum = void 0;
// Actor type defines if it's User or system performed some action
var ActorTypeEnum;
(function (ActorTypeEnum) {
    ActorTypeEnum["System"] = "System";
    ActorTypeEnum["User"] = "User"; // User performed the action
})(ActorTypeEnum || (exports.ActorTypeEnum = ActorTypeEnum = {}));
// BaseEntityEnum defines the type of the entity, used in BaseEntity model
var BaseEntityEnum;
(function (BaseEntityEnum) {
    BaseEntityEnum["Broadcast"] = "Broadcast";
    BaseEntityEnum["Candidate"] = "Candidate";
    BaseEntityEnum["Comment"] = "Comment";
    BaseEntityEnum["Contact"] = "Contact";
    BaseEntityEnum["Currency"] = "Currency";
    BaseEntityEnum["DailyPlan"] = "DailyPlan";
    BaseEntityEnum["Dashboard"] = "Dashboard";
    BaseEntityEnum["DashboardWidget"] = "DashboardWidget";
    BaseEntityEnum["Document"] = "Document";
    BaseEntityEnum["Employee"] = "Employee";
    BaseEntityEnum["Expense"] = "Expense";
    BaseEntityEnum["Invoice"] = "Invoice";
    BaseEntityEnum["Income"] = "Income";
    BaseEntityEnum["Language"] = "Language";
    BaseEntityEnum["Organization"] = "Organization";
    BaseEntityEnum["OrganizationContact"] = "OrganizationContact";
    BaseEntityEnum["OrganizationDepartment"] = "OrganizationDepartment";
    BaseEntityEnum["OrganizationDocument"] = "OrganizationDocument";
    BaseEntityEnum["OrganizationProject"] = "OrganizationProject";
    BaseEntityEnum["OrganizationTeam"] = "OrganizationTeam";
    BaseEntityEnum["OrganizationProjectModule"] = "OrganizationProjectModule";
    BaseEntityEnum["OrganizationSprint"] = "OrganizationSprint";
    BaseEntityEnum["OrganizationVendor"] = "OrganizationVendor";
    BaseEntityEnum["ResourceLink"] = "ResourceLink";
    BaseEntityEnum["ScreeningTask"] = "ScreeningTask";
    BaseEntityEnum["OrganizationStrategicInitiative"] = "OrganizationStrategicInitiative";
    BaseEntityEnum["Task"] = "Task";
    BaseEntityEnum["TaskLinkedIssue"] = "TaskLinkedIssue";
    BaseEntityEnum["TaskView"] = "TaskView";
    BaseEntityEnum["User"] = "User";
    BaseEntityEnum["Tenant"] = "Tenant";
})(BaseEntityEnum || (exports.BaseEntityEnum = BaseEntityEnum = {}));
//# sourceMappingURL=base-entity.model.js.map