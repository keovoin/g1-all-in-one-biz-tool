import { IZapierCreateWebhookInput } from './zapier.types';
import { ZapierWebhookService } from './zapier-webhook.service';
import { ZapierService } from './zapier.service';
import { ZapierWebhookSubscription } from './zapier-webhook-subscription.entity';
export declare class ZapierWebhookController {
    private readonly zapierWebhookService;
    private readonly zapierService;
    private readonly logger;
    constructor(zapierWebhookService: ZapierWebhookService, zapierService: ZapierService);
    /**
     * Handles the incoming request with the provided request body and authorization token.
     *
     * @param body - The request payload containing the data required for processing.
     * @param authorization - The authorization token used for authenticating the request.
     * @returns A promise or response object indicating the outcome of the request (e.g., success status, data, or error).
     */
    createWebhook(body: IZapierCreateWebhookInput, authorization: string): Promise<ZapierWebhookSubscription>;
    /**
     * Validate webhook URL for security
     */
    private validateWebhookUrl;
    /**
     * Validate event name
     */
    private validateEventName;
    /**
     * Deletes an existing Zapier webhook subscription.
     *
     * @param id - The unique identifier of the webhook subscription to delete.
     * @param authorization - The Bearer token for authenticating the request.
     */
    deleteWebhook(id: string, authorization: string): Promise<void>;
}
