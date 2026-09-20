"use strict";
var WebhookService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookService = void 0;
const tslib_1 = require("tslib");
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const config_1 = require("@gauzy/config");
const rxjs_1 = require("rxjs");
const core_1 = require("@gauzy/core");
const make_com_service_1 = require("./make-com.service");
const webhook_url_validator_1 = require("./webhook-url.validator");
let WebhookService = WebhookService_1 = class WebhookService {
    constructor(configService, httpService, makeComService) {
        this.configService = configService;
        this.httpService = httpService;
        this.makeComService = makeComService;
        this.logger = new common_1.Logger(WebhookService_1.name);
        // HTTPS agent that refuses to connect to private/loopback/link-local resolved IPs (anti-SSRF).
        this.ssrfSafeHttpsAgent = (0, webhook_url_validator_1.createSsrfSafeHttpsAgent)();
    }
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
    async getWebhookConfig() {
        try {
            // Retrieve integration settings for the current tenant.
            const settings = await this.makeComService.getIntegrationSettings();
            if (settings?.isEnabled && settings.webhookUrl) {
                return { enabled: true, webhookUrl: settings.webhookUrl };
            }
        }
        catch (error) {
            this.logger.error('Error retrieving integration settings for webhook URL', error);
        }
        // Fallback to the global webhook URL from the environment variable.
        const globalWebhookUrl = this.configService.get('makeCom')?.webhookUrl ?? null;
        return { enabled: !!globalWebhookUrl, webhookUrl: globalWebhookUrl };
    }
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
    async emitTimerEvent(eventType, data) {
        try {
            // Retrieve webhook configuration which includes both the enabled flag and the webhook URL.
            const { enabled, webhookUrl } = await this.getWebhookConfig();
            if (!enabled) {
                this.logger.debug('Make.com integration is not enabled for this tenant, skipping event emission');
                return;
            }
            if (!webhookUrl) {
                this.logger.warn('Make.com webhook URL not configured for this tenant');
                return;
            }
            // SSRF egress guard at request time: re-validate the stored URL before posting, so a
            // malicious value stored before this guard existed (or via DNS changes) is not used as an
            // outbound target (GHSA-534m-c6mh-mp98).
            try {
                (0, webhook_url_validator_1.assertSafeMakeWebhookUrl)(webhookUrl);
            }
            catch (error) {
                this.logger.warn(`Skipping Make.com webhook emission for an unsafe URL: ${error?.message ?? error}`);
                return;
            }
            // Get the current tenant ID.
            const tenantId = core_1.RequestContext.currentTenantId();
            // Construct the payload for the webhook event.
            const payload = {
                event: `timer.${eventType}`,
                data,
                timestamp: new Date().toISOString(),
                tenantId
            };
            // Send the payload to the Make.com webhook.
            await (0, rxjs_1.firstValueFrom)(this.httpService.post(webhookUrl, payload, {
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json'
                },
                // Do not follow redirects: a 30x to an http:// or private host would bypass the
                // httpsAgent SSRF check (the redirected request could use the default agent).
                maxRedirects: 0,
                // Re-validate the resolved destination IP at connection time (anti-DNS-rebinding).
                httpsAgent: this.ssrfSafeHttpsAgent
            }));
            this.logger.log(`Timer ${eventType} event sent to Make.com webhook for tenant ${tenantId}`);
        }
        catch (error) {
            this.logger.error(`Failed to emit timer ${eventType} event to Make.com:`, error);
        }
    }
};
exports.WebhookService = WebhookService;
exports.WebhookService = WebhookService = WebhookService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [config_1.ConfigService,
        axios_1.HttpService,
        make_com_service_1.MakeComService])
], WebhookService);
//# sourceMappingURL=webhook.service.js.map