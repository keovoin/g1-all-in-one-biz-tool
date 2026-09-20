"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessBillingCommandHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const process_billing_command_1 = require("../process-billing.command");
let ProcessBillingCommandHandler = class ProcessBillingCommandHandler {
    constructor(pluginBillingService) {
        this.pluginBillingService = pluginBillingService;
    }
    async execute(command) {
        const { id } = command;
        return this.pluginBillingService.markAsPaid(id);
    }
};
exports.ProcessBillingCommandHandler = ProcessBillingCommandHandler;
exports.ProcessBillingCommandHandler = ProcessBillingCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(process_billing_command_1.ProcessBillingCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginBillingService])
], ProcessBillingCommandHandler);
//# sourceMappingURL=process-billing.handler.js.map