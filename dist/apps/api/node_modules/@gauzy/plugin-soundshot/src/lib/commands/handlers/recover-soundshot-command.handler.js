"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecoverSoundshotCommandHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const recover_soundshot_command_1 = require("../recover-soundshot.command");
const soundshot_service_1 = require("../../services/soundshot.service");
const common_1 = require("@nestjs/common");
let RecoverSoundshotCommandHandler = class RecoverSoundshotCommandHandler {
    constructor(soundshotService) {
        this.soundshotService = soundshotService;
    }
    async execute(command) {
        const { id } = command;
        const recovered = await this.soundshotService.softRecover(id, {
            withDeleted: true
        });
        if (!recovered) {
            throw new common_1.NotFoundException(`Soundshot with ${id} cannot be recovered`);
        }
        return recovered;
    }
};
exports.RecoverSoundshotCommandHandler = RecoverSoundshotCommandHandler;
exports.RecoverSoundshotCommandHandler = RecoverSoundshotCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(recover_soundshot_command_1.RecoverSoundshotCommand),
    tslib_1.__metadata("design:paramtypes", [soundshot_service_1.SoundshotService])
], RecoverSoundshotCommandHandler);
//# sourceMappingURL=recover-soundshot-command.handler.js.map