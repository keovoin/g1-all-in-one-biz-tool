"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRandomInvoiceItem = exports.createDefaultInvoiceItem = void 0;
const invoice_item_entity_1 = require("./invoice-item.entity");
const faker_1 = require("@faker-js/faker");
const contracts_1 = require("@gauzy/contracts");
const utils_1 = require("@gauzy/utils");
const internal_1 = require("./../core/entities/internal");
/**
 * Generates and saves invoice items for the specified tenant and organizations.
 *
 * @param dataSource - The TypeORM data source.
 * @param tenant - The tenant for which invoice items are being created.
 * @param organizations - The organizations to associate with the invoice items.
 * @param numberOfInvoiceItemPerInvoice - The number of invoice items per invoice.
 */
const generateAndSaveInvoiceItems = async (dataSource, tenant, organizations, numberOfInvoiceItemPerInvoice) => {
    for await (const organization of organizations) {
        const invoiceItems = await generateInvoiceItemsForType(dataSource, tenant, organization, numberOfInvoiceItemPerInvoice);
        await dataSource.manager.save(invoiceItems);
    }
};
/**
 * Creates default invoice items for a tenant and its organizations.
 *
 * @param dataSource - The TypeORM data source.
 * @param tenant - The tenant for which default invoice items are being created.
 * @param organizations - The organizations to associate with the invoice items.
 * @param numberOfInvoiceItemPerInvoice - The number of invoice items per invoice.
 */
const createDefaultInvoiceItem = async (dataSource, tenant, organizations, numberOfInvoiceItemPerInvoice) => {
    if (!tenant || !organizations || organizations.length === 0) {
        throw new Error('Invalid tenant or organizations provided for default invoice item creation.');
    }
    await generateAndSaveInvoiceItems(dataSource, tenant, organizations, numberOfInvoiceItemPerInvoice);
};
exports.createDefaultInvoiceItem = createDefaultInvoiceItem;
/**
 * Creates random invoice items for multiple tenants and their organizations.
 *
 * @param dataSource - The TypeORM data source.
 * @param tenants - The tenants for which random invoice items are being created.
 * @param tenantOrganizationsMap - A map of tenants to their respective organizations.
 * @param numberOfInvoiceItemPerInvoice - The number of invoice items per invoice.
 * @returns A promise that resolves when all invoice items are created and saved.
 */
const createRandomInvoiceItem = async (dataSource, tenants, tenantOrganizationsMap, numberOfInvoiceItemPerInvoice) => {
    if (!tenants || tenants.length === 0) {
        throw new Error('Tenants list cannot be empty.');
    }
    if (!tenantOrganizationsMap) {
        throw new Error('Tenant organizations map is required.');
    }
    for await (const tenant of tenants) {
        const organizations = tenantOrganizationsMap.get(tenant);
        if (!organizations || organizations.length === 0) {
            console.warn(`No organizations found for tenant: ${tenant.name}`);
            continue;
        }
        await generateAndSaveInvoiceItems(dataSource, tenant, organizations, numberOfInvoiceItemPerInvoice);
    }
};
exports.createRandomInvoiceItem = createRandomInvoiceItem;
/**
 * Generates invoice items based on the invoice type for a given tenant and organization.
 *
 * @param dataSource - The TypeORM data source for database operations.
 * @param tenant - The tenant for which the invoice items are generated.
 * @param organization - The organization to associate with the invoice items.
 * @param numberOfInvoiceItemPerInvoice - The number of invoice items to generate per invoice.
 * @returns A promise that resolves to an array of generated invoice items.
 */
const generateInvoiceItemsForType = async (dataSource, tenant, organization, numberOfInvoiceItemPerInvoice) => {
    const where = { tenantId: tenant.id, organizationId: organization.id };
    // Fetch related entities in parallel
    const [employees, projects, tasks, products, expenses, invoices] = await Promise.all([
        dataSource.manager.find(internal_1.Employee, { where }),
        dataSource.manager.find(internal_1.OrganizationProject, { where }),
        dataSource.manager.find(internal_1.Task, { where }),
        dataSource.manager.find(internal_1.Product, { where }),
        dataSource.manager.find(internal_1.Expense, { where }),
        dataSource.manager.find(internal_1.Invoice, { where })
    ]);
    const invoiceItems = [];
    for (const invoice of invoices) {
        let totalValue = 0;
        for (let i = 0; i < faker_1.faker.number.int({ min: 1, max: numberOfInvoiceItemPerInvoice }); i++) {
            const invoiceItem = new invoice_item_entity_1.InvoiceItem();
            invoiceItem.description = faker_1.faker.lorem.words();
            invoiceItem.price = faker_1.faker.number.int({ min: 10, max: 50 });
            invoiceItem.quantity = faker_1.faker.number.int({ min: 10, max: 20 });
            invoiceItem.totalValue = invoiceItem.price * invoiceItem.quantity;
            invoiceItem.invoice = invoice;
            // Assign related entity based on the invoice type
            switch (invoice.invoiceType) {
                case contracts_1.InvoiceTypeEnum.BY_PROJECT_HOURS:
                    invoiceItem.project = (0, utils_1.getRandomElement)(projects);
                    break;
                case contracts_1.InvoiceTypeEnum.BY_EMPLOYEE_HOURS:
                    invoiceItem.employee = (0, utils_1.getRandomElement)(employees);
                    break;
                case contracts_1.InvoiceTypeEnum.BY_TASK_HOURS:
                    invoiceItem.task = (0, utils_1.getRandomElement)(tasks);
                    break;
                case contracts_1.InvoiceTypeEnum.BY_PRODUCTS:
                    invoiceItem.product = (0, utils_1.getRandomElement)(products);
                    break;
                case contracts_1.InvoiceTypeEnum.BY_EXPENSES:
                    invoiceItem.expense = (0, utils_1.getRandomElement)(expenses);
                    break;
            }
            invoiceItem.applyDiscount = faker_1.faker.datatype.boolean();
            invoiceItem.applyTax = faker_1.faker.datatype.boolean();
            invoiceItem.tenant = tenant;
            invoiceItem.organization = organization;
            totalValue += invoiceItem.totalValue;
            invoiceItems.push(invoiceItem);
        }
        // Update the invoice total value
        invoice.totalValue = totalValue;
        await dataSource.manager.save(invoice);
    }
    return invoiceItems;
};
//# sourceMappingURL=invoice-item.seed.js.map