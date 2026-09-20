/**
 * Monitoring Provider Configuration DTO validation
 * Used to mask secret values in monitoring settings (PostHog, Sentry, Jitsu)
 */
export declare class MonitoringProviderConfigDTO {
    readonly posthogEnabled?: boolean;
    readonly posthogKey?: string;
    readonly posthogHost?: string;
    readonly posthogFlushInterval?: string;
    readonly sentryEnabled?: boolean;
    readonly sentryDsn?: string;
    readonly jitsuEnabled?: boolean;
    readonly jitsuHost?: string;
    readonly jitsuWriteKey?: string;
}
