"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginAttemptModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const login_attempt_service_1 = require("./login-attempt.service");
/**
 * Standalone home for {@link LoginAttemptService}.
 *
 * Kept out of `AuthModule` so that modules which verify a credential of their own — the team
 * join-request code, for instance — can use the counter without importing the whole auth graph and
 * closing a require cycle. Its only dependency is the optional, globally registered `EVER_REDIS_CLIENT`.
 */
let LoginAttemptModule = class LoginAttemptModule {
};
exports.LoginAttemptModule = LoginAttemptModule;
exports.LoginAttemptModule = LoginAttemptModule = tslib_1.__decorate([
    (0, common_1.Module)({
        providers: [login_attempt_service_1.LoginAttemptService],
        exports: [login_attempt_service_1.LoginAttemptService]
    })
], LoginAttemptModule);
//# sourceMappingURL=login-attempt.module.js.map