"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateBulkCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const candidate_bulk_create_command_1 = require("../candidate.bulk.create.command");
const candidate_create_command_1 = require("../candidate.create.command");
let CandidateBulkCreateHandler = class CandidateBulkCreateHandler {
    constructor(_commandBus) {
        this._commandBus = _commandBus;
    }
    async execute(command) {
        try {
            const { input, languageCode, originUrl } = command;
            return await Promise.all(input.map(async (entity) => {
                return await this._commandBus.execute(new candidate_create_command_1.CandidateCreateCommand(entity, languageCode, originUrl));
            }));
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
};
exports.CandidateBulkCreateHandler = CandidateBulkCreateHandler;
exports.CandidateBulkCreateHandler = CandidateBulkCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(candidate_bulk_create_command_1.CandidateBulkCreateCommand),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus])
], CandidateBulkCreateHandler);
//# sourceMappingURL=candidate.bulk.create.handler.js.map