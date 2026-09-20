import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@gauzy/config';
import { TimerEventType, TimerEventDataType } from './interfaces/timer-webhook.interface';
import { MakeComService } from './make-com.service';
export declare class WebhookService {
    private readonly configService;
    private readonly httpService;
    private readonly makeComService;
    private readonly logger;
    private readonly ssrfSafeHttpsAgent;
    constructor(configService: ConfigService, httpService: HttpService, makeComService: MakeComService);
    /**
     * Retrieves the Make.com webhook configuration.
     *
     * This method combines the logic of fetching the tenant-specific integration settings and checking
     * whether the integration is enabled. It first attempts to obtain the tenant-specific settings; if they are
     * enabled and contain a valid webhook URL, it returns that URL with the enabled flag set to true.
     * Otherwise, it falls back to the global configuration defined in the environment.
     *
     * @returns A promise that resolves to an object containing:
     *          - enabled: A boolean indicating if the Make.com integration is enabled.
     *          - webhookUrl: A string with the webhook URL, or null if not configured.
     */
    private getWebhookConfig;
    /**
     * Emits a timer event to the Make.com webhook.
     *
     * This function uses the getWebhookConfig() method to determine if the Make.com integration is enabled
     * and to retrieve the webhook URL. If the integration is enabled and a webhook URL is available,
     * it constructs the payload and sends the event via an HTTP POST request.
     *
     * @param eventType - The type of the timer event (e.g., start, stop).
     * @param data - The data payload associated with the timer event, extending TimerEventDataType.
     * @returns A promise that resolves to void when the event is emitted or if the emission is skipped due to configuration issues.
     */
    emitTimerEvent<T extends TimerEventDataType>(eventType: TimerEventType, data: T): Promise<void>;
}
