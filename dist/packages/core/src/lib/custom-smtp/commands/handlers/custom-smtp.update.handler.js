"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomSmtpUpdateHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const custom_smtp_service_1 = require("../../custom-smtp.service");
const custom_smtp_update_command_1 = require("../custom-smtp.update.command");
let CustomSmtpUpdateHandler = class CustomSmtpUpdateHandler {
    constructor(_customSmtpService) {
        this._customSmtpService = _customSmtpService;
    }
    async execute(command) {
        try {
            const { id, input } = command;
            await this._customSmtpService.update(id, input);
            return await this._customSmtpService.findOneByIdString(id);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
};
exports.CustomSmtpUpdateHandler = CustomSmtpUpdateHandler;
exports.CustomSmtpUpdateHandler = CustomSmtpUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(custom_smtp_update_command_1.CustomSmtpUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [custom_smtp_service_1.CustomSmtpService])
], CustomSmtpUpdateHandler);
//# sourceMappingURL=custom-smtp.update.handler.js.map