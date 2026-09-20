"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomSmtpCreateHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const custom_smtp_service_1 = require("../../custom-smtp.service");
const custom_smtp_create_command_1 = require("../custom-smtp.create.command");
let CustomSmtpCreateHandler = class CustomSmtpCreateHandler {
    constructor(_customSmtpService) {
        this._customSmtpService = _customSmtpService;
    }
    async execute(command) {
        try {
            const { input } = command;
            return await this._customSmtpService.create(input);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
};
exports.CustomSmtpCreateHandler = CustomSmtpCreateHandler;
exports.CustomSmtpCreateHandler = CustomSmtpCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(custom_smtp_create_command_1.CustomSmtpCreateCommand),
    tslib_1.__metadata("design:paramtypes", [custom_smtp_service_1.CustomSmtpService])
], CustomSmtpCreateHandler);
//# sourceMappingURL=custom-smtp.create.handler.js.map