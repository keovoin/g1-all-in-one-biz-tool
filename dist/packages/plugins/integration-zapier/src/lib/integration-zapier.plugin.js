"use strict";
var IntegrationZapierPlugin_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationZapierPlugin = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const plugin_1 = require("@gauzy/plugin");
const zapier_module_1 = require("./zapier.module");
const zapier_webhook_subscription_entity_1 = require("./zapier-webhook-subscription.entity");
let IntegrationZapierPlugin = IntegrationZapierPlugin_1 = class IntegrationZapierPlugin {
    constructor(_config) {
        this._config = _config;
        this.logger = new common_1.Logger(IntegrationZapierPlugin_1.name);
    }
    /**
     * Lifecycle hook invoked during the plugin's bootstrap phase.
     * Validates essential Zapier OAuth configurations and logs the API base URL.
     */
    onPluginBootstrap() {
        this.logger.log(`${IntegrationZapierPlugin_1.name} is being bootstrapped...`);
        const clientId = this._config.get('zapier.clientId');
        const clientSecret = this._config.get('zapier.clientSecret');
        if (!clientId || !clientSecret) {
            this.logger.warn('Zapier OAuth credentials are not fully configured. Please set GAUZY_ZAPIER_CLIENT_ID and GAUZY_ZAPIER_CLIENT_SECRET.');
        }
        else {
            this.logger.log('Zapier OAuth credentials are configured successfully.');
        }
    }
    /**
     * Called when the plugin is being destroyed.
     */
    onPluginDestroy() {
        this.logger.log(`${IntegrationZapierPlugin_1.name} is being destroyed...`);
    }
};
exports.IntegrationZapierPlugin = IntegrationZapierPlugin;
exports.IntegrationZapierPlugin = IntegrationZapierPlugin = IntegrationZapierPlugin_1 = tslib_1.__decorate([
    (0, plugin_1.GauzyCorePlugin)({
        /**
         * An array of modules that will be imported and registered with the plugin.
         */
        imports: [zapier_module_1.ZapierModule],
        /**
         * Entity needed for Zapier integration that extends the existing
         * IntegrationSetting entity to store webhook subscription data
         */
        entities: [zapier_webhook_subscription_entity_1.ZapierWebhookSubscription],
        /**
         * A callback that receives the main plugin configuration object and allows
         * custom modifications before returning the final configuration.
         *
         * @param {ApplicationPluginConfig} config - The initial plugin configuration object.
         * @returns {ApplicationPluginConfig} - The modified plugin configuration object.
         */
        configuration: (config) => {
            // Initialize customFields if it doesn't exist
            if (!config.customFields) {
                config.customFields = {};
            }
            // Add custom fields for Zapier webhook subscriptions
            const integrationSettingFields = [
                {
                    name: 'webhookSubscriptions',
                    type: 'relation',
                    relationType: 'one-to-many',
                    entity: zapier_webhook_subscription_entity_1.ZapierWebhookSubscription,
                    nullable: true,
                    onDelete: 'CASCADE'
                }
            ];
            // Add custom fields for Zapier webhook subscription details
            const webhookSubscriptionFields = [
                {
                    name: 'targetUrl',
                    type: 'string',
                    nullable: false,
                    index: true
                },
                {
                    name: 'event',
                    type: 'string',
                    nullable: false,
                    index: true
                },
                {
                    name: 'isActive',
                    type: 'boolean',
                    nullable: false,
                    default: true
                }
            ];
            // Update the customFields object properties instead of reassignment
            Object.assign(config.customFields, {
                IntegrationSetting: integrationSettingFields,
                ZapierWebhookSubscription: webhookSubscriptionFields
            });
            return config;
        }
    }),
    tslib_1.__metadata("design:paramtypes", [config_1.ConfigService])
], IntegrationZapierPlugin);
//# sourceMappingURL=integration-zapier.plugin.js.map