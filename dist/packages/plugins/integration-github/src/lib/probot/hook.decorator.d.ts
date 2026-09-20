import type { EmitterWebhookEventName } from '@octokit/webhooks';
/**
 * Sets up hook trigger on functions.
 * @param eventOrEvents The GitHub webhook event(s) to trigger this function.
 */
export declare function Hook(eventOrEvents: EmitterWebhookEventName | EmitterWebhookEventName[]): MethodDecorator;
