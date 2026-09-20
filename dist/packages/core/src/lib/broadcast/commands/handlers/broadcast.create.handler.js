"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BroadcastCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const broadcast_create_command_1 = require("../broadcast.create.command");
const broadcast_service_1 = require("../../broadcast.service");
let BroadcastCreateHandler = class BroadcastCreateHandler {
    constructor(broadcastService) {
        this.broadcastService = broadcastService;
    }
    async execute(command) {
        const { input } = command;
        return await this.broadcastService.create(input);
    }
};
exports.BroadcastCreateHandler = BroadcastCreateHandler;
exports.BroadcastCreateHandler = BroadcastCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(broadcast_create_command_1.BroadcastCreateCommand),
    tslib_1.__metadata("design:paramtypes", [broadcast_service_1.BroadcastService])
], BroadcastCreateHandler);
//# sourceMappingURL=broadcast.create.handler.js.map