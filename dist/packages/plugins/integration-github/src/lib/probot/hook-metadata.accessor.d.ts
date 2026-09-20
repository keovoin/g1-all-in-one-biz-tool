import { Reflector } from '@nestjs/core';
import type { EmitterWebhookEventName } from '@octokit/webhooks';
export declare class HookMetadataAccessor {
    private readonly reflector;
    constructor(reflector: Reflector);
    /**
     * Get the webhook events associated with a target.
     * @param target A function or constructor representing the target class or controller.
     * @returns An array of EmitterWebhookEventName that represent the webhook events.
     */
    getWebhookEvents(target: () => any): EmitterWebhookEventName[];
}
