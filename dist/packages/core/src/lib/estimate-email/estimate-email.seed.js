"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRandomEstimateEmail = void 0;
exports.createToken = createToken;
const estimate_email_entity_1 = require("./estimate-email.entity");
const faker_1 = require("@faker-js/faker");
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("@gauzy/config");
const createRandomEstimateEmail = async (dataSource, tenants, tenantEmployeeMap, tenantOrganizationsMap) => {
    if (!tenantEmployeeMap) {
        console.warn('Warning: tenantEmployeeMap not found, deal  will not be created');
        return;
    }
    if (!tenantOrganizationsMap) {
        console.warn('Warning: tenantOrganizationsMap not found, deal  will not be created');
        return;
    }
    const estimateEmails = [];
    for (const tenant of tenants) {
        const tenantEmployees = tenantEmployeeMap.get(tenant);
        for (const tenantEmployee of tenantEmployees) {
            const estimateEmail = new estimate_email_entity_1.EstimateEmail();
            let newDate = faker_1.faker.date.recent();
            newDate.setMinutes(faker_1.faker.date.recent().getMinutes() + 15);
            estimateEmail.token = createToken(tenantEmployee.user.email);
            estimateEmail.email = tenantEmployee.user.email;
            estimateEmail.expireDate = newDate;
            estimateEmails.push(estimateEmail);
        }
    }
    await dataSource.manager.save(estimateEmails);
};
exports.createRandomEstimateEmail = createRandomEstimateEmail;
/**
 * Creates a JWT token containing the provided email as payload.
 *
 * @param email - The email address to embed in the token.
 * @returns A JWT token string.
 */
function createToken(email) {
    const token = (0, jsonwebtoken_1.sign)({ email }, config_1.environment.JWT_SECRET, {});
    return token;
}
//# sourceMappingURL=estimate-email.seed.js.map