"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRandomPayment = exports.createDefaultPayment = void 0;
const moment = require("moment");
const faker_1 = require("@faker-js/faker");
const underscore_1 = require("underscore");
const config_1 = require("@gauzy/config");
const contracts_1 = require("@gauzy/contracts");
const utils_1 = require("@gauzy/utils");
const payment_entity_1 = require("./payment.entity");
const internal_1 = require("./../core/entities/internal");
/**
 * Generates payments for a list of invoices.
 *
 * @param invoices - The invoices to generate payments for.
 * @param tenant - The tenant associated with the payments.
 * @param organization - The organization associated with the payments.
 * @param tags - The list of tags to assign to payments.
 * @param employees - The list of employees to associate with payments.
 * @param users - The list of users to record payments.
 * @param projects - The list of projects to associate with payments.
 * @returns An array of generated payments.
 */
const generatePaymentsForInvoices = (invoices, tenant, organization, tags, employees, users, projects) => {
    const payments = [];
    invoices.forEach((invoice) => {
        const range = faker_1.faker.date.between({
            from: new Date(),
            to: moment(new Date()).add(1, 'month').toDate()
        });
        const payment = new payment_entity_1.Payment();
        payment.invoice = invoice;
        payment.paymentDate = moment(range).startOf('day').toDate();
        payment.amount = faker_1.faker.number.int({ min: 500, max: 5000 });
        payment.note = faker_1.faker.lorem.sentence();
        payment.currency = organization.currency || config_1.environment.defaultCurrency;
        payment.paymentMethod = faker_1.faker.helpers.arrayElement(Object.values(contracts_1.PaymentMethodEnum));
        payment.overdue = faker_1.faker.datatype.boolean();
        payment.organization = organization;
        payment.tenant = tenant;
        payment.tags = (0, underscore_1.chain)(tags)
            .shuffle()
            .take(faker_1.faker.number.int({ min: 1, max: 3 }))
            .values()
            .value();
        payment.employee = (0, utils_1.getRandomElement)(employees);
        payment.createdByUser = (0, utils_1.getRandomElement)(users);
        payment.project = (0, utils_1.getRandomElement)(projects);
        payment.organizationContact = invoice.toContact;
        payments.push(payment);
    });
    return payments;
};
/**
 * Creates default payments for a tenant and its organizations.
 *
 * @param dataSource - The TypeORM data source.
 * @param tenant - The tenant for which payments are created.
 * @param employees - The list of employees associated with the tenant.
 * @param organizations - The list of organizations associated with the tenant.
 * @returns A promise that resolves to an array of created payments.
 */
const createDefaultPayment = async (dataSource, tenant, employees, organizations) => {
    if (!tenant || !employees.length || !organizations.length) {
        throw new Error('Invalid input: Tenant, employees, and organizations are required.');
    }
    const payments = [];
    const users = await dataSource.manager.findBy(internal_1.User, { tenantId: tenant.id });
    for await (const organization of organizations) {
        const { id: organizationId } = organization;
        const [projects, tags, invoices] = await Promise.all([
            dataSource.manager.findBy(internal_1.OrganizationProject, { tenantId: tenant.id, organizationId }),
            dataSource.manager.findBy(internal_1.Tag, { tenantId: tenant.id, organizationId }),
            dataSource.manager.find(internal_1.Invoice, {
                where: { tenantId: tenant.id, organizationId, isEstimate: false },
                relations: { toContact: true }
            })
        ]);
        const organizationPayments = generatePaymentsForInvoices(invoices, tenant, organization, tags, employees, users, projects);
        payments.push(...organizationPayments);
    }
    await dataSource.manager.save(payments, { chunk: 100 });
    return payments;
};
exports.createDefaultPayment = createDefaultPayment;
/**
 * Creates random payments for multiple tenants and their organizations.
 *
 * @param dataSource - The TypeORM data source.
 * @param tenants - The list of tenants for which payments are created.
 * @param tenantOrganizationsMap - A map of tenants and their organizations.
 * @param organizationEmployeesMap - A map of organizations and their employees.
 * @returns A promise that resolves to an array of created payments.
 */
const createRandomPayment = async (dataSource, tenants, tenantOrganizationsMap, organizationEmployeesMap) => {
    if (!tenantOrganizationsMap) {
        console.warn('Warning: tenantOrganizationsMap not found, payments will not be created.');
        return [];
    }
    const allPayments = [];
    for await (const tenant of tenants) {
        const { id: tenantId } = tenant;
        const tenantOrgs = tenantOrganizationsMap.get(tenant) || [];
        const users = await dataSource.manager.findBy(internal_1.User, { tenantId });
        for await (const organization of tenantOrgs) {
            const tenantEmployees = organizationEmployeesMap.get(organization) || [];
            const { id: organizationId } = organization;
            const [projects, tags, invoices] = await Promise.all([
                dataSource.manager.findBy(internal_1.OrganizationProject, { tenantId, organizationId }),
                dataSource.manager.findBy(internal_1.Tag, { tenantId, organizationId }),
                dataSource.manager.find(internal_1.Invoice, {
                    where: { tenantId: tenant.id, organizationId, isEstimate: false },
                    relations: { toContact: true }
                })
            ]);
            const organizationPayments = generatePaymentsForInvoices(invoices, tenant, organization, tags, tenantEmployees, users, projects);
            allPayments.push(...organizationPayments);
        }
    }
    await dataSource.manager.save(allPayments, { chunk: 100 });
    return allPayments;
};
exports.createRandomPayment = createRandomPayment;
//# sourceMappingURL=payment.seed.js.map