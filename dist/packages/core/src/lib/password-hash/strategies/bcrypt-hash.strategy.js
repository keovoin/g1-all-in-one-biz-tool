"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BcryptHashStrategy = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const config_1 = require("@gauzy/config");
/**
 * Bcrypt password hashing strategy (legacy, for backward compatibility).
 */
let BcryptHashStrategy = class BcryptHashStrategy {
    constructor() {
        this.BCRYPT_PREFIXES = ['$2a$', '$2b$', '$2y$'];
        this.saltRounds = config_1.environment.USER_PASSWORD_BCRYPT_SALT_ROUNDS || 12;
    }
    async hash(password) {
        return bcrypt.hash(password, this.saltRounds);
    }
    async verify(password, hashedPassword) {
        try {
            return await bcrypt.compare(password, hashedPassword);
        }
        catch {
            return false;
        }
    }
    getAlgorithmIdentifier() {
        return 'bcrypt';
    }
    canVerify(hashedPassword) {
        return this.BCRYPT_PREFIXES.some((prefix) => hashedPassword?.startsWith(prefix));
    }
};
exports.BcryptHashStrategy = BcryptHashStrategy;
exports.BcryptHashStrategy = BcryptHashStrategy = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [])
], BcryptHashStrategy);
//# sourceMappingURL=bcrypt-hash.strategy.js.map