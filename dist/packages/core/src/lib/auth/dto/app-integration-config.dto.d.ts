import { IAppIntegrationConfig } from '@gauzy/common';
/**
 * DTO mirroring {@link IAppIntegrationConfig}.
 *
 * Used to give the `POST /auth/email/verify/resend-link` endpoint a concrete, decorated class so
 * `@UseValidationPipe({ whitelist: true })` strips any unexpected body keys (including prototype
 * pollution vectors such as `__proto__`) before the body reaches `deepMerge`.
 */
export declare class AppIntegrationConfigDTO implements IAppIntegrationConfig {
    readonly appName?: string;
    readonly appLogo?: string;
    readonly appSignature?: string;
    readonly appLink?: string;
    readonly appEmailConfirmationUrl?: string;
    readonly appMagicSignUrl?: string;
    readonly companyLink?: string;
    readonly companyName?: string;
}
