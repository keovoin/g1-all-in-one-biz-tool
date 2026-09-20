"use strict";
var PasswordHashService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordHashService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const interfaces_1 = require("./interfaces");
/**
 * Password hashing service that orchestrates multiple hashing strategies.
 * Supports transparent migration from legacy algorithms (bcrypt) to modern ones (scrypt).
 */
let PasswordHashService = PasswordHashService_1 = class PasswordHashService {
    constructor(defaultStrategy, strategies) {
        this.defaultStrategy = defaultStrategy;
        this.strategies = strategies;
        this.logger = new common_1.Logger(PasswordHashService_1.name);
    }
    async hash(password) {
        if (!password)
            throw new Error('Password must be a non-empty string');
        return this.defaultStrategy.hash(password);
    }
    async verify(password, hashedPassword) {
        if (!password || !hashedPassword)
            return false;
        const strategy = this.strategies.find((s) => s.canVerify(hashedPassword));
        if (!strategy) {
            this.logger.warn(`No strategy found for hash: ${hashedPassword.substring(0, 10)}...`);
            return false;
        }
        return strategy.verify(password, hashedPassword);
    }
    needsRehash(hashedPassword) {
        return hashedPassword ? !this.defaultStrategy.canVerify(hashedPassword) : false;
    }
    getDefaultAlgorithm() {
        return this.defaultStrategy.getAlgorithmIdentifier();
    }
};
exports.PasswordHashService = PasswordHashService;
exports.PasswordHashService = PasswordHashService = PasswordHashService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(interfaces_1.DEFAULT_PASSWORD_HASH_STRATEGY)),
    tslib_1.__param(1, (0, common_1.Inject)(interfaces_1.PASSWORD_HASH_STRATEGIES)),
    tslib_1.__metadata("design:paramtypes", [Object, Array])
], PasswordHashService);
//# sourceMappingURL=password-hash.service.js.map