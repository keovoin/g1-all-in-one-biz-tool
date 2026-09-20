"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceLinkCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const resource_link_service_1 = require("../../resource-link.service");
const resource_link_create_command_1 = require("../resource-link.create.command");
let ResourceLinkCreateHandler = class ResourceLinkCreateHandler {
    constructor(resourceLinkService) {
        this.resourceLinkService = resourceLinkService;
    }
    async execute(command) {
        const { input } = command;
        return await this.resourceLinkService.create(input);
    }
};
exports.ResourceLinkCreateHandler = ResourceLinkCreateHandler;
exports.ResourceLinkCreateHandler = ResourceLinkCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(resource_link_create_command_1.ResourceLinkCreateCommand),
    tslib_1.__metadata("design:paramtypes", [resource_link_service_1.ResourceLinkService])
], ResourceLinkCreateHandler);
//# sourceMappingURL=resource-link.create.handler.js.map