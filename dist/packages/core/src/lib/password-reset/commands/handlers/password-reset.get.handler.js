"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordResetGetHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const password_reset_get_command_1 = require("./../password-reset.get.command");
const password_reset_service_1 = require("./../../password-reset.service");
let PasswordResetGetHandler = class PasswordResetGetHandler {
    constructor(_passwordResetService) {
        this._passwordResetService = _passwordResetService;
    }
    /**
     * Executes the PasswordResetGetCommand to retrieve a password reset entry.
     *
     * This method searches for a password reset entry based on the provided token and returns the latest entry (sorted by createdAt in descending order).
     *
     * - If the token is found, the corresponding password reset entry is returned.
     * - If no matching token is found, a NotFoundException is thrown.
     *
     * @param {PasswordResetGetCommand} command - The command containing the input data, specifically the token for the password reset request.
     * @returns {Promise<IPasswordReset>} - A promise that resolves to the matching password reset entry.
     * @throws {NotFoundException} - If no password reset entry is found for the provided token.
     */
    async execute(command) {
        try {
            // Extract the token from the command input
            const { token } = command.input;
            // Find the password reset entry using the token
            return await this._passwordResetService.findOneByOptions({
                where: { token, isActive: true, isArchived: false },
                order: { createdAt: 'DESC' }
            });
        }
        catch (error) {
            // Handle errors and return an appropriate error response
            throw new common_1.HttpException(`Forgot password request failed!`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.PasswordResetGetHandler = PasswordResetGetHandler;
exports.PasswordResetGetHandler = PasswordResetGetHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(password_reset_get_command_1.PasswordResetGetCommand),
    tslib_1.__metadata("design:paramtypes", [password_reset_service_1.PasswordResetService])
], PasswordResetGetHandler);
//# sourceMappingURL=password-reset.get.handler.js.map