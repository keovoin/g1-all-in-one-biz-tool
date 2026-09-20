"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordHashModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const password_hash_service_1 = require("./password-hash.service");
const strategies_1 = require("./strategies");
const interfaces_1 = require("./interfaces");
/**
 * Global module providing password hashing services.
 * Uses scrypt for new hashes, bcrypt for legacy compatibility.
 */
let PasswordHashModule = class PasswordHashModule {
};
exports.PasswordHashModule = PasswordHashModule;
exports.PasswordHashModule = PasswordHashModule = tslib_1.__decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            strategies_1.BcryptHashStrategy,
            strategies_1.ScryptHashStrategy,
            {
                provide: interfaces_1.PASSWORD_HASH_STRATEGIES,
                useFactory: (bcrypt, scrypt) => [bcrypt, scrypt],
                inject: [strategies_1.BcryptHashStrategy, strategies_1.ScryptHashStrategy]
            },
            { provide: interfaces_1.DEFAULT_PASSWORD_HASH_STRATEGY, useExisting: strategies_1.ScryptHashStrategy },
            password_hash_service_1.PasswordHashService
        ],
        exports: [password_hash_service_1.PasswordHashService, interfaces_1.PASSWORD_HASH_STRATEGIES, interfaces_1.DEFAULT_PASSWORD_HASH_STRATEGY]
    })
], PasswordHashModule);
//# sourceMappingURL=password-hash.module.js.map