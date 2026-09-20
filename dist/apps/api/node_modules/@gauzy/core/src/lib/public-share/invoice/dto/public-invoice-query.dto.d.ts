/**
 * Allowed relations for the public invoice endpoint.
 *
 * Only relations whose columns are explicitly constrained by the service's
 * `select` clause are permitted.  Any relation not in this enum will be
 * rejected by class-validator.
 */
export declare enum PublicInvoiceRelationEnum {
    'tenant' = "tenant",
    'organization' = "organization",
    'fromOrganization' = "fromOrganization",
    'toContact' = "toContact",
    'invoiceItems' = "invoiceItems",
    'invoiceItems.employee' = "invoiceItems.employee",
    'invoiceItems.employee.user' = "invoiceItems.employee.user",
    'invoiceItems.project' = "invoiceItems.project",
    'invoiceItems.product' = "invoiceItems.product",
    'invoiceItems.expense' = "invoiceItems.expense",
    'invoiceItems.task' = "invoiceItems.task"
}
/**
 * Get public invoice request DTO validation
 */
export declare class PublicInvoiceQueryDTO {
    readonly relations: string[];
}
