/**
 * Payroll runs and their line items (issue #2453).
 *
 * `Employee` is registered with `forFeature` here so the service can verify that a line item is
 * paid to somebody in the caller's own organization, without importing `EmployeeModule` and
 * risking a cycle.
 */
export declare class PayrollRunModule {
}
