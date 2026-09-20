"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceLinkUpdateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const resource_link_service_1 = require("../../resource-link.service");
const resource_link_update_command_1 = require("../resource-link.update.command");
let ResourceLinkUpdateHandler = class ResourceLinkUpdateHandler {
    constructor(resourceLinkService) {
        this.resourceLinkService = resourceLinkService;
    }
    async execute(command) {
        const { id, input } = command;
        return await this.resourceLinkService.update(id, input);
    }
};
exports.ResourceLinkUpdateHandler = ResourceLinkUpdateHandler;
exports.ResourceLinkUpdateHandler = ResourceLinkUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(resource_link_update_command_1.ResourceLinkUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [resource_link_service_1.ResourceLinkService])
], ResourceLinkUpdateHandler);
//# sourceMappingURL=resource-link.update.handler.js.map