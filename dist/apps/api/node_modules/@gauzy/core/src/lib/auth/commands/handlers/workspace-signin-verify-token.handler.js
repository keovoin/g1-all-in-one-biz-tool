"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceSigninVerifyTokenHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const workspace_signin_verify_token_command_1 = require("../workspace-signin-verify-token.command");
const auth_service_1 = require("../../auth.service");
let WorkspaceSigninVerifyTokenHandler = class WorkspaceSigninVerifyTokenHandler {
    constructor(authService) {
        this.authService = authService;
    }
    async execute(command) {
        try {
            const { input } = command;
            return await this.authService.workspaceSigninVerifyToken(input);
        }
        catch (error) {
            throw new common_1.UnauthorizedException();
        }
    }
};
exports.WorkspaceSigninVerifyTokenHandler = WorkspaceSigninVerifyTokenHandler;
exports.WorkspaceSigninVerifyTokenHandler = WorkspaceSigninVerifyTokenHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(workspace_signin_verify_token_command_1.WorkspaceSigninVerifyTokenCommand),
    tslib_1.__metadata("design:paramtypes", [auth_service_1.AuthService])
], WorkspaceSigninVerifyTokenHandler);
//# sourceMappingURL=workspace-signin-verify-token.handler.js.map