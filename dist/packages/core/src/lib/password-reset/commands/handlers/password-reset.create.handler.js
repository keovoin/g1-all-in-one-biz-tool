"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordResetCreateHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const password_reset_create_command_1 = require("./../password-reset.create.command");
const password_reset_service_1 = require("./../../password-reset.service");
let PasswordResetCreateHandler = class PasswordResetCreateHandler {
    constructor(_passwordResetService) {
        this._passwordResetService = _passwordResetService;
    }
    /**
     * Execute a command to create a password reset request.
     *
     * @param {PasswordResetCreateCommand} command - The command object containing information for password reset creation.
     * @returns {Promise<any>} A Promise that resolves to the result of the password reset creation process or rejects with a BadRequestException in case of an error.
     */
    async execute(command) {
        try {
            const { input } = command;
            const { email, token, tenantId } = input;
            return await this._passwordResetService.create({
                email,
                tenantId,
                token
            });
        }
        catch (error) {
            throw new common_1.BadRequestException('Forgot password request failed!');
        }
    }
};
exports.PasswordResetCreateHandler = PasswordResetCreateHandler;
exports.PasswordResetCreateHandler = PasswordResetCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(password_reset_create_command_1.PasswordResetCreateCommand),
    tslib_1.__metadata("design:paramtypes", [password_reset_service_1.PasswordResetService])
], PasswordResetCreateHandler);
//# sourceMappingURL=password-reset.create.handler.js.map