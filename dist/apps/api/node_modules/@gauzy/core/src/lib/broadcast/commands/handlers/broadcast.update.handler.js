"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BroadcastUpdateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const broadcast_update_command_1 = require("../broadcast.update.command");
const broadcast_service_1 = require("../../broadcast.service");
let BroadcastUpdateHandler = class BroadcastUpdateHandler {
    constructor(broadcastService) {
        this.broadcastService = broadcastService;
    }
    async execute(command) {
        const { id, input } = command;
        return await this.broadcastService.update(id, input);
    }
};
exports.BroadcastUpdateHandler = BroadcastUpdateHandler;
exports.BroadcastUpdateHandler = BroadcastUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(broadcast_update_command_1.BroadcastUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [broadcast_service_1.BroadcastService])
], BroadcastUpdateHandler);
//# sourceMappingURL=broadcast.update.handler.js.map