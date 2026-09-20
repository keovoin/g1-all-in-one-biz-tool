"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyResultBulkCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const keyresult_bulk_create_command_1 = require("../keyresult.bulk.create.command");
const keyresult_service_1 = require("../../keyresult.service");
let KeyResultBulkCreateHandler = class KeyResultBulkCreateHandler {
    constructor(keyResultService) {
        this.keyResultService = keyResultService;
    }
    async execute(command) {
        const { input } = command;
        const createdKeyResults = await this.keyResultService.createBulk(input);
        return createdKeyResults;
    }
};
exports.KeyResultBulkCreateHandler = KeyResultBulkCreateHandler;
exports.KeyResultBulkCreateHandler = KeyResultBulkCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(keyresult_bulk_create_command_1.KeyResultBulkCreateCommand),
    tslib_1.__metadata("design:paramtypes", [keyresult_service_1.KeyResultService])
], KeyResultBulkCreateHandler);
//# sourceMappingURL=keyresult.bulk.create.handler.js.map