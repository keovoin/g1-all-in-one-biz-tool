"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailResetCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const email_reset_create_command_1 = require("../email-reset.create.command");
const email_reset_service_1 = require("./../../email-reset.service");
let EmailResetCreateHandler = class EmailResetCreateHandler {
    constructor(_emailResetService) {
        this._emailResetService = _emailResetService;
    }
    async execute(command) {
        const { input } = command;
        const { email, oldEmail, code, userId, token } = input;
        try {
            return await this._emailResetService.create({
                email,
                oldEmail,
                code,
                userId,
                token
            });
        }
        catch (error) { }
    }
};
exports.EmailResetCreateHandler = EmailResetCreateHandler;
exports.EmailResetCreateHandler = EmailResetCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(email_reset_create_command_1.EmailResetCreateCommand),
    tslib_1.__metadata("design:paramtypes", [email_reset_service_1.EmailResetService])
], EmailResetCreateHandler);
//# sourceMappingURL=email-reset.create.handler.js.map