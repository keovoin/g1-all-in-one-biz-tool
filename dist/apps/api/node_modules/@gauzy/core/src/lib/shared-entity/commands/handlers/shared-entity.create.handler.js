"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedEntityCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const shared_entity_create_command_1 = require("../shared-entity.create.command");
const shared_entity_service_1 = require("../../shared-entity.service");
let SharedEntityCreateHandler = class SharedEntityCreateHandler {
    constructor(sharedEntityService) {
        this.sharedEntityService = sharedEntityService;
    }
    async execute(command) {
        const { input } = command;
        return await this.sharedEntityService.create(input);
    }
};
exports.SharedEntityCreateHandler = SharedEntityCreateHandler;
exports.SharedEntityCreateHandler = SharedEntityCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(shared_entity_create_command_1.SharedEntityCreateCommand),
    tslib_1.__metadata("design:paramtypes", [shared_entity_service_1.SharedEntityService])
], SharedEntityCreateHandler);
//# sourceMappingURL=shared-entity.create.handler.js.map