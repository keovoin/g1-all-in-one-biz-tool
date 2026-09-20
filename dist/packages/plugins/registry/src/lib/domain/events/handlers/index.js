"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventHandlers = void 0;
const tslib_1 = require("tslib");
const plugin_billing_created_handler_1 = require("./plugin-billing-created.handler");
const plugin_billing_failed_handler_1 = require("./plugin-billing-failed.handler");
const plugin_billing_overdue_handler_1 = require("./plugin-billing-overdue.handler");
const plugin_billing_paid_handler_1 = require("./plugin-billing-paid.handler");
exports.eventHandlers = [
    plugin_billing_created_handler_1.PluginBillingCreatedHandler,
    plugin_billing_paid_handler_1.PluginBillingPaidHandler,
    plugin_billing_failed_handler_1.PluginBillingFailedHandler,
    plugin_billing_overdue_handler_1.PluginBillingOverdueHandler
];
tslib_1.__exportStar(require("./plugin-billing-created.handler"), exports);
tslib_1.__exportStar(require("./plugin-billing-failed.handler"), exports);
tslib_1.__exportStar(require("./plugin-billing-overdue.handler"), exports);
tslib_1.__exportStar(require("./plugin-billing-paid.handler"), exports);
//# sourceMappingURL=index.js.map