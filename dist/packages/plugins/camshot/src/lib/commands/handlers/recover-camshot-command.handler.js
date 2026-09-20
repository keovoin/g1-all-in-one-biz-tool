"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecoverCamshotCommandHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const recover_camshot_command_1 = require("../recover-camshot.command");
const camshot_service_1 = require("../../services/camshot.service");
const common_1 = require("@nestjs/common");
let RecoverCamshotCommandHandler = class RecoverCamshotCommandHandler {
    constructor(camshotService) {
        this.camshotService = camshotService;
    }
    async execute(command) {
        const { id } = command;
        const recovered = await this.camshotService.softRecover(id, {
            withDeleted: true
        });
        if (!recovered) {
            throw new common_1.NotFoundException(`Camshot with ID '${id}' was not found or could not be recovered. It may not exist, may not be deleted, or there was an issue during the recovery process.`);
        }
        return recovered;
    }
};
exports.RecoverCamshotCommandHandler = RecoverCamshotCommandHandler;
exports.RecoverCamshotCommandHandler = RecoverCamshotCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(recover_camshot_command_1.RecoverCamshotCommand),
    tslib_1.__metadata("design:paramtypes", [camshot_service_1.CamshotService])
], RecoverCamshotCommandHandler);
//# sourceMappingURL=recover-camshot-command.handler.js.map