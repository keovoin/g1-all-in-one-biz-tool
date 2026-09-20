"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthLoginHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const auth_login_command_1 = require("../auth.login.command");
const auth_service_1 = require("../../auth.service");
let AuthLoginHandler = class AuthLoginHandler {
    constructor(authService) {
        this.authService = authService;
    }
    /**
     * Executes the authentication login command.
     *
     * @param command The authentication login command containing user input.
     * @returns A promise that resolves to an authentication response or null.
     */
    async execute(command) {
        const { input } = command;
        const { email, password } = input;
        return await this.authService.login({ email, password });
    }
};
exports.AuthLoginHandler = AuthLoginHandler;
exports.AuthLoginHandler = AuthLoginHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(auth_login_command_1.AuthLoginCommand),
    tslib_1.__metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthLoginHandler);
//# sourceMappingURL=auth.login.handler.js.map