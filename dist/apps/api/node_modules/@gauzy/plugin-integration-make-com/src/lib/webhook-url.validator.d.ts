import { createSsrfSafeHttpsAgent } from '@gauzy/core';
export { createSsrfSafeHttpsAgent };
/**
 * Validates a tenant-supplied Make.com webhook URL against the SSRF egress guard.
 *
 * Throws a {@link BadRequestException} if the URL targets a loopback / private / link-local host
 * (incl. the cloud-metadata IP `169.254.169.254`), uses a non-HTTPS scheme, contains embedded
 * credentials, or is otherwise malformed. Applied both when the URL is stored and again before each
 * outbound request, so values stored before this guard existed are also rejected
 * (GHSA-534m-c6mh-mp98).
 *
 * @param url - The webhook URL to validate.
 */
export declare function assertSafeMakeWebhookUrl(url: string): void;
