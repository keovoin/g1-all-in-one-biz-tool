/**
 * `Employee` and `TimeOffPolicy` are registered with `forFeature` here so the service can verify
 * that an allocation targets an employee and a policy of the caller's own organization, without
 * importing their modules and risking a cycle.
 */
export declare class TimeOffBalanceModule {
}
