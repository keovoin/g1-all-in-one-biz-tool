"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ORGANIZATION_SENSITIVE_RELATIONS = void 0;
const contracts_1 = require("@gauzy/contracts");
const sharedOrganizationRelations = {
    payments: contracts_1.PermissionsEnum.ORG_PAYMENT_VIEW,
    invoices: contracts_1.PermissionsEnum.ALL_ORG_VIEW,
    invoiceEstimateHistories: contracts_1.PermissionsEnum.ALL_ORG_VIEW,
    accountingTemplates: contracts_1.PermissionsEnum.VIEW_ALL_ACCOUNTING_TEMPLATES,
    employees: {
        _self: contracts_1.PermissionsEnum.ORG_EMPLOYEES_VIEW,
        user: contracts_1.PermissionsEnum.ORG_USERS_VIEW
    },
    featureOrganizations: contracts_1.PermissionsEnum.ALL_ORG_VIEW,
    contact: contracts_1.PermissionsEnum.ORG_CONTACT_VIEW,
    organizationSprints: contracts_1.PermissionsEnum.ORG_SPRINT_VIEW
};
exports.ORGANIZATION_SENSITIVE_RELATIONS = {
    ...sharedOrganizationRelations,
    organization: {
        _self: null,
        ...sharedOrganizationRelations
    }
};
//# sourceMappingURL=organization-sensitive-relations.config.js.map