"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactType = exports.ContactOrganizationInviteStatus = exports.OrganizationContactBudgetTypeEnum = void 0;
var OrganizationContactBudgetTypeEnum;
(function (OrganizationContactBudgetTypeEnum) {
    OrganizationContactBudgetTypeEnum["HOURS"] = "hours";
    OrganizationContactBudgetTypeEnum["COST"] = "cost";
})(OrganizationContactBudgetTypeEnum || (exports.OrganizationContactBudgetTypeEnum = OrganizationContactBudgetTypeEnum = {}));
var ContactOrganizationInviteStatus;
(function (ContactOrganizationInviteStatus) {
    ContactOrganizationInviteStatus["NOT_INVITED"] = "NOT_INVITED";
    ContactOrganizationInviteStatus["INVITED"] = "INVITED";
    ContactOrganizationInviteStatus["ACCEPTED"] = "ACCEPTED";
})(ContactOrganizationInviteStatus || (exports.ContactOrganizationInviteStatus = ContactOrganizationInviteStatus = {}));
var ContactType;
(function (ContactType) {
    ContactType["CLIENT"] = "CLIENT";
    ContactType["CUSTOMER"] = "CUSTOMER";
    ContactType["LEAD"] = "LEAD";
})(ContactType || (exports.ContactType = ContactType = {}));
//# sourceMappingURL=organization-contact.model.js.map