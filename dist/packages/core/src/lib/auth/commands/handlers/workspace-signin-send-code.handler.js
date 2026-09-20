"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceSigninSendCodeCommandHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const workspace_signin_send_code_command_1 = require("../workspace-signin-send-code.command");
const auth_service_1 = require("../../auth.service");
let WorkspaceSigninSendCodeCommandHandler = class WorkspaceSigninSendCodeCommandHandler {
    constructor(authService) {
        this.authService = authService;
    }
    async execute(command) {
        try {
            const { input, locale = contracts_1.LanguagesEnum.ENGLISH } = command;
            await this.authService.sendWorkspaceSigninCode(input, locale);
        }
        finally {
            return new Object({
                status: common_1.HttpStatus.OK,
                message: `OK`
            });
        }
    }
};
exports.WorkspaceSigninSendCodeCommandHandler = WorkspaceSigninSendCodeCommandHandler;
exports.WorkspaceSigninSendCodeCommandHandler = WorkspaceSigninSendCodeCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(workspace_signin_send_code_command_1.WorkspaceSigninSendCodeCommand),
    tslib_1.__metadata("design:paramtypes", [auth_service_1.AuthService])
], WorkspaceSigninSendCodeCommandHandler);
//# sourceMappingURL=workspace-signin-send-code.handler.js.map