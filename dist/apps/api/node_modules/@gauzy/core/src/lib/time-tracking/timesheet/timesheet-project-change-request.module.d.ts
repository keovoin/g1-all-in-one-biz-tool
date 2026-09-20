/**
 * Timesheet project change request module (issue #9516).
 *
 * `Timesheet`, `TimeLog` and `OrganizationProject` are registered with `forFeature` here rather
 * than imported from their own modules so that this feature stays a leaf of the module graph and
 * cannot introduce a circular dependency into the time-tracking modules.
 */
export declare class TimesheetProjectChangeRequestModule {
}
