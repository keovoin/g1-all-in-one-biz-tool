"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribers = void 0;
const tslib_1 = require("tslib");
const plugin_installation_subscriber_1 = require("./plugin-installation.subscriber");
const plugin_source_subscriber_1 = require("./plugin-source.subscriber");
const plugin_subscription_subscriber_1 = require("./plugin-subscription.subscriber");
const plugin_version_subscriber_1 = require("./plugin-version.subscriber");
const plugin_subscriber_1 = require("./plugin.subscriber");
exports.subscribers = [
    plugin_source_subscriber_1.PluginSourceSubscriber,
    plugin_version_subscriber_1.PluginVersionSubscriber,
    plugin_subscriber_1.PluginSubscriber,
    plugin_installation_subscriber_1.PluginInstallationSubscriber,
    plugin_subscription_subscriber_1.PluginSubscriptionSubscriber
];
tslib_1.__exportStar(require("./plugin-installation.subscriber"), exports);
tslib_1.__exportStar(require("./plugin-source.subscriber"), exports);
tslib_1.__exportStar(require("./plugin-subscription.subscriber"), exports);
tslib_1.__exportStar(require("./plugin-version.subscriber"), exports);
tslib_1.__exportStar(require("./plugin.subscriber"), exports);
//# sourceMappingURL=index.js.map