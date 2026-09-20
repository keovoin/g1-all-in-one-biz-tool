"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedEntityUpdateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const shared_entity_update_command_1 = require("../shared-entity.update.command");
const shared_entity_service_1 = require("../../shared-entity.service");
let SharedEntityUpdateHandler = class SharedEntityUpdateHandler {
    constructor(sharedEntityService) {
        this.sharedEntityService = sharedEntityService;
    }
    async execute(command) {
        const { id, input } = command;
        return await this.sharedEntityService.update(id, input);
    }
};
exports.SharedEntityUpdateHandler = SharedEntityUpdateHandler;
exports.SharedEntityUpdateHandler = SharedEntityUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(shared_entity_update_command_1.SharedEntityUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [shared_entity_service_1.SharedEntityService])
], SharedEntityUpdateHandler);
//# sourceMappingURL=shared-entity.update.handler.js.map